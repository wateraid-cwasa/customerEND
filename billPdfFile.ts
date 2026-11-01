// Saves or shares the bill PDF on the device the app runs on.
// Web: the browser downloads "<billNo>.pdf". Android and iOS: the file is saved as "<billNo>.pdf" and the share
// sheet opens, so the customer can save it to Files, open it, print it or send it.

import { Asset } from 'expo-asset';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import type { BillDetail } from './billLogic';
import { billPdfFileName, buildBillPdf, type BillPdfFallback } from './billPdf';

export type BillPdfResult = 'downloaded' | 'shared';

// The Bangla font is read only when a name or address needs it.
async function loadBanglaFont(): Promise<Uint8Array> {
  const asset = Asset.fromModule(require('./fonts/Shurjo-Regular.ttf'));
  await asset.downloadAsync();
  if (Platform.OS === 'web') {
    const response = await fetch(asset.uri);
    return new Uint8Array(await response.arrayBuffer());
  }
  if (!asset.localUri) throw new Error('The Bangla font file could not be loaded.');
  return new File(asset.localUri).bytes();
}

function downloadInBrowser(bytes: Uint8Array, fileName: string): void {
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
}

export async function downloadBillPdf(bill: BillDetail, fallback: BillPdfFallback = {}): Promise<BillPdfResult> {
  const fileName = billPdfFileName(bill);
  const bytes = await buildBillPdf(bill, { fallback, banglaFont: loadBanglaFont });

  if (Platform.OS === 'web') {
    downloadInBrowser(bytes, fileName);
    return 'downloaded';
  }

  const file = new File(Paths.cache, fileName);
  file.create({ overwrite: true });
  await file.write(bytes);
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('Sharing is not available on this device.');
  }
  await Sharing.shareAsync(file.uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle: fileName });
  return 'shared';
}
