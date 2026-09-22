import React, { useState } from 'react';
import { useFoodLens } from '../../context/FoodLensContext';
import { 
  Scan, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  Activity, 
  Apple, 
  Flame, 
  ShieldAlert,
  SlidersHorizontal
} from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { onboardingCompleted, completeOnboarding, openScanner, loginSimulated } = useFoodLens();
  const [step, setStep] = useState<number>(0); // 0 = welcome splash, 1 = scan, 2 = 4 dimensions, 3 = alternatives

  if (onboardingCompleted) return null;

  const handleFinish = () => {
    completeOnboarding();
    openScanner();
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-base shadow-sm shadow-emerald-600/30">
              FL
            </div>
            <span className="font-bold text-lg tracking-tight text-stone-900">FoodLens</span>
          </div>
          {step > 0 && (
            <button
              onClick={handleSkip}
              className="text-xs font-semibold text-stone-400 hover:text-stone-700 transition-colors px-2 py-1"
            >
              Saltar
            </button>
          )}
        </div>

        {/* Content Slides */}
        <div className="flex-1 px-6 py-4 overflow-y-auto flex flex-col justify-center">
          {step === 0 && (
            <div className="flex flex-col items-center text-center py-4">
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-3xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
                  <Scan className="w-12 h-12 stroke-[1.8]" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-2xl bg-stone-900 text-white flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
              </div>

              <h1 className="text-2xl font-black tracking-tight text-stone-900 mb-2">
                Entiende lo que comes.
              </h1>
              <p className="text-sm text-stone-600 leading-relaxed max-w-xs mb-8">
                Escanea un alimento, descubre qué contiene y compáralo con alternativas mejores sin falsos alarmismos.
              </p>

              <div className="w-full space-y-3">
                <button
                  onClick={() => setStep(1)}
                  className="w-full h-12 rounded-2xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-lg shadow-emerald-600/20"
                >
                  Empezar
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    loginSimulated('google');
                    completeOnboarding();
                  }}
                  className="w-full h-12 rounded-2xl bg-stone-100 text-stone-700 font-semibold text-sm hover:bg-stone-200 transition-colors"
                >
                  Ya tengo una cuenta
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col items-center text-center py-2">
              <div className="w-full bg-stone-50 rounded-2xl p-6 border border-stone-100 mb-6 flex flex-col items-center">
                <div className="relative w-40 h-32 bg-white rounded-xl border-2 border-emerald-500/60 shadow-sm flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-x-0 h-0.5 bg-emerald-500 shadow-[0_0_8px_#10b981] animate-scan-laser" />
                  <div className="flex items-end gap-1 px-4">
                    <div className="w-1.5 h-16 bg-stone-800 rounded" />
                    <div className="w-1 h-12 bg-stone-800 rounded" />
                    <div className="w-2.5 h-16 bg-stone-800 rounded" />
                    <div className="w-1 h-10 bg-stone-800 rounded" />
                    <div className="w-2 h-14 bg-stone-800 rounded" />
                    <div className="w-1.5 h-16 bg-stone-800 rounded" />
                    <div className="w-1 h-14 bg-stone-800 rounded" />
                    <div className="w-2 h-16 bg-stone-800 rounded" />
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 mt-3 tracking-wide">
                  EAN · QR · GS1 DIGITAL LINK
                </span>
              </div>

              <h2 className="text-xl font-extrabold tracking-tight text-stone-900 mb-2">
                Escanea cualquier alimento
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed max-w-xs mb-6">
                Obtén en segundos información nutricional, ingredientes, aditivos y grado de procesamiento.
              </p>

              <button
                onClick={() => setStep(2)}
                className="w-full h-12 rounded-2xl bg-stone-900 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-stone-800 active:scale-[0.98] transition-all"
              >
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center text-center py-2">
              <div className="w-full grid grid-cols-2 gap-2.5 mb-6">
                <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3.5 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-700">82/100</span>
                  </div>
                  <span className="text-xs font-semibold text-stone-900 block">Nutrición</span>
                  <span className="text-[10px] text-stone-500">Fibra, azúcares, sal</span>
                </div>

                <div className="bg-lime-50/70 border border-lime-100 rounded-2xl p-3.5 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <Apple className="w-4 h-4 text-lime-600" />
                    <span className="text-xs font-bold text-lime-700">73/100</span>
                  </div>
                  <span className="text-xs font-semibold text-stone-900 block">Ingredientes</span>
                  <span className="text-[10px] text-stone-500">Calidad y sencillez</span>
                </div>

                <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-3.5 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <Flame className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-amber-700">NOVA 4</span>
                  </div>
                  <span className="text-xs font-semibold text-stone-900 block">Procesamiento</span>
                  <span className="text-[10px] text-stone-500">Grado industrial</span>
                </div>

                <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3.5 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <ShieldAlert className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-blue-700">89/100</span>
                  </div>
                  <span className="text-xs font-semibold text-stone-900 block">Aditivos</span>
                  <span className="text-[10px] text-stone-500">Evidencia europea</span>
                </div>
              </div>

              <h2 className="text-xl font-extrabold tracking-tight text-stone-900 mb-2">
                No nos quedamos en una nota
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed max-w-xs mb-6">
                Te enseñamos con total transparencia por qué un producto obtiene su valoración en 4 dimensiones.
              </p>

              <button
                onClick={() => setStep(3)}
                className="w-full h-12 rounded-2xl bg-stone-900 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-stone-800 active:scale-[0.98] transition-all"
              >
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center text-center py-2">
              <div className="w-full bg-stone-50 rounded-2xl p-4 border border-stone-100 mb-5 space-y-2">
                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-stone-200/70">
                  <div className="text-left">
                    <span className="text-xs font-bold text-stone-900 block">Avena en Copos</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">94 · Cero azúcares añadidos</span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                    Alternativa top
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white/70 p-2.5 rounded-xl border border-stone-200/50">
                  <div className="text-left">
                    <span className="text-xs font-bold text-stone-900 block">Cereales Choco Crunch</span>
                    <span className="text-[10px] text-stone-500">76 · 12 g azúcar / 100 g</span>
                  </div>
                  <span className="text-[11px] font-medium text-stone-400">Escaneado</span>
                </div>

                <div className="flex items-center justify-between bg-stone-100/70 p-2 rounded-xl text-stone-400 text-xs">
                  <span>Choco Puffs Mágicos</span>
                  <span className="text-[10px] text-rose-500 font-bold">38 · 28 g azúcar</span>
                </div>
              </div>

              <h2 className="text-xl font-extrabold tracking-tight text-stone-900 mb-2">
                Encuentra opciones mejores
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed max-w-xs mb-6">
                Compara productos similares y descubre alternativas que encajen mejor con tus gustos y hábitos.
              </p>

              <button
                onClick={handleFinish}
                className="w-full h-12 rounded-2xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-lg shadow-emerald-600/20"
              >
                <Scan className="w-4 h-4" />
                Escanear mi primer producto
              </button>
            </div>
          )}
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-1.5 pb-6 pt-2">
          {[0, 1, 2, 3].map(i => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-1.5 rounded-full transition-all ${
                step === i ? 'w-6 bg-emerald-600' : 'w-2 bg-stone-200'
              }`}
              aria-label={`Ir a pantalla ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
