import React, { useState, useRef, useEffect } from 'react';
import { useFoodLens } from '../../context/FoodLensContext';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import { BarcodeScanner, ScannerEngine } from '../../services/scanner/BarcodeScanner';
import { createBarcodeScanner } from '../../services/scanner/createBarcodeScanner';
import { DetectionStabilizer } from '../../services/scanner/DetectionStabilizer';
import { DataOriginBadge } from '../ui/DataOrigin';
import { 
  X, 
  Flashlight, 
  Image as ImageIcon, 
  Keyboard, 
  Camera, 
  Sparkles, 
  Check, 
  AlertCircle,
  QrCode,
  ArrowRight,
  UploadCloud,
  CheckCircle2
} from 'lucide-react';

export const ScannerView: React.FC = () => {
  const { isScannerOpen, closeScanner, scanBarcode, showToast } = useFoodLens();
  
  // Camera permission state
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannerEngine, setScannerEngine] = useState<ScannerEngine | null>(null);
  const [scannerError, setScannerError] = useState<string>('');
  const [lookupError, setLookupError] = useState<string>('');
  const [detectedCode, setDetectedCode] = useState<string>('');
  const [detectionHint, setDetectionHint] = useState<string>('');
  const [isStartingCamera, setIsStartingCamera] = useState<boolean>(false);
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [manualCodeModal, setManualCodeModal] = useState<boolean>(false);
  const [manualCodeInput, setManualCodeInput] = useState<string>('');
  
  // "Product not found" 4-step flow
  const [notFoundFlow, setNotFoundFlow] = useState<boolean>(false);
  const [missingBarcode, setMissingBarcode] = useState<string>('');
  const [contributeStep, setContributeStep] = useState<number>(1);
  const [contributeName, setContributeName] = useState<string>('');
  const [contributeBrand, setContributeBrand] = useState<string>('');
  const [contributePhotos, setContributePhotos] = useState<{ [key: number]: boolean }>({});

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerRef = useRef<BarcodeScanner | null>(null);
  const analyzingRef = useRef<boolean>(false);
  const detectedHandlerRef = useRef<(code: string) => void>(() => undefined);
  const cameraAuthorizedRef = useRef<boolean>(false);
  const startingCameraRef = useRef<boolean>(false);
  const stabilizerRef = useRef(new DetectionStabilizer());

  // Play gentle beep using Web Audio API
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  const triggerVibrate = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(50);
      } catch {
        // Safe fallback
      }
    }
  };

  const stopScanner = () => {
    scannerRef.current?.stop();
    scannerRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setTorchOn(false);
  };

  const handleCloseScanner = () => {
    stopScanner();
    closeScanner();
  };

  useEffect(() => () => stopScanner(), []);

  // Start the native detector when possible and ZXing everywhere else.
  const requestCamera = async () => {
    if (startingCameraRef.current || scannerRef.current) return;
    startingCameraRef.current = true;
    setScannerError('');
    setLookupError('');
    setDetectionHint('');
    setIsStartingCamera(true);
    setHasPermission(true);

    try {
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
      if (!videoRef.current) throw new Error('No se pudo preparar la vista de cámara.');

      const scanner = await createBarcodeScanner();
      scannerRef.current = scanner;
      await scanner.start(videoRef.current, code => detectedHandlerRef.current(code));
      cameraAuthorizedRef.current = true;
      setScannerEngine(scanner.engine);
    } catch (error) {
      stopScanner();
      setHasPermission(false);
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        cameraAuthorizedRef.current = false;
      }
      setScannerError(
        error instanceof DOMException && error.name === 'NotAllowedError'
          ? 'No se ha concedido permiso para usar la cámara.'
          : 'No hemos podido iniciar la cámara en este dispositivo.',
      );
    } finally {
      startingCameraRef.current = false;
      setIsStartingCamera(false);
    }
  };

  useEffect(() => {
    if (!isScannerOpen) {
      stopScanner();
      setLookupError('');
      setDetectedCode('');
      setDetectionHint('');
      stabilizerRef.current.reset();
      if (!cameraAuthorizedRef.current) {
        setHasPermission(null);
        setScannerEngine(null);
      }
      return;
    }

    if (cameraAuthorizedRef.current && hasPermission !== false) {
      void requestCamera();
    }
  }, [isScannerOpen]);

  // Process barcode scan
  const lookupBarcode = async (code: string) => {
    analyzingRef.current = true;
    setLookupError('');
    setDetectedCode(code);
    setAnalyzing(true);

    const res = await scanBarcode(code);
    analyzingRef.current = false;
    setAnalyzing(false);

    if (!res.found) {
      if (res.reason === 'unavailable') {
        setLookupError('No se pudo consultar Open Food Facts. La cámara está bien; comprueba la conexión y reintenta la consulta.');
        return;
      }
      setMissingBarcode(code);
      setNotFoundFlow(true);
    }
  };

  const handleBarcodeDetected = (code: string) => {
    if (analyzingRef.current) return;
    analyzingRef.current = true;
    stopScanner();
    playBeep();
    triggerVibrate();
    void lookupBarcode(code);
  };

  detectedHandlerRef.current = rawCode => {
    if (analyzingRef.current) return;
    const stableCode = stabilizerRef.current.push(rawCode);
    if (!stableCode) {
      setDetectionHint('Código detectado · mantén el envase quieto');
      return;
    }
    setDetectionHint('');
    handleBarcodeDetected(stableCode);
  };

  const toggleTorch = async () => {
    const nextValue = !torchOn;
    try {
      const supported = await scannerRef.current?.setTorch(nextValue);
      if (!supported) {
        showToast('La linterna no está disponible en este dispositivo', 'warning');
        return;
      }
      setTorchOn(nextValue);
      showToast(nextValue ? 'Linterna encendida' : 'Linterna apagada');
    } catch {
      showToast('No se pudo cambiar el estado de la linterna', 'warning');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCodeInput.trim()) return;
    setManualCodeModal(false);
    stabilizerRef.current.reset();
    handleBarcodeDetected(manualCodeInput.trim());
    setManualCodeInput('');
  };

  const handleSimulateGalleryUpload = () => {
    showToast('La lectura desde galería estará disponible próximamente', 'info');
  };

  const completeContribution = () => {
    showToast('Demostración completada: no se ha enviado información', 'info');
    setNotFoundFlow(false);
    setContributeStep(1);
    setContributePhotos({});
    handleCloseScanner();
  };

  if (!isScannerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col text-white animate-in fade-in duration-200">
      {/* 1. Camera Permission Request Screen */}
      {hasPermission === null && !notFoundFlow && (
        <div className="flex-1 flex flex-col justify-between p-6 max-w-md mx-auto w-full">
          <div className="flex justify-end pt-2">
            <button
              onClick={handleCloseScanner}
              className="w-10 h-10 rounded-full bg-stone-800 text-stone-300 flex items-center justify-center hover:bg-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col items-center text-center my-auto">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-6">
              <Camera className="w-10 h-10" />
            </div>

            <h2 className="text-xl font-bold text-white mb-2">
              Permiso de cámara
            </h2>
            <p className="text-stone-400 text-sm leading-relaxed max-w-xs mb-8">
              Necesitamos la cámara para leer códigos de barras. No almacenamos imágenes ni vídeos sin tu permiso.
            </p>

            <button
              onClick={requestCamera}
              className="w-full h-12 rounded-2xl bg-emerald-500 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg shadow-emerald-500/20 mb-3"
            >
              Permitir cámara
            </button>

            <button
              onClick={() => {
                setManualCodeModal(true);
              }}
              className="w-full h-12 rounded-2xl bg-stone-900 border border-stone-800 text-stone-300 font-semibold text-sm hover:bg-stone-800 transition-colors"
            >
              Introducir código manualmente
            </button>
          </div>

          <div className="text-center text-xs text-stone-500 pb-4">
            Total privacidad · Escaneo local de códigos
          </div>
        </div>
      )}

      {/* Camera unavailable / permission denied */}
      {hasPermission === false && !notFoundFlow && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto w-full">
          <AlertCircle className="w-12 h-12 text-amber-400 mb-4" />
          <h2 className="text-lg font-bold text-white mb-2">Cámara no disponible</h2>
          <p className="text-sm text-stone-400 mb-6">{scannerError}</p>
          <button
            onClick={() => {
              setHasPermission(null);
              setScannerError('');
            }}
            className="w-full h-12 rounded-2xl bg-stone-800 text-white font-semibold text-sm mb-3"
          >
            Volver a intentar
          </button>
          <button
            onClick={() => setManualCodeModal(true)}
            className="w-full h-12 rounded-2xl bg-emerald-500 text-stone-950 font-bold text-sm"
          >
            Introducir código manualmente
          </button>
        </div>
      )}

      {/* 2. Active Scanner Viewfinder */}
      {hasPermission === true && !notFoundFlow && (
        <div className="relative flex-1 flex flex-col justify-between overflow-hidden">
          {/* Real video stream background or simulated supermarket backdrop */}
          <div className="absolute inset-0 z-0 bg-stone-950 flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover opacity-70"
            />
            {/* Fallback ambient animation for iframe environments where camera is blocked */}
            <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-950/20 to-stone-950/80 pointer-events-none" />
          </div>

          {lookupError && (
            <div className="absolute inset-0 z-40 bg-stone-950/95 flex items-center justify-center p-6">
              <div className="w-full max-w-sm text-center">
                <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                <h2 className="text-lg font-bold text-white mb-2">No pudimos consultar el producto</h2>
                <p className="text-sm text-stone-400 leading-relaxed mb-2">{lookupError}</p>
                <p className="text-xs text-stone-500 font-mono mb-6">Código: {detectedCode}</p>
                <button
                  onClick={() => void lookupBarcode(detectedCode)}
                  className="w-full h-12 rounded-2xl bg-emerald-500 text-stone-950 font-bold text-sm mb-3"
                >
                  Reintentar consulta
                </button>
                <button
                  onClick={() => {
                    setLookupError('');
                    setDetectedCode('');
                    void requestCamera();
                  }}
                  className="w-full h-12 rounded-2xl bg-stone-800 text-white font-semibold text-sm mb-3"
                >
                  Volver a escanear
                </button>
                <button
                  onClick={handleCloseScanner}
                  className="text-xs text-stone-400 py-2"
                >
                  Cerrar escáner
                </button>
              </div>
            </div>
          )}

          {/* Top Bar Controls */}
          <div className="relative z-20 flex items-center justify-between px-5 pt-8 pb-4">
            <button
              onClick={handleCloseScanner}
              className="w-11 h-11 rounded-full bg-stone-900/80 backdrop-blur-md text-white flex items-center justify-center hover:bg-stone-800 border border-white/10"
              aria-label="Cerrar escáner"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="px-3.5 py-1.5 rounded-full bg-stone-900/80 backdrop-blur-md border border-white/10 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isStartingCamera ? 'bg-amber-400' : 'bg-emerald-400 animate-ping'}`} />
              <span className="text-xs font-semibold text-stone-200">
                {isStartingCamera
                  ? 'Iniciando cámara…'
                  : `Escáner listo · ${scannerEngine === 'native' ? 'Nativo' : 'ZXing'}`}
              </span>
            </div>

            <button
              onClick={toggleTorch}
              disabled={isStartingCamera}
              className={`w-11 h-11 rounded-full flex items-center justify-center border transition-colors ${
                torchOn
                  ? 'bg-amber-400 text-stone-950 border-amber-300'
                  : 'bg-stone-900/80 backdrop-blur-md text-white border-white/10 hover:bg-stone-800'
              }`}
              aria-label={torchOn ? 'Apagar linterna' : 'Encender linterna'}
            >
              <Flashlight className="w-5 h-5" />
            </button>
          </div>

          {/* Center Viewfinder Box */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
            <div className="relative w-full max-w-[280px] h-[200px] rounded-2xl overflow-hidden">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl z-20" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl z-20" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl z-20" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-xl z-20" />

              {/* Animated laser scan line */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] animate-scan-laser z-10" />

              {/* Viewfinder inner darkening scrim */}
              <div className="absolute inset-0 border-2 border-white/20 rounded-2xl pointer-events-none" />

              {/* Analyzing loader indicator */}
              {analyzing && (
                <div className="absolute inset-0 bg-stone-900/90 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-4">
                  <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mb-2" />
                  <span className="text-xs font-bold text-white">Analizando producto...</span>
                  <span className="text-[11px] text-stone-400 mt-1">Consultando Open Food Facts</span>
                </div>
              )}
            </div>

            <p className="text-xs font-medium text-stone-300 mt-4 tracking-wide text-center bg-stone-900/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              Centra el código de barras dentro del recuadro
            </p>
            <span className="text-[11px] text-stone-400 mt-2 text-center">
              {detectionHint || 'Compatible con EAN, UPC, QR y GS1 Digital Link'}
            </span>

            {/* Test controls are never included in production builds. */}
            {import.meta.env.DEV && <div className="w-full max-w-sm mt-6 bg-stone-900/75 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block mb-2 text-center">
                Probar escaneo inmediato (Simulador)
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => handleBarcodeDetected(MOCK_PRODUCTS[0].barcode)}
                  className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-left text-xs text-stone-200 transition-colors truncate"
                >
                  🥣 Cereales Choco Crunch
                </button>
                <button
                  onClick={() => handleBarcodeDetected(MOCK_PRODUCTS[3].barcode)}
                  className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-left text-xs text-stone-200 transition-colors truncate"
                >
                  🥛 Yogur Griego Natural
                </button>
                <button
                  onClick={() => handleBarcodeDetected(MOCK_PRODUCTS[5].barcode)}
                  className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-left text-xs text-stone-200 transition-colors truncate"
                >
                  🥤 Refresco Cola Spark
                </button>
                <button
                  onClick={() => handleBarcodeDetected('0000000000000')}
                  className="px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-left text-xs text-rose-300 transition-colors truncate"
                >
                  ❓ Producto no existente
                </button>
              </div>
            </div>}
          </div>

          {/* Bottom Bar Options */}
          <div className="relative z-20 pb-8 pt-4 px-6 bg-gradient-to-t from-black via-black/80 to-transparent">
            <div className="flex items-center justify-around max-w-sm mx-auto">
              <button
                onClick={handleSimulateGalleryUpload}
                className="flex flex-col items-center gap-1.5 text-stone-300 hover:text-white"
              >
                <div className="w-12 h-12 rounded-2xl bg-stone-900/90 border border-white/10 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-stone-300" />
                </div>
                <span className="text-[11px] font-medium">Galería</span>
              </button>

              <button
                onClick={() => setManualCodeModal(true)}
                className="flex flex-col items-center gap-1.5 text-stone-300 hover:text-white"
              >
                <div className="w-12 h-12 rounded-2xl bg-stone-900/90 border border-white/10 flex items-center justify-center">
                  <Keyboard className="w-5 h-5 text-stone-300" />
                </div>
                <span className="text-[11px] font-medium">Manual</span>
              </button>

              <button
                onClick={() => showToast('El lector detecta códigos QR automáticamente')}
                className="flex flex-col items-center gap-1.5 text-stone-300 hover:text-white"
              >
                <div className="w-12 h-12 rounded-2xl bg-stone-900/90 border border-white/10 flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-stone-300" />
                </div>
                <span className="text-[11px] font-medium">Código QR</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. "Product Not Found" - 4-Step Contribution Flow */}
      {notFoundFlow && (
        <div className="flex-1 bg-stone-950 flex flex-col justify-between p-6 max-w-md mx-auto w-full overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pt-2 mb-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-amber-400" />
                <h3 className="text-lg font-bold text-white">No encontramos este producto</h3>
              </div>
              <button
                onClick={() => setNotFoundFlow(false)}
                className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-400 mb-6">
              Código <span className="font-mono text-stone-200">{missingBarcode}</span> no registrado aún. Puedes ayudarnos a identificarlo en menos de un minuto.
            </p>
            <DataOriginBadge kind="demo" label="Aportación simulada · no se enviarán datos" className="mb-6" />

            {/* Step progress pills */}
            <div className="flex items-center gap-1.5 mb-6">
              {[1, 2, 3, 4].map(s => (
                <div
                  key={s}
                  className={`flex-1 h-1.5 rounded-full transition-colors ${
                    s < contributeStep
                      ? 'bg-emerald-500'
                      : s === contributeStep
                      ? 'bg-emerald-400'
                      : 'bg-stone-800'
                  }`}
                />
              ))}
            </div>

            {/* Step card */}
            <div className="bg-stone-900 rounded-3xl p-5 border border-stone-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Paso {contributeStep} de 4
                </span>
                {contributePhotos[contributeStep] && (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Foto lista
                  </span>
                )}
              </div>

              {contributeStep === 1 && (
                <div>
                  <h4 className="font-bold text-base text-white mb-1">Fotografía frontal del producto</h4>
                  <p className="text-xs text-stone-400 mb-4">
                    Captura el envase completo donde se lea claramente el nombre y la marca.
                  </p>
                  <button
                    onClick={() => {
                      setContributePhotos(prev => ({ ...prev, 1: true }));
                      showToast('Foto frontal guardada', 'success');
                    }}
                    className="w-full h-32 rounded-2xl border-2 border-dashed border-stone-700 bg-stone-950 flex flex-col items-center justify-center gap-2 hover:border-emerald-500 transition-colors"
                  >
                    <Camera className="w-6 h-6 text-stone-400" />
                    <span className="text-xs text-stone-300 font-medium">
                      {contributePhotos[1] ? '✓ Foto capturada (Toca para repetir)' : 'Toca para fotografiar frontal'}
                    </span>
                  </button>
                </div>
              )}

              {contributeStep === 2 && (
                <div>
                  <h4 className="font-bold text-base text-white mb-1">Fotografía de ingredientes</h4>
                  <p className="text-xs text-stone-400 mb-4">
                    Enfoca el listado de ingredientes y alérgenos con buena iluminación.
                  </p>
                  <button
                    onClick={() => {
                      setContributePhotos(prev => ({ ...prev, 2: true }));
                      showToast('Foto de ingredientes guardada', 'success');
                    }}
                    className="w-full h-32 rounded-2xl border-2 border-dashed border-stone-700 bg-stone-950 flex flex-col items-center justify-center gap-2 hover:border-emerald-500 transition-colors"
                  >
                    <Camera className="w-6 h-6 text-stone-400" />
                    <span className="text-xs text-stone-300 font-medium">
                      {contributePhotos[2] ? '✓ Foto capturada (Toca para repetir)' : 'Toca para fotografiar ingredientes'}
                    </span>
                  </button>
                </div>
              )}

              {contributeStep === 3 && (
                <div>
                  <h4 className="font-bold text-base text-white mb-1">Fotografía tabla nutricional</h4>
                  <p className="text-xs text-stone-400 mb-4">
                    Asegura que se lean los valores por 100 g (calorías, azúcares, grasas, fibra, sal).
                  </p>
                  <button
                    onClick={() => {
                      setContributePhotos(prev => ({ ...prev, 3: true }));
                      showToast('Tabla nutricional guardada', 'success');
                    }}
                    className="w-full h-32 rounded-2xl border-2 border-dashed border-stone-700 bg-stone-950 flex flex-col items-center justify-center gap-2 hover:border-emerald-500 transition-colors"
                  >
                    <Camera className="w-6 h-6 text-stone-400" />
                    <span className="text-xs text-stone-300 font-medium">
                      {contributePhotos[3] ? '✓ Foto capturada (Toca para repetir)' : 'Toca para fotografiar tabla'}
                    </span>
                  </button>
                </div>
              )}

              {contributeStep === 4 && (
                <div>
                  <h4 className="font-bold text-base text-white mb-1">Confirmar datos del producto</h4>
                  <p className="text-xs text-stone-400 mb-4">
                    Escribe el nombre comercial y la marca para agilizar la validación.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold text-stone-400 block mb-1">Nombre del producto</label>
                      <input
                        type="text"
                        value={contributeName}
                        onChange={e => setContributeName(e.target.value)}
                        placeholder="Ej: Galletas de avena y canela"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-stone-400 block mb-1">Marca</label>
                      <input
                        type="text"
                        value={contributeBrand}
                        onChange={e => setContributeBrand(e.target.value)}
                        placeholder="Ej: BioOrganic"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 space-y-2">
            {contributeStep < 4 ? (
              <button
                onClick={() => setContributeStep(prev => prev + 1)}
                className="w-full h-12 rounded-2xl bg-emerald-500 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-400 transition-colors"
              >
                Continuar
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={completeContribution}
                className="w-full h-12 rounded-2xl bg-emerald-500 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-400 transition-colors"
              >
                Simular envío
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => {
                setNotFoundFlow(false);
                handleCloseScanner();
              }}
              className="w-full py-2.5 text-xs text-stone-400 hover:text-stone-200"
            >
              Cancelar y volver
            </button>
          </div>
        </div>
      )}

      {/* 4. Manual Barcode Entry Modal */}
      {manualCodeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-base">Introducir código</h3>
              <button
                onClick={() => setManualCodeModal(false)}
                className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-stone-400 block mb-1.5">
                  Número de código de barras (EAN-13 o UPC)
                </label>
                <input
                  type="text"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  value={manualCodeInput}
                  onChange={e => setManualCodeInput(e.target.value)}
                  placeholder="8410123456789"
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-700 text-white font-mono text-sm tracking-wider focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setManualCodeModal(false)}
                  className="flex-1 h-11 rounded-xl bg-stone-800 text-stone-300 font-semibold text-xs hover:bg-stone-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!manualCodeInput.trim()}
                  className="flex-1 h-11 rounded-xl bg-emerald-500 disabled:opacity-40 text-stone-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
                >
                  Buscar producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
