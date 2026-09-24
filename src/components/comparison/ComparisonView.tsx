import React, { useState } from 'react';
import { useFoodLens } from '../../context/FoodLensContext';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import { ScoreBadge, NovaBadge } from '../ui/ScoreBadges';
import { DemoDataNotice } from '../ui/DataOrigin';
import { ExternalComparisonView } from './ExternalComparisonView';
import { 
  X, 
  Plus, 
  Scale, 
  ArrowLeft, 
  Check, 
  Info, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';

export const ComparisonView: React.FC = () => {
  const { 
    isComparingOpen, 
    closeCompareModal, 
    comparisonProductIds, 
    removeFromCompare, 
    addToCompare,
    addToBasket,
    openProductById,
    userGoals,
    externalComparisonProducts,
    clearExternalComparison,
  } = useFoodLens();

  const [addSelectorOpen, setAddSelectorOpen] = useState<boolean>(false);

  if (!isComparingOpen) return null;

  if (externalComparisonProducts.length > 0) {
    return <ExternalComparisonView products={externalComparisonProducts} onClose={clearExternalComparison} />;
  }

  const comparedProducts = comparisonProductIds
    .map(id => MOCK_PRODUCTS.find(p => p.id === id))
    .filter(Boolean) as typeof MOCK_PRODUCTS;

  // Compute smart differences summary
  const getVerdictSummary = () => {
    if (comparedProducts.length < 2) {
      return 'Añade al menos dos productos para comparar sus diferencias clave.';
    }

    const sortedBySugar = [...comparedProducts].sort(
      (a, b) => a.serving.per100g.sugars - b.serving.per100g.sugars
    );
    const sortedByFiber = [...comparedProducts].sort(
      (a, b) => b.serving.per100g.fiber - a.serving.per100g.fiber
    );
    const sortedByProcessing = [...comparedProducts].sort(
      (a, b) => a.dimensions.processing.nova - b.dimensions.processing.nova
    );

    const lowestSugar = sortedBySugar[0];
    const highestFiber = sortedByFiber[0];
    const leastProcessed = sortedByProcessing[0];

    return {
      lowestSugar,
      highestFiber,
      leastProcessed,
    };
  };

  const verdict = getVerdictSummary();

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-md flex items-end sm:items-center justify-center animate-in fade-in">
      <div className="w-full max-w-xl bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-600" />
            <h2 className="font-extrabold text-base text-stone-900">Comparar productos</h2>
            <span className="text-xs text-stone-400 font-medium">({comparedProducts.length}/3)</span>
          </div>

          <button
            onClick={closeCompareModal}
            className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <DemoDataNotice />

          {/* Empty state if fewer than 1 product */}
          {comparedProducts.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Scale className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="font-bold text-stone-900 text-sm mb-1">Sin productos para comparar</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto mb-4">
                Añade hasta 3 productos desde su ficha o elige uno del catálogo para ver sus diferencias.
              </p>
              <button
                onClick={() => setAddSelectorOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs"
              >
                Elegir producto
              </button>
            </div>
          ) : (
            <>
              {/* Product Cards Row */}
              <div className="grid grid-cols-3 gap-2">
                {comparedProducts.map(p => (
                  <div key={p.id} className="relative bg-stone-50 rounded-2xl p-2.5 border border-stone-200/70 flex flex-col justify-between text-center">
                    <button
                      onClick={() => removeFromCompare(p.id)}
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 text-xs shadow-xs"
                      aria-label="Quitar de comparación"
                    >
                      <X className="w-3 h-3" />
                    </button>

                    <div className="w-14 h-14 mx-auto rounded-xl bg-white p-1 mb-1.5 flex items-center justify-center overflow-hidden border border-stone-200/50">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>

                    <h4 
                      onClick={() => {
                        closeCompareModal();
                        openProductById(p.id);
                      }}
                      className="font-bold text-[11px] text-stone-900 leading-tight line-clamp-2 hover:underline cursor-pointer"
                    >
                      {p.name}
                    </h4>
                    <span className="text-[10px] text-stone-400 block mb-2">{p.brand}</span>

                    <div className="mt-auto">
                      <ScoreBadge score={p.score} size="sm" />
                    </div>
                  </div>
                ))}

                {/* Add product placeholder if less than 3 */}
                {comparedProducts.length < 3 && (
                  <button
                    onClick={() => setAddSelectorOpen(true)}
                    className="min-h-[140px] rounded-2xl border-2 border-dashed border-stone-200 hover:border-emerald-400 bg-stone-50/50 flex flex-col items-center justify-center gap-1 text-stone-400 hover:text-emerald-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="text-[11px] font-semibold">Añadir</span>
                  </button>
                )}
              </div>

              {/* Comparison Matrix Table */}
              <div className="border border-stone-200/80 rounded-2xl overflow-hidden bg-white text-xs">
                {/* Score */}
                <div className="grid grid-cols-4 p-2.5 border-b border-stone-100 bg-stone-50/70 font-semibold text-stone-700">
                  <span className="col-span-1">Puntuación</span>
                  {comparedProducts.map(p => (
                    <span key={p.id} className="text-center font-bold text-stone-900">
                      {p.score} / 100
                    </span>
                  ))}
                  {Array.from({ length: 3 - comparedProducts.length }).map((_, i) => (
                    <span key={i} className="text-center text-stone-300">-</span>
                  ))}
                </div>

                {/* Nutrición */}
                <div className="grid grid-cols-4 p-2.5 border-b border-stone-100 items-center">
                  <span className="col-span-1 text-stone-500 font-medium">Nutrición</span>
                  {comparedProducts.map(p => (
                    <span key={p.id} className="text-center font-semibold text-stone-800">
                      {p.dimensions.nutrition.score} <span className="text-[10px] text-stone-400">({p.serving.nutriScore})</span>
                    </span>
                  ))}
                  {Array.from({ length: 3 - comparedProducts.length }).map((_, i) => (
                    <span key={i} className="text-center text-stone-300">-</span>
                  ))}
                </div>

                {/* Procesamiento */}
                <div className="grid grid-cols-4 p-2.5 border-b border-stone-100 items-center">
                  <span className="col-span-1 text-stone-500 font-medium">NOVA</span>
                  {comparedProducts.map(p => (
                    <span key={p.id} className="text-center font-bold">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                        p.dimensions.processing.nova <= 2 ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                      }`}>
                        NOVA {p.dimensions.processing.nova}
                      </span>
                    </span>
                  ))}
                  {Array.from({ length: 3 - comparedProducts.length }).map((_, i) => (
                    <span key={i} className="text-center text-stone-300">-</span>
                  ))}
                </div>

                {/* Aditivos */}
                <div className="grid grid-cols-4 p-2.5 border-b border-stone-100 items-center">
                  <span className="col-span-1 text-stone-500 font-medium">Aditivos</span>
                  {comparedProducts.map(p => (
                    <span key={p.id} className="text-center text-stone-700">
                      {p.additivesList.length === 0 ? '0' : p.additivesList.length}
                    </span>
                  ))}
                  {Array.from({ length: 3 - comparedProducts.length }).map((_, i) => (
                    <span key={i} className="text-center text-stone-300">-</span>
                  ))}
                </div>

                {/* Azúcar */}
                <div className="grid grid-cols-4 p-2.5 border-b border-stone-100 items-center">
                  <span className="col-span-1 text-stone-500 font-medium">Azúcar / 100g</span>
                  {comparedProducts.map(p => (
                    <span key={p.id} className={`text-center font-bold ${
                      p.serving.per100g.sugars <= 5 ? 'text-emerald-700' : p.serving.per100g.sugars > 15 ? 'text-amber-700' : 'text-stone-800'
                    }`}>
                      {p.serving.per100g.sugars} g
                    </span>
                  ))}
                  {Array.from({ length: 3 - comparedProducts.length }).map((_, i) => (
                    <span key={i} className="text-center text-stone-300">-</span>
                  ))}
                </div>

                {/* Fibra */}
                <div className="grid grid-cols-4 p-2.5 border-b border-stone-100 items-center">
                  <span className="col-span-1 text-stone-500 font-medium">Fibra / 100g</span>
                  {comparedProducts.map(p => (
                    <span key={p.id} className={`text-center font-bold ${p.serving.per100g.fiber >= 6 ? 'text-emerald-700' : 'text-stone-700'}`}>
                      {p.serving.per100g.fiber} g
                    </span>
                  ))}
                  {Array.from({ length: 3 - comparedProducts.length }).map((_, i) => (
                    <span key={i} className="text-center text-stone-300">-</span>
                  ))}
                </div>

                {/* Proteína */}
                <div className="grid grid-cols-4 p-2.5 border-b border-stone-100 items-center">
                  <span className="col-span-1 text-stone-500 font-medium">Proteína / 100g</span>
                  {comparedProducts.map(p => (
                    <span key={p.id} className="text-center font-semibold text-stone-800">
                      {p.serving.per100g.protein} g
                    </span>
                  ))}
                  {Array.from({ length: 3 - comparedProducts.length }).map((_, i) => (
                    <span key={i} className="text-center text-stone-300">-</span>
                  ))}
                </div>

                {/* Sal */}
                <div className="grid grid-cols-4 p-2.5 items-center">
                  <span className="col-span-1 text-stone-500 font-medium">Sal / 100g</span>
                  {comparedProducts.map(p => (
                    <span key={p.id} className="text-center text-stone-700">
                      {p.serving.per100g.salt} g
                    </span>
                  ))}
                  {Array.from({ length: 3 - comparedProducts.length }).map((_, i) => (
                    <span key={i} className="text-center text-stone-300">-</span>
                  ))}
                </div>
              </div>

              {/* Smart Non-Dogmatic Differences Verdict */}
              {typeof verdict === 'object' && comparedProducts.length >= 2 && (
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/60 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-800">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Las diferencias principales</span>
                  </div>

                  <ul className="space-y-1.5 text-xs text-stone-700">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>
                        Si priorizas reducir azúcar, <strong>{verdict.lowestSugar.name}</strong> destaca con solo {verdict.lowestSugar.serving.per100g.sugars} g / 100 g.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>
                        Para aumentar saciedad y fibra, <strong>{verdict.highestFiber.name}</strong> aporta {verdict.highestFiber.serving.per100g.fiber} g de fibra.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>
                        En formulación limpia, <strong>{verdict.leastProcessed.name}</strong> cuenta con procesamiento mínimo (NOVA {verdict.leastProcessed.dimensions.processing.nova}).
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </>
          )}

          {/* Selector drawer when user wants to pick another product */}
          {addSelectorOpen && (
            <div className="bg-stone-100 rounded-2xl p-3 border border-stone-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-800">Seleccionar producto para comparar</span>
                <button 
                  onClick={() => setAddSelectorOpen(false)}
                  className="text-stone-400 hover:text-stone-600 text-xs"
                >
                  Cerrar
                </button>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {MOCK_PRODUCTS.filter(p => !comparisonProductIds.includes(p.id)).map(p => (
                  <div 
                    key={p.id}
                    onClick={() => {
                      addToCompare(p.id);
                      setAddSelectorOpen(false);
                    }}
                    className="flex items-center justify-between p-2 rounded-xl bg-white hover:bg-stone-50 cursor-pointer border border-stone-200/60"
                  >
                    <div className="flex items-center gap-2">
                      <img src={p.imageUrl} alt={p.name} className="w-8 h-8 object-contain rounded" />
                      <div>
                        <span className="font-bold text-xs text-stone-900 block">{p.name}</span>
                        <span className="text-[10px] text-stone-500">{p.brand}</span>
                      </div>
                    </div>
                    <ScoreBadge score={p.score} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
