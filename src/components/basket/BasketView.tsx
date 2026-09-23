import React, { useState } from 'react';
import { useFoodLens } from '../../context/FoodLensContext';
import { ScoreBadge, NovaBadge } from '../ui/ScoreBadges';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import { DemoDataNotice } from '../ui/DataOrigin';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  TrendingDown, 
  TrendingUp, 
  RefreshCw, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Share2,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const BasketView: React.FC = () => {
  const { 
    basket, 
    updateBasketQuantity, 
    removeFromBasket, 
    swapBasketProduct, 
    clearBasket, 
    openScanner, 
    setActiveTab,
    openProductById,
    showToast 
  } = useFoodLens();

  const [activeTabSub, setActiveTabSub] = useState<'basket' | 'evolution'>('basket');
  const [evolutionRange, setEvolutionRange] = useState<'semana' | 'mes' | '3meses'>('semana');

  // Calculate composite basket metrics
  const totalItemsCount = basket.reduce((acc, item) => acc + item.quantity, 0);

  const averageScore = basket.length > 0
    ? Math.round(basket.reduce((acc, item) => acc + item.product.score * item.quantity, 0) / totalItemsCount)
    : 0;

  const ultraprocessedCount = basket.filter(item => item.product.dimensions.processing.nova === 4)
    .reduce((acc, item) => acc + item.quantity, 0);
  const ultraprocessedPercent = totalItemsCount > 0
    ? Math.round((ultraprocessedCount / totalItemsCount) * 100)
    : 0;

  const totalSugar = basket.reduce((acc, item) => acc + (item.product.serving.per100g.sugars * item.quantity), 0);
  const avgSugar = totalItemsCount > 0 ? +(totalSugar / totalItemsCount).toFixed(1) : 0;

  const totalFiber = basket.reduce((acc, item) => acc + (item.product.serving.per100g.fiber * item.quantity), 0);
  const avgFiber = totalItemsCount > 0 ? +(totalFiber / totalItemsCount).toFixed(1) : 0;

  // Find candidate product with highest sugar or lowest score that has a better alternative
  const swapCandidate = basket.find(item => 
    item.product.score < 80 && item.product.alternatives && item.product.alternatives.length > 0
  );

  const betterAlternative = swapCandidate?.product.alternatives[0]
    ? MOCK_PRODUCTS.find(p => p.id === swapCandidate.product.alternatives[0].productId)
    : null;

  return (
    <div className="min-h-full bg-stone-100 pb-28 text-stone-900">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200/80 px-5 py-3.5 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-stone-900">Mi cesta</h1>
          <span className="text-xs text-stone-500">
            {totalItemsCount} {totalItemsCount === 1 ? 'producto' : 'productos'} analizados
          </span>
        </div>

        {basket.length > 0 && (
          <button
            onClick={clearBasket}
            className="text-xs font-semibold text-stone-400 hover:text-rose-600 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Vaciar
          </button>
        )}
      </header>

      {/* Sub-tab switcher */}
      <div className="p-4 max-w-md mx-auto">
        <DemoDataNotice className="mb-4" />

        <div className="flex bg-stone-200/70 p-1 rounded-2xl mb-4">
          <button
            onClick={() => setActiveTabSub('basket')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTabSub === 'basket'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Cesta actual ({totalItemsCount})
          </button>
          <button
            onClick={() => setActiveTabSub('evolution')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTabSub === 'evolution'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Tu evolución
          </button>
        </div>

        {activeTabSub === 'basket' && (
          <div className="space-y-4">
            {basket.length === 0 ? (
              /* Empty state */
              <div className="bg-white rounded-3xl p-8 border border-stone-200/70 text-center shadow-xs">
                <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 stroke-[1.8]" />
                </div>
                <h3 className="font-extrabold text-stone-900 text-base mb-1">
                  Tu cesta está vacía
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed max-w-xs mx-auto mb-6">
                  Añade productos desde la ficha o escanea los alimentos de tu compra para analizarlos en conjunto.
                </p>
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={openScanner}
                    className="w-full h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                  >
                    Escanear producto
                  </button>
                  <button
                    onClick={() => setActiveTab('explore')}
                    className="w-full h-11 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs"
                  >
                    Explorar catálogo
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Overall Basket Health Profile */}
                <div className="bg-white rounded-3xl p-5 border border-stone-200/70 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                        Calidad agregada de la compra
                      </span>
                      <h2 className="text-base font-extrabold text-stone-900">
                        Perfil de tu cesta
                      </h2>
                    </div>
                    <ScoreBadge score={averageScore} size="md" />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/50">
                      <span className="text-[11px] text-stone-500 block mb-0.5">Azúcar medio</span>
                      <span className="text-sm font-bold text-stone-900 tabular-nums">{avgSugar} g</span>
                      <span className="text-[10px] text-stone-400 block">/ 100 g</span>
                    </div>

                    <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/50">
                      <span className="text-[11px] text-stone-500 block mb-0.5">Fibra media</span>
                      <span className="text-sm font-bold text-emerald-700 tabular-nums">{avgFiber} g</span>
                      <span className="text-[10px] text-stone-400 block">/ 100 g</span>
                    </div>

                    <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/50">
                      <span className="text-[11px] text-stone-500 block mb-0.5">Alimentos ultraprocesados</span>
                      <span className={`text-sm font-bold tabular-nums ${ultraprocessedPercent > 40 ? 'text-amber-700' : 'text-stone-900'}`}>
                        {ultraprocessedPercent} %
                      </span>
                      <span className="text-[10px] text-stone-400 block">del total de tu cesta</span>
                    </div>

                    <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/50">
                      <span className="text-[11px] text-stone-500 block mb-0.5">Nivel de aditivos</span>
                      <span className="text-sm font-bold text-emerald-700">Moderado</span>
                      <span className="text-[10px] text-stone-400 block">Sin alertas críticas</span>
                    </div>
                  </div>
                </div>

                {/* High-Impact Swap Opportunity */}
                {swapCandidate && betterAlternative && (
                  <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-3xl p-5 border border-emerald-200/80 shadow-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-emerald-700" />
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                        Cambio con mayor impacto
                      </span>
                    </div>

                    <p className="text-xs text-stone-700 leading-relaxed mb-4">
                      Sustituir <strong>{swapCandidate.product.name}</strong> por <strong>{betterAlternative.name}</strong> reduciría notablemente los azúcares añadidos de tu desayuno.
                    </p>

                    <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-emerald-200/70 mb-3">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={betterAlternative.imageUrl} 
                          alt={betterAlternative.name} 
                          className="w-10 h-10 object-contain rounded-xl bg-stone-50 p-1" 
                        />
                        <div>
                          <span className="font-bold text-xs text-stone-900 block">{betterAlternative.name}</span>
                          <span className="text-[10px] text-emerald-700 font-semibold">Puntuación: {betterAlternative.score} / 100</span>
                        </div>
                      </div>

                      <button
                        onClick={() => swapBasketProduct(swapCandidate.product.id, betterAlternative)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Cambiar
                      </button>
                    </div>
                  </div>
                )}

                {/* Basket Products List */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400 px-1 block">
                    Productos en la cesta ({basket.length})
                  </span>

                  {basket.map(item => (
                    <div 
                      key={item.product.id}
                      className="bg-white rounded-3xl p-4 border border-stone-200/70 shadow-xs flex items-center justify-between gap-3"
                    >
                      <div 
                        onClick={() => openProductById(item.product.id)}
                        className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-stone-50 border border-stone-200/50 p-1 flex items-center justify-center shrink-0">
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.name} 
                            className="w-full h-full object-contain mix-blend-multiply" 
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] text-stone-400 font-medium block truncate">
                            {item.product.brand} · {item.product.quantity}
                          </span>
                          <h4 className="font-bold text-xs text-stone-900 truncate">
                            {item.product.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <ScoreBadge score={item.product.score} size="sm" />
                            <NovaBadge nova={item.product.dimensions.processing.nova} size="sm" />
                          </div>
                        </div>
                      </div>

                      {/* Quantity stepper */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => updateBasketQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center"
                          aria-label="Disminuir"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-xs text-stone-900 tabular-nums w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateBasketQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center"
                          aria-label="Aumentar"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Evolution & Habits tab */}
        {activeTabSub === 'evolution' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-stone-200/70">
              <span className="text-xs font-semibold text-stone-600">Período analizado:</span>
              <div className="flex gap-1 bg-stone-100 p-1 rounded-xl">
                {(['semana', 'mes', '3meses'] as const).map(range => (
                  <button
                    key={range}
                    onClick={() => setEvolutionRange(range)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg capitalize transition-all ${
                      evolutionRange === range ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                    }`}
                  >
                    {range === '3meses' ? '3 meses' : range}
                  </button>
                ))}
              </div>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-3xl p-4 border border-stone-200/70 shadow-xs">
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                  <span>Azúcar añadido</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                    <TrendingDown className="w-3.5 h-3.5" /> -12 %
                  </span>
                </div>
                <span className="text-xl font-extrabold text-stone-900 block">Menor consumo</span>
                <span className="text-[11px] text-stone-400 mt-1 block">Frente a semanas anteriores</span>
              </div>

              <div className="bg-white rounded-3xl p-4 border border-stone-200/70 shadow-xs">
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                  <span>Fibra saciante</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" /> +8 %
                  </span>
                </div>
                <span className="text-xl font-extrabold text-stone-900 block">Mayor aporte</span>
                <span className="text-[11px] text-stone-400 mt-1 block">Más granos integrales</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-stone-200/70 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-stone-900">Sustituciones saludables</h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Has sustituido <strong>6 productos habituales</strong> por alternativas con mejor perfil nutricional e ingredientes más limpios.
              </p>
              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/50 text-xs text-stone-600">
                🌱 <em>"Hay margen de mejora en aperitivos salados, pero tu base diaria de cereales y lácteos es de gran calidad."</em>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
