import { BarcodeScanner } from './BarcodeScanner';
import { NativeBarcodeDetectorScanner } from './NativeBarcodeDetectorScanner';

export async function createBarcodeScanner(): Promise<BarcodeScanner> {
  if (NativeBarcodeDetectorScanner.isSupported()) {
    return new NativeBarcodeDetectorScanner();
  }

  const { ZXingBarcodeScanner } = await import('./ZXingBarcodeScanner');
  return new ZXingBarcodeScanner();
}
