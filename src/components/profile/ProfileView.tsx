import React, { useState } from 'react';
import { useFoodLens } from '../../context/FoodLensContext';
import { HEALTH_GOALS, DIETARY_PREFERENCES } from '../../data/mockProducts';
import { HealthGoal, DietaryPreference } from '../../types/foodlens';
import { DemoDataNotice, DataOriginBadge } from '../ui/DataOrigin';
import { filterExternalHistory, formatScanDate, groupExternalHistory } from '../../domain/history/externalHistory';
import { 
  User, 
  Target, 
  Heart, 
  History, 
  ShoppingBag, 
  HelpCircle, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles, 
  AlertTriangle,
  RotateCcw,
  LogOut,
  LogIn,
  Check,
  Plus,
  Search,
  Trash2,
  Scale
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { 
    userGoals, 
    toggleGoal, 
    setGoals,
    dietaryPreferences, 
    toggleDietaryPreference,
    userAccount,
    loginSimulated,
    logoutSimulated,
    resetOnboarding,
    openScoreModal,
    favorites,
    favoriteLists,
    history,
    basket,
    openProductById,
    externalHistory,
    openExternalProduct,
    removeExternalHistory,
    clearExternalHistory,
    startExternalComparison,
    showToast
  } = useFoodLens();

  const [activeSubView, setActiveSubView] = useState<'main' | 'goals' | 'diet' | 'favorites' | 'history'>('main');
  const [newListName, setNewListName] = useState<string>('');
  const [showAddList, setShowAddList] = useState<boolean>(false);
  const [selectedFavList, setSelectedFavList] = useState<string>('todos');
  const [historyQuery, setHistoryQuery] = useState<string>('');
  const filteredHistory = filterExternalHistory(externalHistory, historyQuery);
  const groupedHistory = groupExternalHistory(filteredHistory);

  return (
    <div className="min-h-full bg-stone-100 pb-28 text-stone-900">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200/80 px-5 py-4 flex items-center justify-between">
        {activeSubView === 'main' ? (
          <h1 className="text-lg font-black text-stone-900">Perfil</h1>
        ) : (
          <button
            onClick={() => setActiveSubView('main')}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-700"
          >
            ← Volver a Perfil
          </button>
        )}
      </header>

      <div className="p-4 max-w-md mx-auto space-y-4">
        <DemoDataNotice />

        {/* 1. User Identity Card */}
        {activeSubView === 'main' && (
          <>
            <div className="bg-white rounded-3xl p-5 border border-stone-200/70 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center shadow-xs">
                  {userAccount.name[0]}
                </div>
                <div>
                  <h2 className="font-extrabold text-sm text-stone-900">
                    {userAccount.name}
                  </h2>
                  <span className="text-xs text-stone-400 block">
                    {userAccount.isGuest ? 'Modo invitado' : userAccount.email}
                  </span>
                  <DataOriginBadge kind="demo" label="Cuenta simulada" className="mt-1" />
                </div>
              </div>

              {userAccount.isGuest ? (
                <button
                  onClick={() => loginSimulated('google')}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
                >
                  Entrar
                </button>
              ) : (
                <button
                  onClick={logoutSimulated}
                  className="w-8 h-8 rounded-xl bg-stone-100 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors"
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Goals Status Card */}
            <div 
              onClick={() => setActiveSubView('goals')}
              className="bg-gradient-to-br from-emerald-50/80 via-white to-stone-50 rounded-3xl p-5 border border-emerald-200/70 shadow-xs cursor-pointer hover:border-emerald-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xs text-stone-900">Mis objetivos</h3>
                    <span className="text-[11px] text-stone-500">
                      {userGoals.length} {userGoals.length === 1 ? 'objetivo activo' : 'objetivos activos'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {userGoals.map(g => {
                  const def = HEALTH_GOALS.find(item => item.id === g);
                  return (
                    <span key={g} className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-800">
                      ✓ {def?.label || g}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Navigation Menu Links */}
            <div className="bg-white rounded-3xl border border-stone-200/70 shadow-xs overflow-hidden divide-y divide-stone-100">
              <button
                onClick={() => setActiveSubView('favorites')}
                className="w-full p-4 flex items-center justify-between hover:bg-stone-50 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-stone-900 block">Mis favoritos</span>
                    <span className="text-[11px] text-stone-400">Listas personalizadas de compra</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-stone-400">{favorites.length}</span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </div>
              </button>

              <button
                onClick={() => setActiveSubView('history')}
                className="w-full p-4 flex items-center justify-between hover:bg-stone-50 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <History className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-stone-900 block">Historial de escaneos</span>
                    <span className="text-[11px] text-stone-400">Productos analizados cronológicamente</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-stone-400">{externalHistory.length}</span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </div>
              </button>

              <button
                onClick={() => setActiveSubView('diet')}
                className="w-full p-4 flex items-center justify-between hover:bg-stone-50 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-stone-900 block">Preferencias alimentarias</span>
                    <span className="text-[11px] text-stone-400">Sin gluten, lactosa, vegano...</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>

              <button
                onClick={openScoreModal}
                className="w-full p-4 flex items-center justify-between hover:bg-stone-50 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-stone-900 block">Cómo funciona nuestra valoración</span>
                    <span className="text-[11px] text-stone-400">Metodología en 4 dimensiones</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>

              <button
                onClick={resetOnboarding}
                className="w-full p-4 flex items-center justify-between hover:bg-stone-50 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-500 flex items-center justify-center">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-stone-900 block">Repetir bienvenida / Onboarding</span>
                    <span className="text-[11px] text-stone-400">Ver explicaciones iniciales</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>
            </div>

            {/* Transparency Note */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/50 text-[11px] text-stone-500 leading-relaxed">
              FoodLens es un proyecto independiente de análisis nutricional basado en ciencia de alimentos. No aceptamos publicidad de marcas de comida ni manipulamos valoraciones.
            </div>
          </>
        )}

        {/* 2. Goals Configuration Sub-view */}
        {activeSubView === 'goals' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-extrabold text-stone-900 mb-1">¿Qué quieres priorizar?</h2>
              <p className="text-xs text-stone-500 leading-relaxed">
                Elige hasta 3 objetivos principales para que FoodLens calcule tu nota personalizada de "Encaje contigo".
              </p>
            </div>

            <div className="space-y-2">
              {HEALTH_GOALS.map(goal => {
                const isActive = userGoals.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-emerald-50 border-emerald-300 shadow-xs'
                        : 'bg-white border-stone-200/70 hover:border-stone-300'
                    }`}
                  >
                    <div>
                      <span className={`font-bold text-xs block ${isActive ? 'text-emerald-950' : 'text-stone-900'}`}>
                        {goal.label}
                      </span>
                      <span className="text-[11px] text-stone-500 leading-tight block mt-0.5">
                        {goal.description}
                      </span>
                    </div>

                    <div className={`w-6 h-6 rounded-xl flex items-center justify-center shrink-0 ml-3 ${
                      isActive ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-400'
                    }`}>
                      {isActive && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                setGoals([]);
                showToast('Personalización desactivada');
              }}
              className="w-full py-2.5 text-xs text-stone-500 hover:text-stone-800 font-semibold text-center"
            >
              No quiero personalización
            </button>
          </div>
        )}

        {/* 3. Dietary Preferences Sub-view */}
        {activeSubView === 'diet' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-extrabold text-stone-900 mb-1">Preferencias e intolerancias</h2>
              <p className="text-xs text-stone-500 leading-relaxed">
                Selecciona las restricciones que deben destacarse al escanear productos.
              </p>
            </div>

            {/* Allergy disclaimer */}
            <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900 leading-relaxed font-medium">
                La información de la base de datos puede contener retrasos o errores. <strong>Comprueba siempre el etiquetado físico del fabricante</strong> en caso de alergias severas.
              </p>
            </div>

            <div className="space-y-2">
              {DIETARY_PREFERENCES.map(pref => {
                const isActive = dietaryPreferences.includes(pref.id as DietaryPreference);
                return (
                  <button
                    key={pref.id}
                    onClick={() => toggleDietaryPreference(pref.id as DietaryPreference)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-emerald-50 border-emerald-300'
                        : 'bg-white border-stone-200/70 hover:border-stone-300'
                    }`}
                  >
                    <span className={`font-bold text-xs ${isActive ? 'text-emerald-950' : 'text-stone-900'}`}>
                      {pref.label}
                    </span>

                    <div className={`w-6 h-6 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-400'
                    }`}>
                      {isActive && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. Favorites Sub-view */}
        {activeSubView === 'favorites' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-stone-900">Mis favoritos</h2>
                <span className="text-xs text-stone-500">{favorites.length} guardados</span>
              </div>
            </div>

            {favorites.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-stone-200/70">
                <Heart className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <p className="text-xs text-stone-500">Guarda los productos que compras habitualmente tocando el corazón.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {favorites.map(fav => {
                  const product = history.find(h => h.product.id === fav.productId)?.product ||
                    basket.find(b => b.product.id === fav.productId)?.product;
                  if (!product) return null;
                  return (
                    <div
                      key={fav.productId}
                      onClick={() => openProductById(product.id)}
                      className="bg-white rounded-2xl p-3 border border-stone-200/70 flex items-center justify-between cursor-pointer hover:border-emerald-300"
                    >
                      <div className="flex items-center gap-3">
                        <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-contain rounded-lg" />
                        <div>
                          <span className="font-bold text-xs text-stone-900 block">{product.name}</span>
                          <span className="text-[10px] text-stone-400">{product.brand}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 5. History Sub-view */}
        {activeSubView === 'history' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-stone-900">Historial de escaneos</h2>
                <span className="text-xs text-stone-500">{externalHistory.length} productos guardados en este dispositivo</span>
              </div>
              {externalHistory.length > 0 && (
                <button
                  onClick={clearExternalHistory}
                  className="text-[11px] font-bold text-red-600 hover:text-red-700"
                >
                  Borrar todo
                </button>
              )}
            </div>

            {externalHistory.length > 0 && (
              <label className="relative block">
                <Search className="absolute left-3.5 top-1/2 w-4 h-4 -translate-y-1/2 text-stone-400" />
                <input
                  value={historyQuery}
                  onChange={event => setHistoryQuery(event.target.value)}
                  placeholder="Buscar por producto, marca o código"
                  className="w-full rounded-2xl border border-stone-200 bg-white py-3 pl-10 pr-4 text-xs outline-none focus:border-emerald-400"
                />
              </label>
            )}

            {externalHistory.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-stone-200/70">
                <History className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <p className="text-xs text-stone-500">Aún no has escaneado ningún producto.</p>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-stone-200/70">
                <Search className="w-9 h-9 text-stone-300 mx-auto mb-2" />
                <p className="text-xs text-stone-500">No hay resultados para “{historyQuery}”.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {groupedHistory.map(group => (
                  <section key={group.id} className="space-y-2">
                    <h3 className="px-1 text-[11px] font-black uppercase tracking-wider text-stone-400">{group.label}</h3>
                    {group.items.map(item => (
                      <div
                        key={item.product.barcode}
                        className="bg-white rounded-2xl p-3 border border-stone-200/70 flex items-center gap-3 hover:border-emerald-300"
                      >
                        <button
                          onClick={() => openExternalProduct(item.product)}
                          className="flex min-w-0 flex-1 items-center gap-3 text-left"
                        >
                          <div className="w-11 h-11 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center shrink-0 overflow-hidden">
                            {item.product.imageUrl ? (
                              <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-contain" />
                            ) : (
                              <History className="w-4 h-4 text-stone-300" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-xs text-stone-900 block truncate">{item.product.name}</span>
                            <span className="text-[10px] text-stone-400 block truncate">
                              {item.product.brand || item.product.barcode} · {formatScanDate(item.scannedAt)}
                            </span>
                          </div>
                        </button>
                        <button
                          onClick={() => startExternalComparison(item.product)}
                          className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0"
                          aria-label={`Comparar ${item.product.name}`}
                          title="Comparar con otro producto"
                        >
                          <Scale className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeExternalHistory(item.product.barcode)}
                          className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0"
                          aria-label={`Eliminar ${item.product.name} del historial`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </section>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
