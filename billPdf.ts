// Builds the customer's water bill as a PDF, laid out like the CWASA bill template (BILL_DOCX_FINAL.docx).
// Pure TypeScript with no React Native imports, so it runs on web, Android, iOS and in Vitest.

import "regenerator-runtime/runtime"; // the Bangla shaping code in fontkit needs this global
import fontkit from "@pdf-lib/fontkit";
import {
  PDFDocument,
  rgb,
  StandardFonts,
  type PDFFont,
  type PDFPage,
} from "pdf-lib";
import type { BillDetail } from "./billLogic";
import { formatConnectionSize } from "./billLogic";
import {
  PAYABLE_NOTE_PNG,
  WASA_LOGO_PNG,
  WASA_TITLE_BN_PNG,
} from "./billPdfImages";

export const VAT_REGISTRATION_NO = "000494029";

export type BillPdfCopy = "CONSUMER COPY" | "CWASA COPY";

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
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const BANGLA = /[ঀ-৿]/;

// ----- text helpers (exported for tests) -----

export function formatMoney(value: number | null | undefined): string {
  const safe = typeof value === "number" && Number.isFinite(value) ? value : 0;
  return safe.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// dd/mm/yy, read in UTC so the printed date is the date the server sent.
export function formatShortDate(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getUTCDate())}/${pad(date.getUTCMonth() + 1)}/${pad(date.getUTCFullYear() % 100)}`;
}

export { formatConnectionSize };

export function categoryLabel(value: string | null | undefined): string {
  const raw = (value ?? "").trim();
  if (!raw) return "-";
  const key = raw.toUpperCase().replace(/[\s_-]+/g, "");
  if (key === "RESIDENTIAL" || key === "DOMESTIC") return "Domestic";
  if (key === "NONDOMESTIC") return "Non-Domestic";
  return raw
    .toLowerCase()
    .replace(/[_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

// A safe file name: bill number, letters, digits, dash and underscore only.
export function billPdfFileName(
  bill: Pick<BillDetail, "billNumber" | "id">,
): string {
  const base = (bill.billNumber || bill.id || "bill")
    .replace(/[^A-Za-z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `${base || "bill"}.pdf`;
}

function percentText(value: number | null): string {
  if (value === null) return "";
  return Number.isInteger(value)
    ? String(value)
    : String(Number(value.toFixed(2)));
}

function monthLabelFor(bill: BillDetail): string {
  if (
    bill.billingMonth !== null &&
    bill.billingYear !== null &&
    bill.billingMonth >= 1 &&
    bill.billingMonth <= 12
  ) {
    return `${MONTHS[bill.billingMonth - 1]} ${bill.billingYear}`;
  }
  const source = bill.periodEnd ?? bill.issueDate;
  const date = source ? new Date(source) : null;
  if (date && !Number.isNaN(date.getTime()))
    return `${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
  return "";
}

function daysLabelFor(bill: BillDetail): string {
  let days = bill.consumptionDays;
  if (days === null && bill.previousReadingDate && bill.currentReadingDate) {
    const from = new Date(bill.previousReadingDate).getTime();
    const to = new Date(bill.currentReadingDate).getTime();
    if (!Number.isNaN(from) && !Number.isNaN(to) && to >= from)
      days = Math.round((to - from) / 86_400_000);
  }
  return days === null ? "" : `${days} Days`;
}

// Turns a bill into the exact strings printed on the template.
export function toBillPdfModel(
  bill: BillDetail,
  fallback: BillPdfFallback = {},
  copyLabel: BillPdfCopy = "CONSUMER COPY",
): BillPdfModel {
  const addressText =
    bill.addressLines.length > 0
      ? bill.addressLines.join(", ")
      : (bill.address ?? fallback.address ?? "");
  const amount = bill.waterCharge + bill.additionalCharge;
  const steps = [...bill.surcharges]
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 3);
  return {
    readerCode: bill.meterReaderCode ?? "",
    monthLabel: monthLabelFor(bill),
    copyLabel,
    name: (bill.holderName ?? fallback.customerName ?? "").trim(),
    addressLines:
      bill.addressLines.length > 0
        ? bill.addressLines.map((item) => item.trim())
        : [addressText.trim()],
    contact: bill.contactNo ?? fallback.mobileNo ?? "",
    accountNo: bill.accountNo ?? fallback.accountNo ?? "",
    wardNo: bill.wardNo ?? fallback.wardNo ?? "",
    meterNo: bill.meterNo ?? fallback.meterNo ?? "",
    size: formatConnectionSize(bill.connectionSize ?? fallback.connectionSize),
    area: bill.areaName ?? fallback.areaName ?? "-",
    category: categoryLabel(bill.category ?? fallback.category),
    billNo: bill.billNumber,
    issueDate: formatShortDate(bill.issueDate),
    dueDate: formatShortDate(bill.dueDate),
    presentReading:
      bill.currentReading === null ? "" : formatMoney(bill.currentReading),
    presentReadingDate: formatShortDate(
      bill.currentReadingDate ?? bill.periodEnd,
    ),
    previousReading:
      bill.previousReading === null ? "" : formatMoney(bill.previousReading),
    previousReadingDate: formatShortDate(bill.previousReadingDate),
    daysLabel: daysLabelFor(bill),
    consumption: bill.consumption === null ? "" : formatMoney(bill.consumption),
    amount: formatMoney(amount),
    rateLabel:
      bill.ratePerM3 === null ? "" : `@TK.${formatMoney(bill.ratePerM3)}/CM`,
    vatLabel: `VAT @${percentText(bill.vatPercentage)}% Rgd. No. ${VAT_REGISTRATION_NO}`,
    vatAmount: formatMoney(bill.vatAmount),
    netPayable: formatMoney(bill.netPayable),
    surcharges: steps.map((step) => ({
      label: `@${String(Math.round(step.percentage)).padStart(2, "0")}% TK.`,
      amount: formatMoney(step.surchargeAmount),
      date: formatShortDate(step.deadline),
      total: formatMoney(step.totalPayable),
    })),
    arrear: formatMoney(bill.arrears),
  };
}

// ----- drawing -----

const PAGE_WIDTH = 550.28;
const PAGE_HEIGHT = 750.89;
const PAGE_TOP_SHIFT = -60; // the template starts lower because of its top note; the note now sits inside each copy
const FRAME_RIGHT = 519.4;
const COPY_STEP = 315.0; // distance between the two copies, as on the sample bill
const NOTE_TOP = 338.8; // top line of the "Payable in any bank" box
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
  let out = "";
  for (const char of text.replace(/[\r\n\t]+/g, " ")) {
    const code = char.codePointAt(0) ?? 63;
    out += allowed.has(code) ? char : "?";
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
  options: {
    size?: number;
    bold?: boolean;
    align?: "left" | "right" | "center";
  } = {},
): void {
  if (!value) return;
  const font = pickFont(pen, value, options.bold ?? false);
  // Shurjo letters are drawn small for their size, so Bangla text is scaled up a little.
  const size = (options.size ?? 8) * (font === pen.fonts.bangla ? 1.12 : 1);
  const safe = cleanFor(font, value);
  const width = font.widthOfTextAtSize(safe, size);
  const left =
    options.align === "right"
      ? x - width
      : options.align === "center"
        ? x - width / 2
        : x;
  const baseline = PAGE_HEIGHT - (top + pen.dy + 0.905 * size);
  pen.page.drawText(safe, { x: left, y: baseline, size, font, color: INK });
}

function line(
  pen: Pen,
  x1: number,
  x2: number,
  top: number,
  thickness: number,
): void {
  const y = PAGE_HEIGHT - (top + pen.dy);
  pen.page.drawLine({
    start: { x: x1, y },
    end: { x: x2, y },
    thickness,
    color: INK,
  });
}

function fit(pen: Pen, value: string, maxWidth: number, size: number): string {
  const font = pickFont(pen, value, false);
  let safe = cleanFor(font, value);
  if (font.widthOfTextAtSize(safe, size) <= maxWidth) return safe;
  while (
    safe.length > 1 &&
    font.widthOfTextAtSize(`${safe}...`, size) > maxWidth
  )
    safe = safe.slice(0, -1);
  return `${safe.trimEnd()}...`;
}

// Splits text into at most `maxLines` lines that fit `maxWidth`, adding "..." if text is left over.
function wrap(
  pen: Pen,
  value: string,
  maxWidth: number,
  size: number,
  maxLines: number,
): string[] {
  const words = value.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  let index = 0;
  while (index < words.length && lines.length < maxLines) {
    const candidate = current ? `${current} ${words[index]}` : words[index];
    const font = pickFont(pen, candidate, false);
    if (
      font.widthOfTextAtSize(cleanFor(font, candidate), size) <= maxWidth ||
      !current
    ) {
      current = candidate;
      index += 1;
    } else {
      lines.push(current);
      current = "";
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  if (index < words.length && lines.length > 0) {
    lines[lines.length - 1] = fit(
      pen,
      `${lines[lines.length - 1]} ${words.slice(index).join(" ")}`,
      maxWidth,
      size,
    );
  }
  return lines.map((item) => fit(pen, item, maxWidth, size));
}

type Images = {
  logo: Awaited<ReturnType<PDFDocument["embedPng"]>>;
  title: Awaited<ReturnType<PDFDocument["embedPng"]>>;
  note: Awaited<ReturnType<PDFDocument["embedPng"]>>;
};

// Row and column positions follow the CWASA monthly bill run sample (monthlybillrun.pdf). Rows are tops in points,
// measured from the page top of the first copy. Columns on the left of the page are measured from the frame's left
// edge and columns on the right from its right edge, like the sample.
const ROW = {
  header: 120.6,
  name: 142.6,
  address: 155.1,
  addressSecond: 169.2,
  issue: 158.4,
  contact: 180.5,
  due: 172.9,
  accountRow: 194.8,
  meterRow: 209.5,
  present: 234.8,
  days: 244.6,
  previous: 249.8,
  consumption: 274.1,
  amount: 293.1,
  rate: 292.0,
  vat: 307.8,
  net: 328.1,
  surchargeTitle: 347.1,
  surcharge: [359.7, 375.1, 389.4],
  arrear: 408.6,
  notIncluded: 418.4,
  source: 420.2,
} as const;

function drawCopy(pen: Pen, model: BillPdfModel, images: Images): void {
  const { page, dy } = pen;
  const imageY = (top: number, height: number) =>
    PAGE_HEIGHT - (top + dy + height);

  // Header: logo, reader code, month, Bangla title, copy label box.
  page.drawImage(images.logo, {
    x: 33.1,
    y: imageY(115.5, 22.3),
    width: 57.6,
    height: 22.3,
  });
  page.drawImage(images.title, {
    x: 243.2,
    y: imageY(116.9, 21.7),
    width: 68.4,
    height: 21.7,
  });
  text(pen, model.readerCode, 113.3, ROW.header, { size: 8.5 });
  text(pen, model.monthLabel, 172.4, ROW.header, { size: 8.5, bold: true });
  const boxLeft = 358.3;
  const boxTop = 117.5;
  const boxWidth = 121.4;
  const boxHeight = 13.7;
  const boxBottom = PAGE_HEIGHT - (boxTop + dy + boxHeight);
  page.drawRectangle({
    x: boxLeft + 1.5,
    y: boxBottom - 1.5,
    width: boxWidth,
    height: boxHeight,
    color: INK,
  });
  page.drawRectangle({
    x: boxLeft,
    y: boxBottom,
    width: boxWidth,
    height: boxHeight,
    color: rgb(1, 1, 1),
    borderColor: INK,
    borderWidth: 1,
  });
  text(pen, model.copyLabel, boxLeft + boxWidth / 2, 120.5, {
    size: 7,
    bold: true,
    align: "center",
  });
  line(pen, 35.4, 500.2, 140.4, 0.75);
  // Customer block (left) and bill block (right).
  text(pen, "NAME :", 35.4, ROW.name);
  text(pen, fit(pen, model.name, 305, 8), 86.3, ROW.name);
  text(pen, "ADDRESS :", 35.4, ROW.address);
  // Two address lines as the server sends them; one long line is wrapped over two lines.
  const addressLines =
    model.addressLines.length >= 2
      ? model.addressLines.slice(0, 2).map((item) => fit(pen, item, 305, 8))
      : wrap(pen, model.addressLines.join(" "), 305, 8, 2);
  addressLines.forEach((item, index) =>
    text(pen, item, 85.7, index === 0 ? ROW.address : ROW.addressSecond),
  );
  text(pen, "CONTACT :", 35.4, ROW.contact);
  text(pen, model.contact, 86.9, ROW.contact);

  text(pen, "BILL NO :", 350.3, ROW.name);
  text(pen, model.billNo, 419.0, ROW.name);

  text(pen, "ISSUE DATE :", 350.3, ROW.issue);
  text(pen, model.issueDate, 420.9, ROW.issue);

  text(pen, "DUE DATE OF PAYMENT :", 350.3, ROW.due);
  text(pen, model.dueDate, 456.5, ROW.due);

  line(pen, 35.4, 500.2, 192.4, 0.75);
  text(pen, "A/C NO :", 37.2, ROW.accountRow);
  text(pen, model.accountNo, 90.0, ROW.accountRow);
  text(pen, "WARD NO :", 180.2, ROW.accountRow);
  text(pen, model.wardNo, 232.3, ROW.accountRow);
  text(pen, "AREA :", 302.4, ROW.accountRow);
  text(pen, fit(pen, model.area, 90, 8), 369.3, ROW.accountRow);
  text(pen, "METER NO :", 38.2, ROW.meterRow);
  text(pen, model.meterNo, 86.9, ROW.meterRow);
  text(pen, "SIZE :", 180.8, ROW.meterRow);
  text(pen, model.size, 231.1, ROW.meterRow);
  text(pen, "CATEGORY :", 302.4, ROW.meterRow);
  text(pen, fit(pen, model.category, 140, 8), 368.7, ROW.meterRow);
  line(pen, 35.4, 500.2, 226.7, 0.75);

  // Readings and charges.
  // Readings and charges.
  const numberLeft = 263.7; // 313.7 -> 263.7
  const numberRight = 327.5; // 377.5 -> 327.5

  text(pen, "PRESENT READING-DATE", 36.0, ROW.present);
  text(pen, model.presentReading, 327.6, ROW.present, { align: "right" });
  text(pen, model.presentReadingDate, 333.7, ROW.present);

  text(pen, "PREVIOUS READING-DATE", 36.0, ROW.previous);
  text(pen, model.previousReading, 326.9, ROW.previous, { align: "right" });
  text(pen, model.previousReadingDate, 333.7, ROW.previous);

  text(pen, model.daysLabel, 399.3, ROW.days);

  line(pen, numberLeft, numberRight, 271.5, 0.7);

  text(pen, "CONSUMPTION :", 36.0, ROW.consumption);
  text(pen, model.consumption, 327.6, ROW.consumption, { align: "right" });

  line(pen, numberLeft, numberRight, 291.2, 0.7);

  text(pen, "AMOUNT", 36.0, ROW.amount);
  text(pen, model.amount, 329.4, ROW.amount, { align: "right" });

  text(pen, model.rateLabel, 341.7, ROW.rate);
  text(pen, model.vatLabel, 36.0, ROW.vat);
  text(pen, model.vatAmount, 329.4, ROW.vat, { align: "right" });

  line(pen, numberLeft, numberRight, 324.9, 0.7);

  text(pen, "NET PAYABLE", 36.0, ROW.net);
  text(pen, model.netPayable, 329.4, ROW.net, { align: "right" });

  line(pen, numberLeft, numberRight, 344.0, 0.7);

  text(pen, "SURCHARGE", 36.0, ROW.surchargeTitle);

  const surchargeAmountX = [171.3, 172.6, 172.6];
  const surchargeTotalRight = [319.4, 319.4, 319.4];
  model.surcharges.forEach((step, index) => {
    const top = ROW.surcharge[Math.min(index, ROW.surcharge.length - 1)];
    text(pen, step.label, 101.0, top);
    text(pen, step.amount, surchargeAmountX[Math.min(index, 2)], top);
    text(pen, step.date, 198.6, top);
    text(pen, step.total, surchargeTotalRight[Math.min(index, 2)], top, {
      align: "right",
    });
  });
  // "Payable in any bank" note, bottom right of every copy. The picture holds the whole box as the bank copy
  // is printed: the top and left lines, the English and Bangla note, and the Seal and Officer labels.
  const noteLeft = 346.0;
  const noteWidth = 163.8; // 0.95 of the picture's natural size, which puts Seal level with ARREAR TK.
  const noteHeight = (noteWidth * 282) / 566;
  pen.page.drawImage(images.note, {
    x: noteLeft,
    y: PAGE_HEIGHT - (NOTE_TOP + pen.dy + noteHeight),
    width: noteWidth,
    height: noteHeight,
  });

  // Footer.
  text(pen, "ARREAR TK.", 40.3, ROW.arrear, { bold: true });
  text(pen, model.arrear, 95.9, ROW.arrear);
  text(pen, "(Not Included)", 40.9, ROW.notIncluded, { size: 6.5 });
  text(
    pen,
    "NB:Automatic generated bill,does not require signature",
    167.9,
    ROW.arrear,
    { size: 6 },
  );
  // The source line is printed under the consumer copy only.
  if (model.copyLabel === "CONSUMER COPY") {
    text(pen, "Source: ICT Circle", 124.9, ROW.source, { size: 6.5 });
    text(pen, "Chief Revenue Officer Tel: 618347", 199.2, ROW.source, {
      size: 6.5,
    });
  }
}

async function loadBanglaBytes(
  source: BillPdfOptions["banglaFont"],
): Promise<Uint8Array | null> {
  if (!source) return null;
  try {
    return typeof source === "function" ? await source() : source;
  } catch {
    return null;
  }
}

// Builds the PDF and returns its bytes. The file name to save it under is billPdfFileName(bill).
export async function buildBillPdf(
  bill: BillDetail,
  options: BillPdfOptions = {},
): Promise<Uint8Array> {
  const copies =
    options.copies && options.copies.length > 0
      ? options.copies
      : (["CWASA COPY", "CONSUMER COPY"] as const);

  const pdf = await PDFDocument.create();
  pdf.setTitle(`Water bill ${bill.billNumber}`);
  pdf.setAuthor("Chattogram WASA");
  pdf.setSubject(`Water bill ${bill.billNumber}`);
  pdf.setCreator("CWASA Customer Platform");

  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const needsBangla = [
    bill.holderName,
    bill.address,
    bill.areaName,
    options.fallback?.customerName,
    options.fallback?.address,
  ].some((value) => typeof value === "string" && BANGLA.test(value));
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

  const frameTop = 102.0 + PAGE_TOP_SHIFT;
  const frameBottom = 439.6 + PAGE_TOP_SHIFT + (copies.length - 1) * COPY_STEP;
  page.drawRectangle({
    x: 19.5,
    y: PAGE_HEIGHT - frameBottom,
    width: 500.4,
    height: frameBottom - frameTop,
    borderColor: INK,
    borderWidth: 1,
  });

  copies.forEach((copy, index) => {
    const model = toBillPdfModel(bill, options.fallback, copy);
    drawCopy(
      { page, fonts, dy: PAGE_TOP_SHIFT + index * COPY_STEP },
      model,
      images,
    );
  });

  for (let index = 1; index < copies.length; index += 1) {
    // Two dotted lines between the CWASA copy and the consumer copy, as on the printed bill.
    for (const top of [424.9, 427.9]) {
      const y = PAGE_HEIGHT - (top + PAGE_TOP_SHIFT + (index - 1) * COPY_STEP);
      const sideGap = 15;
      page.drawLine({
        start: { x: 19.5 + sideGap, y },
        end: { x: FRAME_RIGHT - sideGap, y },
        thickness: 1,
        color: INK,
        dashArray: [0.75, 0.8],
      });
    }
  }

  return pdf.save();
}
