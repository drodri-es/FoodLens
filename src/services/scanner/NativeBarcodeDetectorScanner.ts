import {
  BarcodeDetectedHandler,
  BarcodeScanner,
  ScannerUnavailableError,
} from './BarcodeScanner';

interface DetectedBarcode {
  rawValue: string;
}

interface BarcodeDetectorInstance {
  detect(source: ImageBitmapSource): Promise<DetectedBarcode[]>;
}

interface BarcodeDetectorConstructor {
  new (options?: { formats?: string[] }): BarcodeDetectorInstance;
  getSupportedFormats?(): Promise<string[]>;
}

declare global {
  interface Window {
    BarcodeDetector?: BarcodeDetectorConstructor;
  }
}

const PREFERRED_FORMATS = [
  'ean_13',
  'ean_8',
  'upc_a',
  'upc_e',
  'qr_code',
  'data_matrix',
];

export class NativeBarcodeDetectorScanner implements BarcodeScanner {
  readonly engine = 'native' as const;

  private detector: BarcodeDetectorInstance | null = null;
  private stream: MediaStream | null = null;
  private animationFrame: number | null = null;
  private detecting = false;
  private active = false;

  static isSupported(): boolean {
    return typeof window !== 'undefined' && typeof window.BarcodeDetector === 'function';
  }

  async start(video: HTMLVideoElement, onDetected: BarcodeDetectedHandler): Promise<void> {
    const Detector = window.BarcodeDetector;
    if (!Detector || !navigator.mediaDevices?.getUserMedia) {
      throw new ScannerUnavailableError('El detector nativo o la cámara no están disponibles.');
    }

    this.stop();

    const supportedFormats = Detector.getSupportedFormats
      ? await Detector.getSupportedFormats()
      : PREFERRED_FORMATS;
    const formats = PREFERRED_FORMATS.filter(format => supportedFormats.includes(format));

    this.detector = new Detector(formats.length > 0 ? { formats } : undefined);
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: { ideal: 'environment' } },
    });

    video.srcObject = this.stream;
    await video.play();
    this.active = true;

    const scanFrame = async () => {
      if (!this.active || !this.detector) return;

      if (!this.detecting && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        this.detecting = true;
        try {
          const [result] = await this.detector.detect(video);
          if (result?.rawValue) onDetected(result.rawValue);
        } catch {
          // Individual frames can fail while the camera is focusing.
        } finally {
          this.detecting = false;
        }
      }

      if (this.active) this.animationFrame = requestAnimationFrame(scanFrame);
    };

    this.animationFrame = requestAnimationFrame(scanFrame);
  }

  stop(): void {
    this.active = false;
    if (this.animationFrame !== null) cancelAnimationFrame(this.animationFrame);
    this.animationFrame = null;
    this.stream?.getTracks().forEach(track => track.stop());
    this.stream = null;
    this.detector = null;
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
