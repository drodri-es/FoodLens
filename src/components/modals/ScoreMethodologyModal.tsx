import React from 'react';
import { useFoodLens } from '../../context/FoodLensContext';
import { X, Activity, Apple, Flame, ShieldAlert, CheckCircle2, FlaskConical } from 'lucide-react';

export const ScoreMethodologyModal: React.FC = () => {
  const { isScoreModalOpen, closeScoreModal } = useFoodLens();

  if (!isScoreModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-stone-900">
              Cómo funciona nuestra valoración
            </h2>
            <span className="text-xs text-stone-500">Metodología v0.2 · Prototipo</span>
          </div>
          <button
            onClick={closeScoreModal}
            className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-stone-700 leading-relaxed">
          <p>
            En <strong>FoodLens</strong> creemos que la alimentación no puede reducirse a una simple nota binaria. Por eso analizamos cada alimento en <strong>cuatro dimensiones independientes</strong> antes de generar un score global orientativo:
          </p>

          <div className="bg-violet-50 rounded-2xl p-4 border border-violet-200 flex items-start gap-2.5 text-violet-950">
            <FlaskConical className="w-4 h-4 text-violet-700 shrink-0 mt-0.5" />
            <p>
              <strong>Dos modos:</strong> el catálogo contiene puntuaciones ficticias marcadas como demostración. Los productos escaneados usan el cálculo experimental 0.1.0, con entradas normalizadas de Open Food Facts, desglose y nivel de confianza.
            </p>
          </div>

          {/* Dimension 1 */}
          <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-100 space-y-1">
            <div className="flex items-center gap-2 font-bold text-emerald-900 text-xs">
              <Activity className="w-4 h-4 text-emerald-600" />
              1. Calidad Nutricional (Ponderación 45 %)
            </div>
            <p className="text-stone-600">
              En productos escaneados utiliza la valoración Nutri-Score normalizada que entrega Open Food Facts; FoodLens no recalcula ni modifica esa valoración.
            </p>
          </div>

          {/* Dimension 2 */}
          <div className="bg-lime-50/70 rounded-2xl p-4 border border-lime-100 space-y-1">
            <div className="flex items-center gap-2 font-bold text-lime-900 text-xs">
              <Apple className="w-4 h-4 text-lime-600" />
              2. Composición de Ingredientes (Ponderación 25 %)
            </div>
            <p className="text-stone-600">
              Esta dimensión permanece sin evaluar en productos reales hasta disponer de reglas verificables y fuentes adecuadas. Los alérgenos no reducen la puntuación.
            </p>
          </div>

          {/* Dimension 3 */}
          <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-100 space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-900 text-xs">
              <Flame className="w-4 h-4 text-amber-600" />
              3. Grado de Procesamiento (Ponderación 15 %)
            </div>
            <p className="text-stone-600">
              Utiliza el atributo NOVA normalizado por Open Food Facts. La clasificación se muestra por separado y no se describe como un diagnóstico del producto.
            </p>
          </div>

          {/* Dimension 4 */}
          <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-100 space-y-1">
            <div className="flex items-center gap-2 font-bold text-blue-900 text-xs">
              <ShieldAlert className="w-4 h-4 text-blue-600" />
              4. Evaluación de Aditivos (Ponderación 15 %)
            </div>
            <p className="text-stone-600">
              Utiliza el atributo de aditivos de Open Food Facts. Las fichas de demostración no califican un aditivo como seguro o peligroso sin una evaluación identificable y aplicable al uso concreto.
            </p>
          </div>

          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2">
            <p className="font-bold text-stone-900">Escala visual propuesta</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
              <span><strong>80–100:</strong> Excelente</span>
              <span><strong>60–79:</strong> Buena opción</span>
              <span><strong>40–59:</strong> Mejorable</span>
              <span><strong>0–39:</strong> Ocasional</span>
            </div>
            <p className="text-stone-500">
              Estas etiquetas son orientativas y no determinan por sí solas si un alimento es adecuado para una persona.
            </p>
          </div>

          {/* Legal / Scientific Disclaimer */}
          <div className="border-t border-stone-100 pt-4 space-y-2">
            <div className="flex items-start gap-2 text-stone-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>
                <strong>Herramienta orientativa:</strong> Nuestro algoritmo es una guía para facilitar elecciones conscientes en el supermercado, no un diagnóstico clínico o médico.
              </p>
            </div>
            <div className="flex items-start gap-2 text-stone-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>
                <strong>Los datos del fabricante mandan:</strong> Las formulaciones de los productos cambian periódicamente. Comprueba siempre la información del envase físico.
              </p>
            </div>
            <div className="flex items-start gap-2 text-stone-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>
                <strong>Trazabilidad:</strong> los productos escaneados muestran fuente, fecha, versión del algoritmo, dimensiones utilizadas e información ausente.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-100">
          <button
            onClick={closeScoreModal}
            className="w-full h-11 rounded-2xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
