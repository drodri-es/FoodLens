import React from 'react';
import { ScanLine, Scale, X } from 'lucide-react';
import { FoodLensProduct } from '../../domain/product/FoodLensProduct';
import { compareFoodLensProducts } from '../../domain/comparison/compareFoodLensProducts';
import { calculateFoodLensScore } from '../../domain/scoring/calculateFoodLensScore';
import { DataOriginBadge } from '../ui/DataOrigin';
import { ScoreBadge } from '../ui/ScoreBadges';

interface ExternalComparisonViewProps {
  products: FoodLensProduct[];
  onClose: () => void;
  onScanAnother: () => void;
}

const nutritionRows: Array<[keyof FoodLensProduct['nutrition'], string, string]> = [
  ['energyKcal', 'Energía', 'kcal'],
  ['sugars', 'Azúcares', 'g'],
  ['fiber', 'Fibra', 'g'],
  ['protein', 'Proteína', 'g'],
  ['saturatedFat', 'Grasas saturadas', 'g'],
  ['salt', 'Sal', 'g'],
];

const dimensionRows = [
  ['nutrition', 'Nutrición'],
  ['ingredients', 'Ingredientes'],
  ['processing', 'Procesamiento'],
  ['additives', 'Aditivos'],
] as const;

export const ExternalComparisonView: React.FC<ExternalComparisonViewProps> = ({ products, onClose, onScanAnother }) => {
  const [first, second] = products;
  const highlights = first && second ? compareFoodLensProducts(first, second) : [];
  const scores = products.map(calculateFoodLensScore);

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-md flex items-end sm:items-center justify-center">
      <div className="w-full max-w-xl bg-stone-100 rounded-t-3xl sm:rounded-3xl max-h-[94vh] flex flex-col overflow-hidden shadow-2xl">
        <header className="bg-white px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-700" />
            <div>
              <h2 className="font-extrabold text-sm">Comparación real</h2>
              <span className="text-[11px] text-stone-500">Valores por 100 g o 100 ml</span>
            </div>
          </div>
          <button onClick={onClose} aria-label="Cerrar comparación" className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </header>

        <main className="overflow-y-auto p-4 space-y-4">
          <div className="flex justify-end"><DataOriginBadge kind="source" label="Open Food Facts" /></div>

          <section className="grid grid-cols-2 gap-3">
            {products.map((product, index) => (
              <article key={product.barcode} className="bg-white rounded-2xl border border-stone-200 p-3 text-center min-w-0">
                {product.imageUrl && <img src={product.imageUrl} alt="" className="w-20 h-20 object-contain mx-auto" />}
                <p className="text-[10px] text-stone-500 truncate mt-2">{product.brand || 'Marca no disponible'}</p>
                <h3 className="text-xs font-bold line-clamp-2 min-h-8">{product.name}</h3>
                <div className="mt-2 flex justify-center">
                  {scores[index]
                    ? <ScoreBadge score={scores[index]!.overall} size="sm" />
                    : <span className="text-[10px] text-stone-500">Sin score</span>}
                </div>
              </article>
            ))}
          </section>

          {products.length === 2 && (
            <>
              <section className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                <div className="grid grid-cols-[1.2fr_1fr_1fr] bg-stone-50 px-3 py-2 text-[10px] font-bold text-stone-500">
                  <span>Dato</span><span className="text-center">A</span><span className="text-center">B</span>
                </div>
                <div className="grid grid-cols-[1.2fr_1fr_1fr] px-3 py-2.5 border-t border-stone-100 text-xs">
                  <span className="text-stone-600">FoodLens Score</span>
                  {scores.map((score, index) => (
                    <span key={`${products[index].barcode}-score`} className="text-center font-bold">
                      {score ? `${score.overall}/100` : '—'}
                    </span>
                  ))}
                </div>
                {dimensionRows.map(([id, label]) => (
                  <div key={id} className="grid grid-cols-[1.2fr_1fr_1fr] px-3 py-2.5 border-t border-stone-100 text-xs">
                    <span className="text-stone-600">{label}</span>
                    {scores.map((score, index) => {
                      const value = score?.dimensions.find(dimension => dimension.id === id)?.score;
                      return (
                        <span key={`${products[index].barcode}-${id}`} className="text-center font-bold">
                          {value === undefined ? '—' : `${value}/100`}
                        </span>
                      );
                    })}
                  </div>
                ))}
                {nutritionRows.map(([key, label, unit]) => (
                  <div key={key} className="grid grid-cols-[1.2fr_1fr_1fr] px-3 py-2.5 border-t border-stone-100 text-xs">
                    <span className="text-stone-600">{label}</span>
                    {[first, second].map(product => (
                      <span key={`${product.barcode}-${key}`} className="text-center font-bold tabular-nums">
                        {product.nutrition[key] === undefined ? '—' : `${product.nutrition[key]} ${unit}`}
                      </span>
                    ))}
                  </div>
                ))}
                <div className="grid grid-cols-[1.2fr_1fr_1fr] px-3 py-2.5 border-t border-stone-100 text-xs">
                  <span className="text-stone-600">Nutri-Score</span>
                  {[first, second].map(product => <span key={`${product.barcode}-nutri`} className="text-center font-bold uppercase">{product.nutriScore ?? '—'}</span>)}
                </div>
                <div className="grid grid-cols-[1.2fr_1fr_1fr] px-3 py-2.5 border-t border-stone-100 text-xs">
                  <span className="text-stone-600">NOVA</span>
                  {[first, second].map(product => <span key={`${product.barcode}-nova`} className="text-center font-bold">{product.nova ?? '—'}</span>)}
                </div>
              </section>

              <section className="bg-white rounded-2xl border border-stone-200 p-4">
                <h3 className="text-xs font-bold mb-3">Diferencias observables</h3>
                {highlights.length > 0 ? (
                  <ul className="space-y-2">
                    {highlights.map(item => <li key={item.nutrient} className="text-xs text-stone-700">• {item.text}</li>)}
                  </ul>
                ) : (
                  <p className="text-xs text-stone-500">No hay suficientes valores comparables o son iguales.</p>
                )}
              </section>

              <p className="text-[11px] text-stone-500 px-1">
                La comparación describe diferencias declaradas; no determina por sí sola qué producto es adecuado para una persona.
              </p>
            </>
          )}
        </main>
        <footer className="border-t border-stone-200 bg-white p-3">
          <button
            onClick={onScanAnother}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-xs font-extrabold text-white"
          >
            <ScanLine className="h-4 w-4" />
            Escanear otro producto
          </button>
        </footer>
      </div>
    </div>
  );
};
