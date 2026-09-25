import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, CircleAlert, Database, Heart, Info, ScanLine, Scale, TriangleAlert } from 'lucide-react';
import { FoodLensProduct } from '../../domain/product/FoodLensProduct';
import { calculateFoodLensScore } from '../../domain/scoring/calculateFoodLensScore';
import { DataOriginBadge } from '../ui/DataOrigin';
import { NovaBadge, NutriScoreBadge, ScoreBadge } from '../ui/ScoreBadges';
import { NutriScoreGrade } from '../../types/foodlens';
import { summarizeFoodLensProduct } from '../../domain/product/summarizeFoodLensProduct';

interface ExternalProductViewProps {
  product: FoodLensProduct;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onCompare: () => void;
  onScanAnother: () => void;
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

export const ExternalProductView: React.FC<ExternalProductViewProps> = ({
  product,
  onBack,
  isFavorite,
  onToggleFavorite,
  onCompare,
  onScanAnother,
}) => {
  const [nutritionMode, setNutritionMode] = useState<'per100' | 'serving'>('per100');
  const hasServingNutrition = Boolean(
    product.nutritionPerServing
    && Object.values(product.nutritionPerServing).some(value => value !== undefined),
  );
  const displayedNutrition = nutritionMode === 'serving' && hasServingNutrition
    ? product.nutritionPerServing!
    : product.nutrition;
  const availableNutrition = nutritionLabels.filter(([key]) => product.nutrition[key] !== undefined);
  const displayedNutritionRows = nutritionLabels.filter(([key]) => displayedNutrition[key] !== undefined);
  const displayedCategories = product.categories.slice(-2);
  const score = calculateFoodLensScore(product);
  const highlights = summarizeFoodLensProduct(product);
  const assessmentIds = new Set((product.sourceAssessments ?? []).map(item => item.id));
  const hasNutritionAssessment = assessmentIds.has('nutrition') || Boolean(product.nutriScore);
  const hasSecondaryAssessment = assessmentIds.has('processing')
    || assessmentIds.has('additives')
    || product.nova !== undefined;
  const confidenceLabel = score && (score.confidence >= 70
    ? 'alta'
    : score.confidence >= 40 ? 'media' : 'baja');

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
        <div className="min-w-0 flex-1">
          <h1 className="text-sm font-extrabold">Producto consultado</h1>
          <span className="text-[11px] text-stone-500">Datos reales y valoración FoodLens</span>
        </div>
        <button
          onClick={onToggleFavorite}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          aria-pressed={isFavorite}
          className={`w-9 h-9 rounded-full flex items-center justify-center ${
            isFavorite ? 'bg-rose-50 text-rose-600' : 'bg-stone-100 text-stone-600'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </header>

      <div className="sticky top-[65px] z-20 border-b border-stone-200 bg-white/95 px-4 py-3 backdrop-blur-md">
        <button
          onClick={onScanAnother}
          className="mx-auto flex h-11 w-full max-w-md items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-sm font-extrabold text-white shadow-md shadow-emerald-700/20"
        >
          <ScanLine className="h-5 w-5" />
          Escanear otro producto
        </button>
      </div>

      <main className="max-w-md mx-auto p-4 space-y-4">
        <section className="bg-white rounded-3xl border border-stone-200 p-5">
          <DataOriginBadge kind="source" label="Open Food Facts" className="mb-3" />
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
          <div className="mt-3 flex items-start gap-2 text-xs">
            <span className="font-bold text-stone-700">Categoría:</span>
            {displayedCategories.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {displayedCategories.map(category => (
                  <span key={category} className="rounded-lg bg-emerald-50 px-2 py-0.5 font-medium text-emerald-800">
                    {category}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-stone-500">No disponible</span>
            )}
          </div>
          <button
            onClick={onCompare}
            className="w-full h-11 mt-4 rounded-2xl bg-stone-900 text-white text-xs font-bold flex items-center justify-center gap-2"
          >
            <Scale className="w-4 h-4" />
            Comparar con otro producto
          </button>
        </section>

        <section className="bg-white rounded-3xl border border-stone-200 p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-bold text-sm">Referencias de la fuente</h3>
            <DataOriginBadge kind="source" label="Open Food Facts" />
          </div>
          <div className="flex flex-wrap gap-2">
            {product.nutriScore
              ? <NutriScoreBadge grade={product.nutriScore.toUpperCase() as NutriScoreGrade} />
              : <span className="text-xs text-stone-500">Nutri-Score no disponible</span>}
            {product.nova
              ? <NovaBadge nova={product.nova} />
              : <span className="text-xs text-stone-500">NOVA no disponible</span>}
          </div>
        </section>

        {score ? (
          <section className="bg-white rounded-3xl border border-violet-200 p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm mb-1">FoodLens Score</h3>
                <p className="text-[11px] text-stone-500">Versión {score.algorithmVersion}</p>
              </div>
              <DataOriginBadge kind="calculated" />
            </div>
            <ScoreBadge score={score.overall} label={score.label} size="lg" />
            <p className="text-xs text-stone-600">
              Confianza {confidenceLabel}: {score.confidence} %. Se ponderan únicamente las dimensiones con valoración disponible.
            </p>
            <div className="space-y-3">
              {score.dimensions.map(dimension => (
                <div key={dimension.id} className="rounded-xl bg-stone-50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold">{dimension.label} · {dimension.weight} %</span>
                    <span className="text-xs font-bold tabular-nums">
                      {dimension.score === undefined ? 'Sin evaluar' : `${dimension.score}/100`}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">{dimension.explanation}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 text-[11px] leading-relaxed text-amber-900 bg-amber-50 border border-amber-200 rounded-xl p-3">
              <TriangleAlert className="w-4 h-4 shrink-0" />
              <span>Valoración orientativa, no validada clínicamente. No sustituye asesoramiento nutricional o médico.</span>
            </div>
          </section>
        ) : (
          <section className="bg-amber-50 rounded-2xl border border-amber-200 p-4 flex gap-3">
            <TriangleAlert className="w-5 h-5 text-amber-700 shrink-0" />
            <div className="text-xs text-amber-950 leading-relaxed">
              <strong>No hay datos suficientes para calcular una valoración FoodLens.</strong>{' '}
              {!hasNutritionAssessment
                ? 'Falta una valoración Nutri-Score utilizable.'
                : !hasSecondaryAssessment
                  ? 'Falta una valoración conocida de NOVA o aditivos.'
                  : 'La información disponible no alcanza el mínimo de cobertura requerido.'}
            </div>
          </section>
        )}

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-emerald-950">
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              Lo mejor
            </div>
            {highlights.best.length > 0 ? (
              <ul className="space-y-2">
                {highlights.best.map(item => (
                  <li key={item.id} className="text-xs leading-relaxed text-emerald-950">✓ {item.text}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs leading-relaxed text-emerald-900/75">No hay datos suficientes para destacar valores en esta sección.</p>
            )}
          </div>

          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-amber-950">
              <CircleAlert className="h-4 w-4 text-amber-700" />
              A tener en cuenta
            </div>
            {highlights.attention.length > 0 ? (
              <ul className="space-y-2">
                {highlights.attention.map(item => (
                  <li key={item.id} className="text-xs leading-relaxed text-amber-950">• {item.text}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs leading-relaxed text-amber-900/75">No hay datos suficientes para destacar valores en esta sección.</p>
            )}
          </div>
          <p className="text-[10px] leading-relaxed text-stone-500 sm:col-span-2">
            Selección automática de datos declarados. No determina por sí sola la calidad global ni la adecuación del producto.
          </p>
        </section>

        <section className="bg-white rounded-3xl border border-stone-200 p-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h3 className="font-bold text-sm">Información nutricional</h3>
              <p className="mt-0.5 text-[11px] text-stone-500">
                {nutritionMode === 'serving'
                  ? `Por ración${product.servingSize ? ` (${product.servingSize})` : ''}`
                  : 'Por 100 g o 100 ml'}
              </p>
            </div>
            {product.nutriScore && (
              <span className="text-xs font-bold uppercase bg-stone-100 px-2 py-1 rounded-lg">
                Nutri-Score {product.nutriScore}
              </span>
            )}
          </div>

          {hasServingNutrition && (
            <div className="mb-4 grid grid-cols-2 rounded-xl bg-stone-100 p-1" role="group" aria-label="Unidad de información nutricional">
              <button
                onClick={() => setNutritionMode('per100')}
                aria-pressed={nutritionMode === 'per100'}
                className={`rounded-lg px-3 py-2 text-[11px] font-bold transition-colors ${
                  nutritionMode === 'per100' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                }`}
              >
                Por 100 g/ml
              </button>
              <button
                onClick={() => setNutritionMode('serving')}
                aria-pressed={nutritionMode === 'serving'}
                className={`rounded-lg px-3 py-2 text-[11px] font-bold transition-colors ${
                  nutritionMode === 'serving' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                }`}
              >
                Por ración
              </button>
            </div>
          )}

          {displayedNutritionRows.length > 0 ? (
            <dl className="grid grid-cols-2 gap-2">
              {displayedNutritionRows.map(([key, label, unit]) => (
                <div key={key} className="rounded-xl bg-stone-50 p-3">
                  <dt className="text-[11px] text-stone-500">{label}</dt>
                  <dd className="text-sm font-bold tabular-nums">{displayedNutrition[key]} {unit}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-xs text-stone-500">La fuente no proporciona una tabla nutricional.</p>
          )}
          {!hasServingNutrition && availableNutrition.length > 0 && (
            <p className="mt-3 text-[11px] text-stone-400">Open Food Facts no proporciona valores por ración para este producto.</p>
          )}
          <div className="mt-4"><DataOriginBadge kind="source" /></div>
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
          <div className="flex items-center justify-between gap-2">
            <p>Completitud del registro: {product.completeness} %</p>
            <DataOriginBadge kind="calculated" label="Cálculo estructural" />
          </div>
          {product.missingFields.length > 0 && <p>Información ausente: {product.missingFields.join(', ')}.</p>}
          {product.source.updatedAt && (
            <p>Actualizado en origen: {new Date(product.source.updatedAt).toLocaleDateString('es-ES')}.</p>
          )}
        </section>
      </main>
    </div>
  );
};
