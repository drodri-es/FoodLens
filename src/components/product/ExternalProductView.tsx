import React from 'react';
import { ArrowLeft, Database, Info, TriangleAlert } from 'lucide-react';
import { FoodLensProduct } from '../../domain/product/FoodLensProduct';

interface ExternalProductViewProps {
  product: FoodLensProduct;
  onBack: () => void;
}

const nutritionLabels: Array<[keyof FoodLensProduct['nutrition'], string, string]> = [
  ['energyKcal', 'Energía', 'kcal'],
  ['fat', 'Grasas', 'g'],
  ['saturatedFat', 'Grasas saturadas', 'g'],
  ['carbohydrates', 'Hidratos de carbono', 'g'],
  ['sugars', 'Azúcares', 'g'],
  ['fiber', 'Fibra', 'g'],
  ['protein', 'Proteínas', 'g'],
  ['salt', 'Sal', 'g'],
];

export const ExternalProductView: React.FC<ExternalProductViewProps> = ({ product, onBack }) => {
  const availableNutrition = nutritionLabels.filter(([key]) => product.nutrition[key] !== undefined);

  return (
    <div className="min-h-full bg-stone-100 pb-10 text-stone-900">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200 px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label="Volver"
          className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-sm font-extrabold">Producto consultado</h1>
          <span className="text-[11px] text-stone-500">Datos originales, sin valoración FoodLens</span>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        <section className="bg-white rounded-3xl border border-stone-200 p-5">
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-36 h-36 object-contain mx-auto mb-4"
              referrerPolicy="no-referrer"
            />
          )}
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            {product.brand || 'Marca no disponible'}
          </p>
          <h2 className="text-xl font-extrabold mt-1">{product.name}</h2>
          <p className="text-xs text-stone-500 mt-1">
            {[product.quantity, product.barcode].filter(Boolean).join(' · ')}
          </p>
        </section>

        <section className="bg-amber-50 rounded-2xl border border-amber-200 p-4 flex gap-3">
          <TriangleAlert className="w-5 h-5 text-amber-700 shrink-0" />
          <div className="text-xs text-amber-950 leading-relaxed">
            <strong>No hay puntuación FoodLens.</strong> El motor de scoring todavía no está implementado y no se genera una nota a partir de estos datos.
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-stone-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm">Nutrición por 100 g o 100 ml</h3>
            {product.nutriScore && (
              <span className="text-xs font-bold uppercase bg-stone-100 px-2 py-1 rounded-lg">
                Nutri-Score {product.nutriScore}
              </span>
            )}
          </div>
          {availableNutrition.length > 0 ? (
            <dl className="grid grid-cols-2 gap-2">
              {availableNutrition.map(([key, label, unit]) => (
                <div key={key} className="rounded-xl bg-stone-50 p-3">
                  <dt className="text-[11px] text-stone-500">{label}</dt>
                  <dd className="text-sm font-bold tabular-nums">{product.nutrition[key]} {unit}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-xs text-stone-500">La fuente no proporciona una tabla nutricional.</p>
          )}
        </section>

        <section className="bg-white rounded-3xl border border-stone-200 p-5 space-y-4">
          <div>
            <h3 className="font-bold text-sm mb-1">Ingredientes</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {product.ingredientsText || 'Información no disponible.'}
            </p>
          </div>
          {product.allergens.length > 0 && (
            <div>
              <h3 className="font-bold text-sm mb-1">Alérgenos declarados</h3>
              <p className="text-xs text-stone-600">{product.allergens.join(', ')}</p>
            </div>
          )}
          <div className="flex gap-2 text-xs text-stone-600">
            <Info className="w-4 h-4 shrink-0" />
            <span>NOVA: {product.nova ?? 'no disponible'} · Aditivos declarados: {product.additives.length}</span>
          </div>
        </section>

        <section className="bg-blue-50 rounded-2xl border border-blue-200 p-4 text-xs text-blue-950 space-y-2">
          <div className="flex items-center gap-2 font-bold">
            <Database className="w-4 h-4" />
            Procedencia de los datos
          </div>
          <p>Fuente: {product.source.provider}</p>
          <p>Completitud del registro: {product.completeness} %</p>
          {product.missingFields.length > 0 && <p>Información ausente: {product.missingFields.join(', ')}.</p>}
          {product.source.updatedAt && (
            <p>Actualizado en origen: {new Date(product.source.updatedAt).toLocaleDateString('es-ES')}.</p>
          )}
        </section>
      </main>
    </div>
  );
};
