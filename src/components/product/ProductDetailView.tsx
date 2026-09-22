import React, { useState } from 'react';
import { useFoodLens } from '../../context/FoodLensContext';
import { Product, NovaLevel } from '../../types/foodlens';
import { calculatePersonalFit } from '../../data/mockProducts';
import { ScoreCircle } from '../ui/ScoreCircle';
import { ScoreBadge, NutriScoreBadge, NovaBadge, getScoreColor } from '../ui/ScoreBadges';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Info, 
  Check, 
  Minus, 
  Plus, 
  ShoppingBag, 
  Scale, 
  HelpCircle, 
  ExternalLink, 
  ChevronRight, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  Apple, 
  Flame, 
  Activity, 
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Sliders
} from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

export const ProductDetailView: React.FC<ProductDetailProps> = ({ product, onBack }) => {
  const { 
    isFavorite, 
    toggleFavorite, 
    addToBasket, 
    addToCompare, 
    openCompareModal,
    openProductById,
    openScoreModal,
    openReportModal,
    userGoals,
    showToast
  } = useFoodLens();

  // Serving calculation toggle
  const [servingMode, setServingMode] = useState<'100g' | 'portion'>('100g');
  const [portionGrams, setPortionGrams] = useState<number>(product.serving.defaultServing || 30);

  // Dimension details modal
  const [selectedDimension, setSelectedDimension] = useState<'nutrition' | 'ingredients' | 'processing' | 'additives' | null>(null);

  // Active user personal fit
  const personalFit = calculatePersonalFit(product, userGoals);
  const favorite = isFavorite(product.id);

  // Ratio for recalculating values by serving
  const ratio = servingMode === '100g' ? 1 : portionGrams / 100;
  const p100 = product.serving.per100g;

  const currentValues = {
    calories: Math.round(p100.calories * ratio),
    fat: +(p100.fat * ratio).toFixed(1),
    satFat: +(p100.satFat * ratio).toFixed(1),
    carbs: +(p100.carbs * ratio).toFixed(1),
    sugars: +(p100.sugars * ratio).toFixed(1),
    fiber: +(p100.fiber * ratio).toFixed(1),
    protein: +(p100.protein * ratio).toFixed(1),
    salt: +(p100.salt * ratio).toFixed(2),
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Mira el análisis de ${product.name} en FoodLens (Puntuación: ${product.score}/100)`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Enlace copiado al portapapeles');
    }
  };

  return (
    <div className="min-h-full bg-stone-100 pb-28 text-stone-900 animate-in fade-in duration-200">
      {/* 1. Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200/80 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-stone-100 text-stone-700 transition-colors"
          aria-label="Volver"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="font-bold text-sm text-stone-900 truncate max-w-[200px]">
          {product.name}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-stone-100 text-stone-600 transition-colors"
            aria-label="Compartir"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleFavorite(product.id)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              favorite ? 'text-rose-500 hover:bg-rose-50' : 'text-stone-600 hover:bg-stone-100'
            }`}
            aria-label="Guardar en favoritos"
          >
            <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </header>

      {/* 2. Hero Product Info */}
      <div className="bg-white px-5 pt-4 pb-6 border-b border-stone-200/70">
        <div className="flex flex-col items-center text-center">
          {/* Product Image */}
          <div className="w-44 h-40 rounded-3xl bg-stone-50 p-2 mb-4 border border-stone-200/60 shadow-sm flex items-center justify-center overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain mix-blend-multiply"
            />
          </div>

          {/* Titles & Meta */}
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">
            {product.brand} · {product.quantity}
          </span>
          <h1 className="text-xl font-extrabold text-stone-900 tracking-tight leading-snug max-w-sm mb-1">
            {product.name}
          </h1>
          <span className="text-xs text-stone-500 mb-5">
            {product.category}
          </span>

          {/* Central Global Score */}
          <div className="w-full max-w-xs bg-stone-50 rounded-3xl p-5 border border-stone-200/60 flex flex-col items-center">
            <ScoreCircle
              score={product.score}
              size={116}
              strokeWidth={10}
              label={product.scoreLabel}
              sublabel="Valoración agregada FoodLens"
            />

            <p className="text-xs text-stone-500 text-center mt-3 leading-relaxed max-w-[260px]">
              {product.scoreSummary}
            </p>

            <button
              onClick={openScoreModal}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              ¿Cómo calculamos esto?
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4 max-w-md mx-auto">
        {/* 3. Personalized Fit Card ("Encaje contigo") */}
        {userGoals.length > 0 && (
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-3xl p-5 border border-emerald-200/70 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                    Para ti
                  </span>
                  <span className="text-xs text-emerald-950 font-semibold">
                    {personalFit.fitLabel}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-800 tabular-nums">
                  {personalFit.score}
                </span>
                <span className="text-xs font-bold text-emerald-600"> / 100</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              {personalFit.reasons.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-emerald-900">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>{r}</span>
                </div>
              ))}
              {personalFit.caveats.map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-amber-800">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Four Multidimensional Cards */}
        <div>
          <div className="flex items-center justify-between px-1 mb-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Desglose en 4 dimensiones
            </h2>
            <span className="text-[11px] text-stone-400">Toca para detalle</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* 1. Nutrición */}
            <button
              onClick={() => setSelectedDimension('nutrition')}
              className="bg-white p-4 rounded-2xl border border-stone-200/70 shadow-xs text-left hover:border-emerald-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-stone-900 tabular-nums">
                    {product.dimensions.nutrition.score} <span className="text-[10px] text-stone-400 font-normal">/100</span>
                  </span>
                </div>
                <span className="text-xs font-bold text-stone-900 block">Nutrición</span>
                <span className="text-[11px] font-semibold text-emerald-700">
                  {product.dimensions.nutrition.label}
                </span>
              </div>
              <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mt-3">
                <div 
                  className="bg-emerald-500 h-full rounded-full" 
                  style={{ width: `${product.dimensions.nutrition.score}%` }} 
                />
              </div>
            </button>

            {/* 2. Ingredientes */}
            <button
              onClick={() => setSelectedDimension('ingredients')}
              className="bg-white p-4 rounded-2xl border border-stone-200/70 shadow-xs text-left hover:border-lime-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Apple className="w-4 h-4 text-lime-600" />
                  <span className="text-sm font-bold text-stone-900 tabular-nums">
                    {product.dimensions.ingredients.score} <span className="text-[10px] text-stone-400 font-normal">/100</span>
                  </span>
                </div>
                <span className="text-xs font-bold text-stone-900 block">Ingredientes</span>
                <span className="text-[11px] font-semibold text-lime-700">
                  {product.dimensions.ingredients.label}
                </span>
              </div>
              <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mt-3">
                <div 
                  className="bg-lime-500 h-full rounded-full" 
                  style={{ width: `${product.dimensions.ingredients.score}%` }} 
                />
              </div>
            </button>

            {/* 3. Procesamiento */}
            <button
              onClick={() => setSelectedDimension('processing')}
              className="bg-white p-4 rounded-2xl border border-stone-200/70 shadow-xs text-left hover:border-amber-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800">
                    NOVA {product.dimensions.processing.nova}
                  </span>
                </div>
                <span className="text-xs font-bold text-stone-900 block">Procesamiento</span>
                <span className="text-[11px] font-semibold text-amber-700">
                  Nivel {product.dimensions.processing.label}
                </span>
              </div>
              <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mt-3">
                <div 
                  className="bg-amber-500 h-full rounded-full" 
                  style={{ width: `${product.dimensions.processing.score}%` }} 
                />
              </div>
            </button>

            {/* 4. Aditivos */}
            <button
              onClick={() => setSelectedDimension('additives')}
              className="bg-white p-4 rounded-2xl border border-stone-200/70 shadow-xs text-left hover:border-blue-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <ShieldAlert className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-bold text-stone-900 tabular-nums">
                    {product.dimensions.additives.score} <span className="text-[10px] text-stone-400 font-normal">/100</span>
                  </span>
                </div>
                <span className="text-xs font-bold text-stone-900 block">Aditivos</span>
                <span className="text-[11px] font-semibold text-blue-700 truncate block">
                  {product.dimensions.additives.count === 0 ? 'Sin aditivos' : `${product.dimensions.additives.count} presente`}
                </span>
              </div>
              <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mt-3">
                <div 
                  className="bg-blue-500 h-full rounded-full" 
                  style={{ width: `${product.dimensions.additives.score}%` }} 
                />
              </div>
            </button>
          </div>
        </div>

        {/* 5. Balanced "Lo mejor / A tener en cuenta" card */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/70 shadow-xs space-y-4">
          {/* Lo mejor */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
              <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
              <span>Lo mejor</span>
            </div>
            <ul className="space-y-1.5 text-xs text-stone-700">
              {product.pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="h-px bg-stone-100" />

          {/* A tener en cuenta */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              <Info className="w-4 h-4 text-amber-500" />
              <span>A tener en cuenta</span>
            </div>
            <ul className="space-y-1.5 text-xs text-stone-600">
              {product.cons.map((con, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-stone-400 font-bold">•</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 6. Serving Selector ("Lo que realmente consumes") */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/70 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-stone-900">Lo que realmente consumes</h2>
              <span className="text-xs text-stone-500">Ajusta la ración para ver valores reales</span>
            </div>

            {/* Segmented control */}
            <div className="flex items-center bg-stone-100 p-1 rounded-xl">
              <button
                onClick={() => setServingMode('100g')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  servingMode === '100g' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                }`}
              >
                100 g
              </button>
              <button
                onClick={() => setServingMode('portion')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  servingMode === 'portion' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                }`}
              >
                Por ración
              </button>
            </div>
          </div>

          {servingMode === 'portion' && (
            <div className="flex items-center justify-between bg-stone-50 px-4 py-2.5 rounded-2xl border border-stone-200/60 mb-4">
              <span className="text-xs font-medium text-stone-600">Ración calculada:</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPortionGrams(Math.max(10, portionGrams - 5))}
                  className="w-8 h-8 rounded-xl bg-white border border-stone-200 text-stone-700 flex items-center justify-center font-bold active:scale-95"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-sm text-stone-900 tabular-nums">
                  {portionGrams} g
                </span>
                <button
                  onClick={() => setPortionGrams(portionGrams + 5)}
                  className="w-8 h-8 rounded-xl bg-white border border-stone-200 text-stone-700 flex items-center justify-center font-bold active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Macro grid */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-stone-50 p-2.5 rounded-2xl">
              <span className="text-[11px] text-stone-500 block">Energía</span>
              <span className="text-sm font-extrabold text-stone-900 tabular-nums">
                {currentValues.calories}
              </span>
              <span className="text-[10px] text-stone-400 block">kcal</span>
            </div>

            <div className="bg-stone-50 p-2.5 rounded-2xl">
              <span className="text-[11px] text-stone-500 block">Azúcares</span>
              <span className={`text-sm font-extrabold tabular-nums ${currentValues.sugars > 10 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {currentValues.sugars}
              </span>
              <span className="text-[10px] text-stone-400 block">g</span>
            </div>

            <div className="bg-stone-50 p-2.5 rounded-2xl">
              <span className="text-[11px] text-stone-500 block">Fibra</span>
              <span className="text-sm font-extrabold text-emerald-700 tabular-nums">
                {currentValues.fiber}
              </span>
              <span className="text-[10px] text-stone-400 block">g</span>
            </div>

            <div className="bg-stone-50 p-2.5 rounded-2xl">
              <span className="text-[11px] text-stone-500 block">Proteína</span>
              <span className="text-sm font-extrabold text-stone-900 tabular-nums">
                {currentValues.protein}
              </span>
              <span className="text-[10px] text-stone-400 block">g</span>
            </div>
          </div>
        </div>

        {/* 7. Nutrition Detailed Bars & Nutri-Score */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/70 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-stone-900">Detalle nutricional</h2>
              <span className="text-xs text-stone-500">Valores por cada 100 g</span>
            </div>
            <NutriScoreBadge grade={product.serving.nutriScore} />
          </div>

          <div className="space-y-3 pt-1">
            {/* Azúcares */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-stone-800">Azúcares</span>
                <span className="text-stone-500">
                  <strong className="text-stone-900">{p100.sugars} g</strong> / 100 g · {p100.sugars > 15 ? 'Alto' : p100.sugars > 5 ? 'Moderado' : 'Bajo'}
                </span>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${p100.sugars > 15 ? 'bg-amber-500' : p100.sugars > 5 ? 'bg-amber-400' : 'bg-emerald-500'}`} 
                  style={{ width: `${Math.min(100, (p100.sugars / 30) * 100)}%` }} 
                />
              </div>
            </div>

            {/* Grasas Saturadas */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-stone-800">Grasas saturadas</span>
                <span className="text-stone-500">
                  <strong className="text-stone-900">{p100.satFat} g</strong> / 100 g · {p100.satFat > 5 ? 'Alto' : 'Bajo'}
                </span>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${p100.satFat > 5 ? 'bg-rose-400' : 'bg-emerald-500'}`} 
                  style={{ width: `${Math.min(100, (p100.satFat / 15) * 100)}%` }} 
                />
              </div>
            </div>

            {/* Sal */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-stone-800">Sal</span>
                <span className="text-stone-500">
                  <strong className="text-stone-900">{p100.salt} g</strong> / 100 g · {p100.salt > 1 ? 'Alto' : 'Bajo'}
                </span>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${p100.salt > 1 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                  style={{ width: `${Math.min(100, (p100.salt / 2.5) * 100)}%` }} 
                />
              </div>
            </div>

            {/* Fibra */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-stone-800">Fibra</span>
                <span className="text-stone-500">
                  <strong className="text-stone-900">{p100.fiber} g</strong> / 100 g · {p100.fiber >= 6 ? 'Alta' : 'Moderada'}
                </span>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full" 
                  style={{ width: `${Math.min(100, (p100.fiber / 12) * 100)}%` }} 
                />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-stone-500 leading-relaxed pt-2 border-t border-stone-100">
            Nutri-Score es uno de los indicadores utilizados, pero nuestra valoración incorpora otros factores como aditivos y grado de procesamiento.
          </p>
        </div>

        {/* 8. Ingredients List & FoodLens Interpretation */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/70 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-stone-900">Ingredientes</h2>
          
          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/50 text-xs leading-relaxed text-stone-700">
            {product.ingredientsList.rawText}
          </div>

          {/* Highlight chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {product.ingredientsList.highlighted.map((item, i) => {
              const chipColors = {
                sugar: 'bg-amber-50 text-amber-800 border-amber-200',
                sweetener: 'bg-orange-50 text-orange-800 border-orange-200',
                palm: 'bg-rose-50 text-rose-800 border-rose-200',
                refined_oil: 'bg-amber-50 text-amber-800 border-amber-200',
                additive: 'bg-blue-50 text-blue-800 border-blue-200',
                allergen: 'bg-purple-50 text-purple-800 border-purple-200',
                neutral: 'bg-stone-100 text-stone-700 border-stone-200',
              };

              return (
                <span 
                  key={i} 
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-lg border ${chipColors[item.type]}`}
                >
                  {item.name} {item.note ? `(${item.note})` : ''}
                </span>
              );
            })}
          </div>

          <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3.5 mt-2">
            <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block mb-1">
              Interpretación FoodLens
            </span>
            <p className="text-xs text-emerald-950 leading-relaxed">
              {product.ingredientsList.summary}
            </p>
          </div>
        </div>

        {/* 9. Additives Section */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/70 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900">Aditivos ({product.additivesList.length})</h2>
            <span className="text-xs text-stone-500">Evaluación científica</span>
          </div>

          {product.additivesList.length === 0 ? (
            <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3.5 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-xs text-emerald-900 font-medium">
                Sin aditivos identificados en la formulación de este producto.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {product.additivesList.map((add, i) => (
                <div key={i} className="bg-stone-50 border border-stone-200/60 rounded-2xl p-3.5">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <span className="font-mono text-xs font-bold text-stone-900 mr-2">{add.code}</span>
                      <span className="text-xs font-semibold text-stone-800">{add.name}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      add.riskLevel === 'safe' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {add.riskLevel === 'safe' ? 'Seguro' : 'Atención'}
                    </span>
                  </div>
                  <div className="text-xs text-stone-500 mb-2">
                    Función: {add.function} · {add.status}
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed mb-2">
                    {add.assessment}
                  </p>
                  <div className="text-[11px] text-stone-400 italic">
                    FoodLens desconoce la concentración exacta de este aditivo en este producto.
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 10. Category Comparison Card */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200/70 shadow-xs space-y-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
              Comparativa
            </span>
            <h2 className="text-sm font-bold text-stone-900">
              Comparado con otros {product.categoryComparison.categoryName}
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Este producto está mejor valorado que el <strong className="text-emerald-700 font-bold">{product.categoryComparison.percentile} %</strong> de los productos analizados en su categoría.
            </p>
          </div>

          <div className="border border-stone-100 rounded-2xl overflow-hidden text-xs">
            <table className="w-full">
              <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-100">
                <tr>
                  <th className="py-2 px-3 text-left">Nutriente / 100g</th>
                  <th className="py-2 px-3 text-right">Este producto</th>
                  <th className="py-2 px-3 text-right">Media categoría</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr>
                  <td className="py-2 px-3 text-stone-700 font-medium">Azúcar</td>
                  <td className="py-2 px-3 text-right font-bold text-stone-900">{p100.sugars} g</td>
                  <td className="py-2 px-3 text-right text-stone-500">{product.categoryComparison.averages.sugars} g</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-stone-700 font-medium">Fibra</td>
                  <td className="py-2 px-3 text-right font-bold text-stone-900">{p100.fiber} g</td>
                  <td className="py-2 px-3 text-right text-stone-500">{product.categoryComparison.averages.fiber} g</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-stone-700 font-medium">Proteína</td>
                  <td className="py-2 px-3 text-right font-bold text-stone-900">{p100.protein} g</td>
                  <td className="py-2 px-3 text-right text-stone-500">{product.categoryComparison.averages.protein} g</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-stone-700 font-medium">Sal</td>
                  <td className="py-2 px-3 text-right font-bold text-stone-900">{p100.salt} g</td>
                  <td className="py-2 px-3 text-right text-stone-500">{product.categoryComparison.averages.salt} g</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700">
              {product.categoryComparison.sugarDiffPercent <= 0 
                ? `${Math.abs(product.categoryComparison.sugarDiffPercent)} % menos azúcar que la media` 
                : `${product.categoryComparison.sugarDiffPercent} % más azúcar`}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700">
              +{product.categoryComparison.fiberDiffPercent} % más fibra
            </span>
          </div>
        </div>

        {/* 11. Alternatives Carousel */}
        {product.alternatives.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="text-sm font-bold text-stone-900">Alternativas que podrían interesarte</h2>
                <span className="text-xs text-stone-500">Opciones con mejor perfil nutricional o ingredientes</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {product.alternatives.map(alt => (
                <div
                  key={alt.productId}
                  className="bg-white rounded-3xl p-4 border border-stone-200/70 shadow-xs flex items-center justify-between gap-3 hover:border-emerald-300 transition-colors"
                >
                  <div 
                    onClick={() => openProductById(alt.productId)}
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-stone-50 border border-stone-200/50 p-1 flex items-center justify-center shrink-0">
                      <img
                        src={alt.imageUrl}
                        alt={alt.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <ScoreBadge score={alt.score} size="sm" />
                        <span className="text-[11px] font-semibold text-emerald-700">
                          {alt.reason}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-stone-900 mt-1">
                        {alt.name}
                      </h4>
                      <span className="text-[11px] text-stone-500 block">
                        {alt.keyDifference}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addToCompare(alt.productId);
                      addToCompare(product.id);
                      openCompareModal();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold shrink-0 transition-colors"
                  >
                    Comparar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 12. Transparency & Report Error Footer */}
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/50 text-xs text-stone-500 space-y-2">
          <div className="flex items-center justify-between">
            <span>Fuente: <strong>{product.transparency.source}</strong></span>
            <span>Actualizado: {product.transparency.lastUpdated}</span>
          </div>
          <p className="text-[11px] text-stone-400 leading-relaxed">
            FoodLens separa los datos originales de la etiqueta de la interpretación algorítmica.
          </p>
          <button
            onClick={openReportModal}
            className="text-stone-700 font-semibold hover:underline flex items-center gap-1 text-xs pt-1"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            ¿Detectas algún dato incorrecto? Reportar error
          </button>
        </div>
      </div>

      {/* 13. Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/80 p-3.5 max-w-md mx-auto flex items-center gap-3">
        <button
          onClick={() => {
            addToCompare(product.id);
            openCompareModal();
          }}
          className="h-12 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Scale className="w-4 h-4" />
          Comparar
        </button>

        <button
          onClick={() => addToBasket(product, 1)}
          className="flex-1 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          Añadir a mi cesta
        </button>
      </div>

      {/* Dimension Detail Sheet */}
      {selectedDimension && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center p-0 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="w-10 h-1.5 bg-stone-300 rounded-full mx-auto mb-4" />
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-extrabold text-stone-900">
                {selectedDimension === 'nutrition' && 'Detalle de Nutrición'}
                {selectedDimension === 'ingredients' && 'Detalle de Ingredientes'}
                {selectedDimension === 'processing' && 'Detalle de Procesamiento'}
                {selectedDimension === 'additives' && 'Detalle de Aditivos'}
              </h3>
              <button
                onClick={() => setSelectedDimension(null)}
                className="text-stone-400 hover:text-stone-700 text-xs font-semibold"
              >
                Cerrar
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-700">
              {selectedDimension === 'nutrition' && (
                <div>
                  <ScoreBadge score={product.dimensions.nutrition.score} label={product.dimensions.nutrition.label} />
                  <p className="mt-3 leading-relaxed text-stone-600">
                    {product.dimensions.nutrition.summary}
                  </p>
                </div>
              )}

              {selectedDimension === 'ingredients' && (
                <div>
                  <ScoreBadge score={product.dimensions.ingredients.score} label={product.dimensions.ingredients.label} />
                  <p className="mt-3 leading-relaxed text-stone-600">
                    {product.dimensions.ingredients.summary}
                  </p>
                </div>
              )}

              {selectedDimension === 'processing' && (
                <div>
                  <NovaBadge nova={product.dimensions.processing.nova} />
                  <p className="mt-3 leading-relaxed text-stone-800 font-medium">
                    {product.processingDetail.shortExplanation}
                  </p>
                  <p className="mt-2 text-stone-500 leading-relaxed">
                    {product.processingDetail.whatMeans}
                  </p>
                  <div className="mt-3 bg-amber-50 p-3 rounded-xl border border-amber-100 text-amber-900">
                    {product.processingDetail.notAutomaticallyBadNote}
                  </div>
                </div>
              )}

              {selectedDimension === 'additives' && (
                <div>
                  <ScoreBadge score={product.dimensions.additives.score} label={product.dimensions.additives.label} />
                  <p className="mt-3 leading-relaxed text-stone-600">
                    {product.dimensions.additives.summary}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedDimension(null)}
              className="w-full h-11 mt-6 rounded-2xl bg-stone-900 text-white font-bold text-xs"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
