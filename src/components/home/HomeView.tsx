import React from 'react';
import { useFoodLens } from '../../context/FoodLensContext';
import { ScoreBadge } from '../ui/ScoreBadges';
import { DataOriginBadge, DemoDataNotice } from '../ui/DataOrigin';
import { calculateFoodLensScore } from '../../domain/scoring/calculateFoodLensScore';
import { formatScanDate } from '../../domain/history/externalHistory';
import { 
  Scan, 
  Scale, 
  Heart, 
  ShoppingBag, 
  Search, 
  ChevronRight, 
  MessageSquare
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { 
    openScanner, 
    externalHistory,
    externalFavorites,
    openExternalProduct,
    setActiveTab, 
    openCompareModal,
    openAssistant,
    userAccount 
  } = useFoodLens();

  return (
    <div className="min-h-full bg-stone-100 pb-28 text-stone-900">
      {/* 1. Header with greeting and avatar */}
      <header className="px-5 pt-7 pb-4 bg-white border-b border-stone-200/70">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
              FL
            </div>
            <span className="text-xs font-bold text-stone-400 tracking-wider uppercase">
              FoodLens
            </span>
          </div>

          <button
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 py-1 px-2.5 rounded-full transition-colors"
          >
            <span className="text-xs font-semibold text-stone-700">
              {userAccount.name.split(' ')[0]}
            </span>
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
              {userAccount.name[0]}
            </div>
          </button>
        </div>

        <h1 className="text-2xl font-black text-stone-900 tracking-tight">
          Hola 👋
        </h1>
        <p className="text-xs text-stone-500 font-medium">
          ¿Qué quieres analizar hoy?
        </p>

        {/* Big Hero Scanner Card */}
        <div className="mt-5">
          <button
            onClick={openScanner}
            className="w-full relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-3xl p-5 shadow-lg shadow-emerald-600/20 active:scale-[0.99] transition-all text-left flex items-center justify-between"
          >
            <div className="relative z-10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200 block mb-1">
                Cámara rápida
              </span>
              <h2 className="text-xl font-extrabold tracking-tight">
                Escanear producto
              </h2>
              <p className="text-xs text-emerald-100 mt-1 max-w-[200px] leading-relaxed">
                Apunta al código de barras para ver calidad, aditivos e ingredientes.
              </p>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner">
              <Scan className="w-8 h-8 stroke-[1.8]" />
            </div>

            {/* Subtle decorative circles */}
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full pointer-events-none" />
          </button>
        </div>
      </header>

      <div className="px-4 pt-5 space-y-5 max-w-md mx-auto">
        {externalFavorites.length > 0 && (
          <section>
            <div className="flex items-center justify-between px-1 mb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">Favoritos reales</h3>
              <DataOriginBadge kind="source" label="Guardados en este dispositivo" />
            </div>
            <div className="space-y-2.5">
              {externalFavorites.slice(0, 4).map(item => {
                const score = calculateFoodLensScore(item.product);
                return (
                  <button
                    key={item.product.barcode}
                    onClick={() => openExternalProduct(item.product)}
                    className="w-full bg-white rounded-3xl p-3.5 border border-rose-200 shadow-xs flex items-center gap-3 text-left"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-stone-50 border border-stone-200/50 p-1 flex items-center justify-center shrink-0">
                      {item.product.imageUrl ? (
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-contain" />
                      ) : (
                        <Heart className="w-5 h-5 text-rose-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] text-stone-400">{item.product.brand || 'Marca no disponible'} · {item.addedAt}</span>
                      <h4 className="font-bold text-xs text-stone-900 truncate">{item.product.name}</h4>
                      {score
                        ? <ScoreBadge score={score.overall} label={score.label} size="sm" />
                        : <span className="text-[10px] text-stone-500">Datos insuficientes para puntuar</span>}
                    </div>
                    <Heart className="w-4 h-4 text-rose-500 fill-current shrink-0" />
                  </button>
                );
              })}
            </div>
          </section>
        )}

        <section>
            <div className="flex items-center justify-between px-1 mb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">Tus escaneos reales</h3>
              <DataOriginBadge kind="source" label="Open Food Facts" />
            </div>
            {externalHistory.length === 0 ? (
              <div className="bg-white rounded-3xl p-6 text-center border border-stone-200/70">
                <p className="text-xs text-stone-500 mb-3">Tu historial aparecerá aquí después de escanear un producto.</p>
                <button onClick={openScanner} className="text-xs font-bold text-emerald-700 hover:underline">
                  Escanear mi primer producto
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
              {externalHistory.slice(0, 4).map(item => {
                const score = calculateFoodLensScore(item.product);
                return (
                <button
                  key={item.product.barcode}
                  onClick={() => openExternalProduct(item.product)}
                  className="w-full bg-white rounded-3xl p-3.5 border border-blue-200 shadow-xs flex items-center gap-3 text-left"
                >
                  <div className="w-14 h-14 rounded-2xl bg-stone-50 border border-stone-200/50 p-1 flex items-center justify-center shrink-0">
                    {item.product.imageUrl ? (
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-contain" />
                    ) : (
                      <Scan className="w-5 h-5 text-stone-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-stone-400">{item.product.brand || 'Marca no disponible'} · {formatScanDate(item.scannedAt)}</span>
                    <h4 className="font-bold text-xs text-stone-900 truncate">{item.product.name}</h4>
                    {score
                      ? <ScoreBadge score={score.overall} label={score.label} size="sm" />
                      : <span className="text-[10px] text-stone-500">Datos insuficientes para puntuar</span>}
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>
                );
              })}
              </div>
            )}
          </section>

        <DemoDataNotice />

        {/* 2. Quick Access Row */}
        <div>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={openCompareModal}
              className="bg-white p-3 rounded-2xl border border-stone-200/70 shadow-xs flex flex-col items-center justify-center text-center hover:border-emerald-300 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-1.5">
                <Scale className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-stone-800 leading-tight">Comparar</span>
            </button>

            <button
              onClick={() => setActiveTab('explore')}
              className="bg-white p-3 rounded-2xl border border-stone-200/70 shadow-xs flex flex-col items-center justify-center text-center hover:border-emerald-300 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-1.5">
                <Search className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-stone-800 leading-tight">Explorar</span>
            </button>

            <button
              onClick={() => setActiveTab('basket')}
              className="bg-white p-3 rounded-2xl border border-stone-200/70 shadow-xs flex flex-col items-center justify-center text-center hover:border-emerald-300 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-1.5">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-stone-800 leading-tight">Mi cesta</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className="bg-white p-3 rounded-2xl border border-stone-200/70 shadow-xs flex flex-col items-center justify-center text-center hover:border-emerald-300 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-1.5">
                <Heart className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-stone-800 leading-tight">Favoritos</span>
            </button>
          </div>
        </div>

        {/* 5. "Pregúntale a FoodLens" smart helper card */}
        <div 
          onClick={openAssistant}
          className="bg-stone-900 text-white rounded-3xl p-4 shadow-sm flex items-center justify-between cursor-pointer hover:bg-stone-800 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-white">Pregúntale a FoodLens</h4>
              <p className="text-[11px] text-stone-400">
                Resuelve dudas nutricionales sobre cualquier producto escaneado.
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
        </div>
      </div>
    </div>
  );
};
