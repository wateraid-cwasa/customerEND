// Builds the customer's water bill as a PDF, laid out like the CWASA bill template (BILL_DOCX_FINAL.docx).
// Pure TypeScript with no React Native imports, so it runs on web, Android, iOS and in Vitest.

import 'regenerator-runtime/runtime'; // the Bangla shaping code in fontkit needs this global
import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, rgb, StandardFonts, type PDFFont, type PDFPage } from 'pdf-lib';
import type { BillDetail } from './billLogic';
import { PAYABLE_NOTE_PNG, WASA_LOGO_PNG, WASA_TITLE_BN_PNG } from './billPdfImages';

export const VAT_REGISTRATION_NO = '000494029';

export type BillPdfCopy = 'CONSUMER COPY' | 'CWASA COPY';

// Details the bill response may not carry. They fill the gaps, for example from the customer profile.
export type BillPdfFallback = {
  accountNo?: string | null;
  customerName?: string | null;
  address?: string | null;
  mobileNo?: string | null;
  meterNo?: string | null;
  wardNo?: string | null;
  areaName?: string | null;
  connectionSize?: string | null;
  category?: string | null;
};

export type BillPdfOptions = {
  fallback?: BillPdfFallback;
  // Bengali font file (for example Shurjo-Regular.ttf), or a function that loads it. Needed only when a
  // name or address contains Bangla letters. Without it those letters are replaced by "?".
  banglaFont?: Uint8Array | (() => Promise<Uint8Array>);
  // Default is the consumer copy only. Pass both to print the full template page.
  copies?: readonly BillPdfCopy[];
};

export type BillPdfModel = {
  readerCode: string;
  monthLabel: string;
  copyLabel: string;
  name: string;
  addressLines: string[];
  contact: string;
  accountNo: string;
  wardNo: string;
  meterNo: string;
  size: string;
  area: string;
  category: string;
  billNo: string;
  issueDate: string;
  dueDate: string;
  presentReading: string;
  presentReadingDate: string;
  previousReading: string;
  previousReadingDate: string;
  daysLabel: string;
  consumption: string;
  amount: string;
  rateLabel: string;
  vatLabel: string;
  vatAmount: string;
  netPayable: string;
  surcharges: { label: string; amount: string; date: string; total: string }[];
  arrear: string;
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const BANGLA = /[ঀ-৿]/;

// ----- text helpers (exported for tests) -----

export function formatMoney(value: number | null | undefined): string {
  const safe = typeof value === 'number' && Number.isFinite(value) ? value : 0;
  return safe.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// dd/mm/yy, read in UTC so the printed date is the date the server sent.
export function formatShortDate(value: string | null | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(date.getUTCDate())}/${pad(date.getUTCMonth() + 1)}/${pad(date.getUTCFullYear() % 100)}`;
}

// The database column WCONSIZE holds only the number (for example 1 or 2). The bill prints it as "1 INCH".
export function formatConnectionSize(value: string | null | undefined): string {
  const text = (value ?? '').trim();
  if (!text) return '-';
  if (/^\d+(\.\d+)?$/.test(text)) return `${text} INCH`;
  return text.toUpperCase();
}

export function categoryLabel(value: string | null | undefined): string {
  const raw = (value ?? '').trim();
  if (!raw) return '-';
  const key = raw.toUpperCase().replace(/[\s_-]+/g, '');
  if (key === 'RESIDENTIAL' || key === 'DOMESTIC') return 'Domestic';
  if (key === 'NONDOMESTIC') return 'Non-Domestic';
  return raw
    .toLowerCase()
    .replace(/[_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

// A safe file name: bill number, letters, digits, dash and underscore only.
export function billPdfFileName(bill: Pick<BillDetail, 'billNumber' | 'id'>): string {
  const base = (bill.billNumber || bill.id || 'bill').replace(/[^A-Za-z0-9_-]+/g, '_').replace(/^_+|_+$/g, '');
  return `${base || 'bill'}.pdf`;
}

function percentText(value: number | null): string {
  if (value === null) return '';
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

function monthLabelFor(bill: BillDetail): string {
  if (bill.billingMonth !== null && bill.billingYear !== null && bill.billingMonth >= 1 && bill.billingMonth <= 12) {
    return `${MONTHS[bill.billingMonth - 1]} ${bill.billingYear}`;
  }
  const source = bill.periodEnd ?? bill.issueDate;
  const date = source ? new Date(source) : null;
  if (date && !Number.isNaN(date.getTime())) return `${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
  return '';
}

function daysLabelFor(bill: BillDetail): string {
  let days = bill.consumptionDays;
  if (days === null && bill.previousReadingDate && bill.currentReadingDate) {
    const from = new Date(bill.previousReadingDate).getTime();
    const to = new Date(bill.currentReadingDate).getTime();
    if (!Number.isNaN(from) && !Number.isNaN(to) && to >= from) days = Math.round((to - from) / 86_400_000);
  }
  return days === null ? '' : `${days} Days`;
}

// Turns a bill into the exact strings printed on the template.
export function toBillPdfModel(
  bill: BillDetail,
  fallback: BillPdfFallback = {},
  copyLabel: BillPdfCopy = 'CONSUMER COPY',
): BillPdfModel {
  const addressText =
    bill.addressLines.length > 0 ? bill.addressLines.join(', ') : (bill.address ?? fallback.address ?? '');
  const amount = bill.waterCharge + bill.additionalCharge;
  const steps = [...bill.surcharges].sort((a, b) => a.deadline.localeCompare(b.deadline)).slice(0, 3);
  return {
    readerCode: bill.meterReaderCode ?? '',
    monthLabel: monthLabelFor(bill),
    copyLabel,
    name: (bill.holderName ?? fallback.customerName ?? '').trim(),
    addressLines: bill.addressLines.length > 0 ? bill.addressLines.map((item) => item.trim()) : [addressText.trim()],
    contact: bill.contactNo ?? fallback.mobileNo ?? '',
    accountNo: bill.accountNo ?? fallback.accountNo ?? '',
    wardNo: bill.wardNo ?? fallback.wardNo ?? '',
    meterNo: bill.meterNo ?? fallback.meterNo ?? '',
    size: formatConnectionSize(bill.connectionSize ?? fallback.connectionSize),
    area: bill.areaName ?? fallback.areaName ?? '-',
    category: categoryLabel(bill.category ?? fallback.category),
    billNo: bill.billNumber,
    issueDate: formatShortDate(bill.issueDate),
    dueDate: formatShortDate(bill.dueDate),
    presentReading: bill.currentReading === null ? '' : formatMoney(bill.currentReading),
    presentReadingDate: formatShortDate(bill.currentReadingDate ?? bill.periodEnd),
    previousReading: bill.previousReading === null ? '' : formatMoney(bill.previousReading),
    previousReadingDate: formatShortDate(bill.previousReadingDate),
    daysLabel: daysLabelFor(bill),
    consumption: bill.consumption === null ? '' : formatMoney(bill.consumption),
    amount: formatMoney(amount),
    rateLabel: bill.ratePerM3 === null ? '' : `@TK.${formatMoney(bill.ratePerM3)}/CM`,
    vatLabel: `VAT @${percentText(bill.vatPercentage)}% Rgd. No. ${VAT_REGISTRATION_NO}`,
    vatAmount: formatMoney(bill.vatAmount),
    netPayable: formatMoney(bill.netPayable),
    surcharges: steps.map((step) => ({
      label: `@${String(Math.round(step.percentage)).padStart(2, '0')}% TK.`,
      amount: formatMoney(step.surchargeAmount),
      date: formatShortDate(step.deadline),
      total: formatMoney(step.totalPayable),
    })),
    arrear: formatMoney(bill.arrears),
  };
}

// ----- drawing -----

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const PAGE_TOP_SHIFT = -60; // the template starts lower because of its top note; the note now sits inside each copy
const FRAME_RIGHT = 571.9;
const COPY_STEP = 271.9; // distance between the two copies on the template page
const RIGHT_EDGE = 392.5; // numbers are right aligned to this x
const INK = rgb(0, 0, 0);

type Fonts = {
  regular: PDFFont;
  bold: PDFFont;
  bangla: PDFFont | null;
};

type Pen = {
  page: PDFPage;
  fonts: Fonts;
  dy: number; // vertical shift for this copy
};

function cleanFor(font: PDFFont, text: string): string {
  const allowed = new Set(font.getCharacterSet());
  let out = '';
  for (const char of text.replace(/[\r\n\t]+/g, ' ')) {
    const code = char.codePointAt(0) ?? 63;
    out += allowed.has(code) ? char : '?';
  }
  return out;
}

function pickFont(pen: Pen, text: string, bold: boolean): PDFFont {
  if (pen.fonts.bangla && BANGLA.test(text)) return pen.fonts.bangla;
  return bold ? pen.fonts.bold : pen.fonts.regular;
}

// `top` is the top of the text line, measured from the top of the page, as in the template.
function text(
  pen: Pen,
  value: string,
  x: number,
  top: number,
  options: { size?: number; bold?: boolean; align?: 'left' | 'right' | 'center' } = {},
): void {
  if (!value) return;
  const font = pickFont(pen, value, options.bold ?? false);
  // Shurjo letters are drawn small for their size, so Bangla text is scaled up a little.
  const size = (options.size ?? 8) * (font === pen.fonts.bangla ? 1.12 : 1);
  const safe = cleanFor(font, value);
  const width = font.widthOfTextAtSize(safe, size);
  const left = options.align === 'right' ? x - width : options.align === 'center' ? x - width / 2 : x;
  const baseline = PAGE_HEIGHT - (top + pen.dy + 0.905 * size);
  pen.page.drawText(safe, { x: left, y: baseline, size, font, color: INK });
}

function line(pen: Pen, x1: number, x2: number, top: number, thickness: number): void {
  const y = PAGE_HEIGHT - (top + pen.dy);
  pen.page.drawLine({ start: { x: x1, y }, end: { x: x2, y }, thickness, color: INK });
}

function fit(pen: Pen, value: string, maxWidth: number, size: number): string {
  const font = pickFont(pen, value, false);
  let safe = cleanFor(font, value);
  if (font.widthOfTextAtSize(safe, size) <= maxWidth) return safe;
  while (safe.length > 1 && font.widthOfTextAtSize(`${safe}...`, size) > maxWidth) safe = safe.slice(0, -1);
  return `${safe.trimEnd()}...`;
}

// Splits text into at most `maxLines` lines that fit `maxWidth`, adding "..." if text is left over.
function wrap(pen: Pen, value: string, maxWidth: number, size: number, maxLines: number): string[] {
  const words = value.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';
  let index = 0;
  while (index < words.length && lines.length < maxLines) {
    const candidate = current ? `${current} ${words[index]}` : words[index];
    const font = pickFont(pen, candidate, false);
    if (font.widthOfTextAtSize(cleanFor(font, candidate), size) <= maxWidth || !current) {
      current = candidate;
      index += 1;
    } else {
      lines.push(current);
      current = '';
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  if (index < words.length && lines.length > 0) {
    lines[lines.length - 1] = fit(pen, `${lines[lines.length - 1]} ${words.slice(index).join(' ')}`, maxWidth, size);
  }
  return lines.map((item) => fit(pen, item, maxWidth, size));
}

type Images = {
  logo: Awaited<ReturnType<PDFDocument['embedPng']>>;
  title: Awaited<ReturnType<PDFDocument['embedPng']>>;
  note: Awaited<ReturnType<PDFDocument['embedPng']>>;
};

function drawCopy(pen: Pen, model: BillPdfModel, images: Images): void {
  const { page, dy } = pen;
  const imageY = (top: number, height: number) => PAGE_HEIGHT - (top + dy + height);

  // Header: logo, reader code, month, Bangla title, copy label box.
  page.drawImage(images.logo, { x: 33.1, y: imageY(119.8, 22.3), width: 57.6, height: 22.3 });
  page.drawImage(images.title, { x: 255.6, y: imageY(119.5, 21.7), width: 68.4, height: 21.7 });
  text(pen, model.readerCode, 104.5, 120.6, { size: 8.5 });
  text(pen, model.monthLabel, 144.7, 120.6, { size: 8.5, bold: true });
  const boxLeft = 368.3;
  const boxTop = 126.6;
  const boxWidth = 181.4;
  const boxHeight = 13.7;
  const boxBottom = PAGE_HEIGHT - (boxTop + dy + boxHeight);
  page.drawRectangle({ x: boxLeft + 1.5, y: boxBottom - 1.5, width: boxWidth, height: boxHeight, color: INK });
  page.drawRectangle({ x: boxLeft, y: boxBottom, width: boxWidth, height: boxHeight, color: rgb(1, 1, 1), borderColor: INK, borderWidth: 1 });
  text(pen, model.copyLabel, boxLeft + boxWidth / 2, 129.6, { size: 7, bold: true, align: 'center' });

  // Customer block (left) and bill block (right).
  text(pen, 'NAME :', 33.2, 146.7);
  text(pen, fit(pen, model.name, 305, 8), 86.2, 146.7);
  text(pen, 'ADDRESS :', 33.2, 157.6);
  // Two address lines as the server sends them; one long line is wrapped over two lines.
  const addressLines = model.addressLines.length >= 2
    ? model.addressLines.slice(0, 2).map((item) => fit(pen, item, 305, 8))
    : wrap(pen, model.addressLines.join(' '), 305, 8, 2);
  addressLines.forEach((item, index) => text(pen, item, 86.2, 157.6 + index * 10.9));
  text(pen, 'CONTACT :', 33.2, 179.4);
  text(pen, model.contact, 86.2, 179.4);

  text(pen, 'BILL NO :', 403.4, 146.7);
  text(pen, model.billNo, 459.7, 146.7);
  text(pen, 'ISSUE DATE :', 403.4, 157.6);
  text(pen, model.issueDate, 459.7, 157.6);
  text(pen, 'DUE DATE OF PAYMENT :', 403.4, 168.5);
  text(pen, model.dueDate, 505.8, 168.5);

  line(pen, 32.4, 562.7, 190.0, 0.75);
  text(pen, 'A/C NO :', 33.2, 190.9);
  text(pen, model.accountNo, 86.2, 190.9);
  text(pen, 'WARD NO :', 186.1, 190.9);
  text(pen, model.wardNo, 246.9, 190.9);
  text(pen, 'AREA :', 355.1, 190.9);
  text(pen, fit(pen, model.area, 140, 8), 420.9, 190.9);
  text(pen, 'METER NO :', 33.2, 201.8);
  text(pen, model.meterNo, 86.2, 201.8);
  text(pen, 'SIZE :', 186.1, 201.8);
  text(pen, model.size, 246.9, 201.8);
  text(pen, 'CATEGORY :', 355.1, 201.8);
  text(pen, fit(pen, model.category, 140, 8), 420.9, 201.8);
  line(pen, 32.4, 562.7, 212.7, 0.75);

  // Readings and charges.
  text(pen, 'PRESENT READING-DATE', 33.2, 213.6);
  text(pen, model.presentReading, RIGHT_EDGE, 213.6, { align: 'right' });
  text(pen, model.presentReadingDate, 398.9, 213.6);
  text(pen, 'PREVIOUS READING-DATE', 33.2, 225.7);
  text(pen, model.previousReading, RIGHT_EDGE, 225.7, { align: 'right' });
  text(pen, model.previousReadingDate, 398.9, 225.7);
  text(pen, model.daysLabel, 456.7, 225.7);
  line(pen, 291.3, 393.5, 237.5, 0.7);
  text(pen, 'CONSUMPTION :', 33.2, 238.5);
  text(pen, model.consumption, RIGHT_EDGE, 238.5, { align: 'right' });
  line(pen, 291.3, 393.5, 253.3, 0.7);
  text(pen, 'AMOUNT', 33.2, 254.5);
  text(pen, model.amount, RIGHT_EDGE, 254.5, { align: 'right' });
  text(pen, model.rateLabel, 398.9, 254.5);
  text(pen, model.vatLabel, 33.2, 266.6);
  text(pen, model.vatAmount, RIGHT_EDGE, 266.6, { align: 'right' });
  line(pen, 291.3, 393.5, 281.4, 0.7);
  text(pen, 'NET PAYABLE', 33.2, 282.6);
  text(pen, model.netPayable, RIGHT_EDGE, 282.6, { align: 'right' });
  line(pen, 291.3, 393.5, 298.3, 0.7);

  text(pen, 'SURCHARGE', 33.2, 300.3);
  model.surcharges.forEach((step, index) => {
    const top = 320.5 + index * 13.7;
    text(pen, step.label, 113.0, top);
    text(pen, step.amount, 174.7, top);
    text(pen, step.date, 237.8, top);
    text(pen, step.total, RIGHT_EDGE, top, { align: 'right' });
  });

  // "Payable in any bank" note, bottom right of every copy: top and left lines, then Seal and Officer.
  const noteLeft = 398.5;
  const noteTop = 290.2;
  const noteEnd = 381.5;
  line(pen, noteLeft, FRAME_RIGHT, noteTop, 0.75);
  pen.page.drawLine({
    start: { x: noteLeft, y: PAGE_HEIGHT - (noteTop + pen.dy) },
    end: { x: noteLeft, y: PAGE_HEIGHT - (noteEnd + pen.dy) },
    thickness: 0.75,
    color: INK,
  });
  pen.page.drawImage(images.note, {
    x: (noteLeft + FRAME_RIGHT) / 2 - 75.5,
    y: PAGE_HEIGHT - (noteTop + pen.dy + 3.5 + 58.6),
    width: 151,
    height: 58.6,
  });
  text(pen, 'Seal', noteLeft + 11, 368.6);
  text(pen, 'Officer', noteLeft + 121, 368.6);

  // Footer.
  text(pen, 'ARREAR TK.', 33.2, 368.6, { bold: true });
  text(pen, model.arrear, 87.1, 368.6);
  text(pen, '(Not Included)', 33.2, 377.8, { size: 6.5 });
  text(pen, 'NB:Automatic generated bill,does not require signature', 173.2, 368.6, { size: 6 });
  // The source line is printed under the consumer copy only.
  if (model.copyLabel === 'CONSUMER COPY') {
    text(pen, 'Source: ICT Circle', 109.7, 378.6, { size: 6.5 });
    text(pen, 'Chief Revenue Officer Tel: 618347', 211.9, 378.6, { size: 6.5 });
  }
}

async function loadBanglaBytes(source: BillPdfOptions['banglaFont']): Promise<Uint8Array | null> {
  if (!source) return null;
  try {
    return typeof source === 'function' ? await source() : source;
  } catch {
    return null;
  }
}

// Builds the PDF and returns its bytes. The file name to save it under is billPdfFileName(bill).
export async function buildBillPdf(bill: BillDetail, options: BillPdfOptions = {}): Promise<Uint8Array> {
  const copies = options.copies && options.copies.length > 0 ? options.copies : (['CWASA COPY', 'CONSUMER COPY'] as const);

  const pdf = await PDFDocument.create();
  pdf.setTitle(`Water bill ${bill.billNumber}`);
  pdf.setAuthor('Chattogram WASA');
  pdf.setSubject(`Water bill ${bill.billNumber}`);
  pdf.setCreator('CWASA Customer Platform');

  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const needsBangla = [bill.holderName, bill.address, bill.areaName, options.fallback?.customerName, options.fallback?.address]
    .some((value) => typeof value === 'string' && BANGLA.test(value));
  let bangla: PDFFont | null = null;
  if (needsBangla) {
    const bytes = await loadBanglaBytes(options.banglaFont);
    if (bytes) {
      pdf.registerFontkit(fontkit);
      bangla = await pdf.embedFont(bytes, { subset: true });
    }
  }

  const images: Images = {
    logo: await pdf.embedPng(WASA_LOGO_PNG),
    title: await pdf.embedPng(WASA_TITLE_BN_PNG),
    note: await pdf.embedPng(PAYABLE_NOTE_PNG),
  };

  const page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  const fonts: Fonts = { regular, bold, bangla };

  const frameTop = 108 + PAGE_TOP_SHIFT;
  const frameBottom = 407.1 + PAGE_TOP_SHIFT + (copies.length - 1) * COPY_STEP;
  page.drawRectangle({
    x: 19.5,
    y: PAGE_HEIGHT - frameBottom,
    width: 552.4,
    height: frameBottom - frameTop,
    borderColor: INK,
    borderWidth: 1,
  });

  copies.forEach((copy, index) => {
    const model = toBillPdfModel(bill, options.fallback, copy);
    drawCopy({ page, fonts, dy: PAGE_TOP_SHIFT + index * COPY_STEP }, model, images);
  });

  for (let index = 1; index < copies.length; index += 1) {
    // Two dotted lines between the CWASA copy and the consumer copy, as on the printed bill.
    for (const top of [385.8, 388.8]) {
      const y = PAGE_HEIGHT - (top + PAGE_TOP_SHIFT + (index - 1) * COPY_STEP);
      const sideGap = 15;
      page.drawLine({ start: { x: 19.5 + sideGap, y }, end: { x: FRAME_RIGHT - sideGap, y }, thickness: 1, color: INK, dashArray: [.75, .8] });
    }
  }

  return pdf.save();
}
