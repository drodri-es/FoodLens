export type ScannerEngine = 'native' | 'zxing';

export type BarcodeDetectedHandler = (code: string) => void;

export interface BarcodeScanner {
  readonly engine: ScannerEngine;
  start(video: HTMLVideoElement, onDetected: BarcodeDetectedHandler): Promise<void>;
  stop(): void;
  setTorch(enabled: boolean): Promise<boolean>;
}

export class ScannerUnavailableError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'ScannerUnavailableError';
  }
}
