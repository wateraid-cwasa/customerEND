import { readFileSync } from 'node:fs';
import { PDFDocument } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import { normaliseBill, type BillDetail } from '../../billLogic';
import {
  billPdfFileName,
  buildBillPdf,
  categoryLabel,
  formatConnectionSize,
  formatMoney,
  formatShortDate,
  toBillPdfModel,
} from '../../billPdf';

// Same bill as the CWASA template example (BILL_DOCX_FINAL.docx), in the shape the API sends it.
const templateBill = {
  id: 'cmv1',
  billNo: 'A05260901287',
  accountNo: '050858SD',
  accountHolderName: 'BPCL FOR M.D. KHADEM MAHMUD YUSUF',
  accountAddressLine1: 'F/N:AMINUR RAHMAN YUSUF TEA BOARD',
  accountAddressLine2: 'TEA BOARD RD. BAYAZID BOSTAMI',
  accountWardNo: '02',
  accountContactNo: '01705597937',
  meterNo: '141289086',
  meterReaderCode: 'M113',
  previousMeterReadingValue: '296',
  previousMeterReadingDate: '2026-07-31T00:00:00.000Z',
  currentMeterReadingValue: '327',
  currentMeterReadingDate: '2026-08-31T00:00:00.000Z',
  consumptionM3: '31',
  billableConsumptionM3: '31',
  tariffRatePerM3: '37',
  vatRatePercentage: '15',
  baseWaterCharge: '1147',
  additionalWaterCharge: '0',
  vatAmount: '172',
  totalAmountDue: '1319',
  billStatus: 'APPROVED',
  paymentStatus: 'PENDING',
  issueDate: '2026-09-29T00:00:00.000Z',
  dueDate: '2026-10-29T00:00:00.000Z',
  billingMonth: 9,
  billingYear: 2026,
  consumptionDays: 31,
  category: 'NON_DOMESTIC',
  areaName: 'BaizedBostami',
  connectionSize: '1 INCH',
  surcharges: [
    { daysAfterDue: 30, surchargePercentage: '5', surchargeAmount: '57', totalPayable: '1376' },
    { daysAfterDue: 60, surchargePercentage: '10', surchargeAmount: '115', totalPayable: '1434' },
    { daysAfterDue: 90, surchargePercentage: '15', surchargeAmount: '172', totalPayable: '1491' },
  ],
};

function bill(overrides: Record<string, unknown> = {}): BillDetail {
  const parsed = normaliseBill({ ...templateBill, ...overrides });
  if (!parsed) throw new Error('fixture bill did not parse');
  return parsed;
}

describe('billPdfFileName', () => {
  it('uses the bill number', () => {
    expect(billPdfFileName(bill())).toBe('A05260901287.pdf');
  });

  it('removes characters that are not safe in a file name', () => {
    expect(billPdfFileName({ billNumber: 'AA/26 261:05*1554', id: 'x' })).toBe('AA_26_261_05_1554.pdf');
    expect(billPdfFileName({ billNumber: '../../etc/passwd', id: 'x' })).toBe('etc_passwd.pdf');
  });

  it('falls back to the id, then to "bill"', () => {
    expect(billPdfFileName({ billNumber: '', id: 'cmv123' })).toBe('cmv123.pdf');
    expect(billPdfFileName({ billNumber: '', id: '' })).toBe('bill.pdf');
    expect(billPdfFileName({ billNumber: '***', id: '' })).toBe('bill.pdf');
  });
});

describe('formatting', () => {
  it('formats money with 2 decimals and thousands separators', () => {
    expect(formatMoney(1147)).toBe('1,147.00');
    expect(formatMoney(0)).toBe('0.00');
    expect(formatMoney(null)).toBe('0.00');
  });

  it('formats dates as dd/mm/yy using the date the server sent', () => {
    expect(formatShortDate('2026-10-29T00:00:00.000Z')).toBe('29/10/26');
    expect(formatShortDate('2027-01-27T00:00:00.000Z')).toBe('27/01/27');
    expect(formatShortDate(null)).toBe('');
    expect(formatShortDate('nonsense')).toBe('');
  });

  it('maps the bill category to the template wording', () => {
    expect(categoryLabel('NON_DOMESTIC')).toBe('Non-Domestic');
    expect(categoryLabel('RESIDENTIAL')).toBe('Domestic');
    expect(categoryLabel('COMMERCIAL')).toBe('Commercial');
    expect(categoryLabel(null)).toBe('-');
  });
});

describe('toBillPdfModel', () => {
  it('matches every printed value on the CWASA template example', () => {
    const model = toBillPdfModel(bill());
    expect(model).toMatchObject({
      readerCode: 'M113',
      monthLabel: 'September 2026',
      copyLabel: 'CONSUMER COPY',
      name: 'BPCL FOR M.D. KHADEM MAHMUD YUSUF',
      addressLines: ['F/N:AMINUR RAHMAN YUSUF TEA BOARD', 'TEA BOARD RD. BAYAZID BOSTAMI'],
      contact: '01705597937',
      accountNo: '050858SD',
      wardNo: '02',
      meterNo: '141289086',
      size: '1 INCH',
      area: 'BaizedBostami',
      category: 'Non-Domestic',
      billNo: 'A05260901287',
      issueDate: '29/09/26',
      dueDate: '29/10/26',
      presentReading: '327.00',
      presentReadingDate: '31/08/26',
      previousReading: '296.00',
      previousReadingDate: '31/07/26',
      daysLabel: '31 Days',
      consumption: '31.00',
      amount: '1,147.00',
      rateLabel: '@TK.37.00/CM',
      vatLabel: 'VAT @15% Rgd. No. 000494029',
      vatAmount: '172.00',
      netPayable: '1,319.00',
      arrear: '0.00',
    });
  });

  it('prints the surcharge steps with the template dates (due date plus 30, 60, 90 days)', () => {
    expect(toBillPdfModel(bill()).surcharges).toEqual([
      { label: '@05% TK.', amount: '57.00', date: '28/11/26', total: '1,376.00' },
      { label: '@10% TK.', amount: '115.00', date: '28/12/26', total: '1,434.00' },
      { label: '@15% TK.', amount: '172.00', date: '27/01/27', total: '1,491.00' },
    ]);
  });

  it('uses fallback details for anything the bill does not carry', () => {
    const sparse = bill({ areaName: undefined, connectionSize: undefined, accountNo: undefined, accountContactNo: undefined });
    const model = toBillPdfModel(sparse, { accountNo: 'FALL1', mobileNo: '01800000000', areaName: 'Agrabad', connectionSize: '0.5 inch' });
    expect(model.accountNo).toBe('FALL1');
    expect(model.contact).toBe('01800000000');
    expect(model.area).toBe('Agrabad');
    expect(model.size).toBe('0.5 INCH');
  });

  it('shows a dash when area and size are unknown, and no surcharge rows when there are none', () => {
    const model = toBillPdfModel(bill({ areaName: undefined, connectionSize: undefined, surcharges: [] }));
    expect(model.area).toBe('-');
    expect(model.size).toBe('-');
    expect(model.surcharges).toEqual([]);
  });

  it('adds an additional water charge to the printed amount so the lines add up', () => {
    const model = toBillPdfModel(bill({ baseWaterCharge: '1000', additionalWaterCharge: '147' }));
    expect(model.amount).toBe('1,147.00');
  });

  it('counts the days between readings when the server sends no day count', () => {
    expect(toBillPdfModel(bill({ consumptionDays: undefined })).daysLabel).toBe('31 Days');
  });
});

describe('formatConnectionSize', () => {
  it('adds INCH to the number held in the database column', () => {
    expect(formatConnectionSize('1')).toBe('1 INCH');
    expect(formatConnectionSize(' 2 ')).toBe('2 INCH');
    expect(formatConnectionSize('0.5')).toBe('0.5 INCH');
  });

  it('keeps text that already has a unit and shows a dash when empty', () => {
    expect(formatConnectionSize('1 inch')).toBe('1 INCH');
    expect(formatConnectionSize(null)).toBe('-');
    expect(formatConnectionSize('')).toBe('-');
  });

  it('is used on the bill model, also for a bill that sends WCONSIZE', () => {
    expect(toBillPdfModel(bill({ connectionSize: '2' })).size).toBe('2 INCH');
    expect(toBillPdfModel(bill({ connectionSize: undefined, wconsize: 1 })).size).toBe('1 INCH');
    // The server sends the size as a number in connectionSizeCode, or null when it is not set.
    expect(toBillPdfModel(bill({ connectionSize: undefined, connectionSizeCode: 1 })).size).toBe('1 INCH');
    expect(toBillPdfModel(bill({ connectionSize: undefined, connectionSizeCode: 2 })).size).toBe('2 INCH');
    expect(toBillPdfModel(bill({ connectionSize: undefined, connectionSizeCode: null })).size).toBe('-');
  });
});

describe('buildBillPdf', () => {
  async function load(bytes: Uint8Array) {
    expect(String.fromCharCode(...Array.from(bytes.slice(0, 5)))).toBe('%PDF-');
    return PDFDocument.load(bytes);
  }

  it('builds a one page PDF titled with the bill number', async () => {
    const pdf = await load(await buildBillPdf(bill()));
    expect(pdf.getPageCount()).toBe(1);
    expect(pdf.getTitle()).toBe('Water bill A05260901287');
    const page = pdf.getPage(0);
    expect(Math.round(page.getWidth())).toBe(595);
    expect(Math.round(page.getHeight())).toBe(842);
  });

  it('prints the CWASA copy and the consumer copy together on one page by default', async () => {
    const both = await buildBillPdf(bill());
    const explicit = await buildBillPdf(bill(), { copies: ['CWASA COPY', 'CONSUMER COPY'] });
    expect((await load(both)).getPageCount()).toBe(1);
    expect((await load(explicit)).getPageCount()).toBe(1);
    // Same drawing instructions, so the default really is both copies.
    expect(Math.abs(both.length - explicit.length)).toBeLessThan(200);
  });

  it('can print only the consumer copy when asked', async () => {
    const both = await buildBillPdf(bill());
    const single = await buildBillPdf(bill(), { copies: ['CONSUMER COPY'] });
    expect((await load(single)).getPageCount()).toBe(1);
    expect(single.length).toBeLessThan(both.length);
  });

  it('handles a bill with missing details and no surcharges', async () => {
    const sparse = bill({ accountHolderName: undefined, accountAddressLine1: undefined, accountAddressLine2: undefined, surcharges: [], meterReaderCode: undefined });
    await load(await buildBillPdf(sparse));
  });

  it('shortens very long names and addresses instead of overflowing', async () => {
    const long = bill({ accountHolderName: 'A'.repeat(300), accountAddressLine1: 'ROAD '.repeat(80), accountAddressLine2: 'WARD '.repeat(80) });
    await load(await buildBillPdf(long));
  });

  it('does not fail on characters the standard font cannot print', async () => {
    await load(await buildBillPdf(bill({ accountHolderName: 'Name with symbols ₹ ★ é' })));
  });

  it('does not fail on Bangla text when no Bangla font is given (letters become "?")', async () => {
    await load(await buildBillPdf(bill({ accountHolderName: 'মোঃ কামাল' })));
  });

  it('prints Bangla names and addresses when the Bangla font is given', async () => {
    const font = new Uint8Array(readFileSync('fonts/Shurjo-Regular.ttf'));
    const bangla = bill({
      accountHolderName: 'মোঃ কামাল হোসেন',
      accountAddressLine1: 'বাড়ি ৪২, রোড ২২',
      accountAddressLine2: 'আগ্রাবাদ, চট্টগ্রাম',
    });
    const withFont = await buildBillPdf(bangla, { banglaFont: font });
    const withoutFont = await buildBillPdf(bangla);
    await load(withFont);
    expect(withFont.length).toBeGreaterThan(withoutFont.length); // the font is embedded
  });

  it('accepts a function that loads the font, and survives a load failure', async () => {
    const bangla = bill({ accountHolderName: 'কামাল' });
    await load(await buildBillPdf(bangla, { banglaFont: async () => new Uint8Array(readFileSync('fonts/Shurjo-Regular.ttf')) }));
    await load(await buildBillPdf(bangla, { banglaFont: async () => { throw new Error('no font'); } }));
  });
});
