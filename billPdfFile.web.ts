// Web version: the browser downloads "<billNo>.pdf". It does not use expo-file-system or expo-sharing,
// which are only needed on Android and iOS (see billPdfFile.ts). Metro picks this file on web.

import { Asset } from 'expo-asset';
import type { BillDetail } from './billLogic';
import { billPdfFileName, buildBillPdf, type BillPdfFallback } from './billPdf';

export type BillPdfResult = 'downloaded' | 'shared';

// The Bangla font is read only when a name or address needs it.
async function loadBanglaFont(): Promise<Uint8Array> {
  const asset = Asset.fromModule(require('./fonts/Shurjo-Regular.ttf'));
  const response = await fetch(asset.uri);
  if (!response.ok) throw new Error(`The Bangla font could not be loaded (${response.status}).`);
  return new Uint8Array(await response.arrayBuffer());
}

export async function downloadBillPdf(bill: BillDetail, fallback: BillPdfFallback = {}): Promise<BillPdfResult> {
  const fileName = billPdfFileName(bill);
  const bytes = await buildBillPdf(bill, { fallback, banglaFont: loadBanglaFont });

  const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  // Give the browser a moment to start the download before the link is released.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
  return 'downloaded';
}
