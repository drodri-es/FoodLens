import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';
import { BarcodeDetectedHandler, BarcodeScanner, ScannerUnavailableError } from './BarcodeScanner';

export class ZXingBarcodeScanner implements BarcodeScanner {
  readonly engine = 'zxing' as const;

  private readonly reader = new BrowserMultiFormatReader();
  private controls: IScannerControls | null = null;
  private stream: MediaStream | null = null;

  async start(video: HTMLVideoElement, onDetected: BarcodeDetectedHandler): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new ScannerUnavailableError('La cámara no está disponible en este navegador.');
    }

    this.stop();
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: { ideal: 'environment' } },
    });

    this.controls = await this.reader.decodeFromStream(
      this.stream,
      video,
      result => {
        const code = result?.getText();
        if (code) onDetected(code);
      },
    );
  }

  stop(): void {
    this.controls?.stop();
    this.controls = null;
    this.stream?.getTracks().forEach(track => track.stop());
    this.stream = null;
  }

  async setTorch(enabled: boolean): Promise<boolean> {
    const track = this.stream?.getVideoTracks()[0];
    if (!track) return false;

    const capabilities = track.getCapabilities() as MediaTrackCapabilities & { torch?: boolean };
    if (!capabilities.torch) return false;

    await track.applyConstraints({ advanced: [{ torch: enabled } as MediaTrackConstraintSet] });
    return true;
  }
}
