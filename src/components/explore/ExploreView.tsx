import React, { useState, useMemo } from 'react';
import { useFoodLens } from '../../context/FoodLensContext';
import { MOCK_PRODUCTS } from '../../data/mockProducts';
import { ScoreBadge, NutriScoreBadge, NovaBadge } from '../ui/ScoreBadges';
import { DemoDataNotice } from '../ui/DataOrigin';
import { 
  Search, 
  Filter, 
  X, 
  ArrowUpDown, 
  ChevronRight, 
  SlidersHorizontal,
  Sparkles,
  Check
} from 'lucide-react';

const CATEGORIES = [
  'Todos',
  'Cereales',
  'Lácteos',
  'Panes',
  'Snacks',
  'Bebidas',
  'Aceites',
  'Platos preparados'
];

type SortOption = 'relevance' | 'score' | 'low_sugar' | 'high_protein' | 'low_processing';

export const ExploreView: React.FC = () => {
  const { openProductById, addToCompare } = useFoodLens();
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [filterNova1, setFilterNova1] = useState<boolean>(false);
  const [filterLowSugar, setFilterLowSugar] = useState<boolean>(false);
  const [filterHighFiber, setFilterHighFiber] = useState<boolean>(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    let list = [...MOCK_PRODUCTS];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.barcode.includes(q)
      );
    }

    if (selectedCategory !== 'Todos') {
      list = list.filter(p => p.category.toLowerCase().includes(selectedCategory.toLowerCase()));
    }

    if (filterNova1) {
      list = list.filter(p => p.dimensions.processing.nova <= 2);
    }

    if (filterLowSugar) {
      list = list.filter(p => p.serving.per100g.sugars <= 5);
    }

    if (filterHighFiber) {
      list = list.filter(p => p.serving.per100g.fiber >= 6);
    }

    // Sorting
    if (sortBy === 'score') {
      list.sort((a, b) => b.score - a.score);
    } else if (sortBy === 'low_sugar') {
      list.sort((a, b) => a.serving.per100g.sugars - b.serving.per100g.sugars);
    } else if (sortBy === 'high_protein') {
      list.sort((a, b) => b.serving.per100g.protein - a.serving.per100g.protein);
    } else if (sortBy === 'low_processing') {
      list.sort((a, b) => a.dimensions.processing.nova - b.dimensions.processing.nova);
    }

    return list;
  }, [searchTerm, selectedCategory, sortBy, filterNova1, filterLowSugar, filterHighFiber]);

  const activeFiltersCount = (filterNova1 ? 1 : 0) + (filterLowSugar ? 1 : 0) + (filterHighFiber ? 1 : 0);

  return (
    <div className="min-h-full bg-stone-100 pb-28 text-stone-900">
      {/* Top sticky search bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200/80 px-4 pt-4 pb-3 space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar producto, marca o categoría..."
              className="w-full pl-9 pr-8 py-2.5 rounded-2xl bg-stone-100 text-stone-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-stone-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="w-5 h-5 text-stone-400 hover:text-stone-600 absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilterDrawer(true)}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors relative ${
              activeFiltersCount > 0 ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
            aria-label="Abrir filtros"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-stone-900 text-white text-[9px] font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Horizontal Category Chips */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <div className="px-4 pt-4 max-w-md mx-auto">
        <DemoDataNotice />
      </div>

      {/* Product List Content */}
      <div className="p-4 max-w-md mx-auto space-y-3">
        {/* Count and sorting dropdown */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-stone-500 font-medium">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'alimento' : 'alimentos'} encontrados
          </span>

          <div className="flex items-center gap-1">
            <span className="text-[11px] text-stone-400">Ordenar:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-xs font-bold text-stone-700 focus:outline-none cursor-pointer"
            >
              <option value="relevance">Relevantes</option>
              <option value="score">Mejor valorados</option>
              <option value="low_sugar">Menos azúcar</option>
              <option value="high_protein">Más proteína</option>
              <option value="low_processing">Menos procesados</option>
            </select>
          </div>
        </div>

        {/* Empty state */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-stone-200/70">
            <p className="text-xs text-stone-500 mb-3">
              No encontramos alimentos que coincidan con tu búsqueda.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Todos');
                setFilterNova1(false);
                setFilterLowSugar(false);
                setFilterHighFiber(false);
              }}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          /* Cards */
          filteredProducts.map(p => (
            <div
              key={p.id}
              onClick={() => openProductById(p.id)}
              className="bg-white rounded-3xl p-3.5 border border-stone-200/70 shadow-xs flex items-center justify-between gap-3 hover:border-emerald-300 transition-colors cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-16 h-16 rounded-2xl bg-stone-50 border border-stone-200/50 p-1 flex items-center justify-center shrink-0">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>

                <div className="min-w-0">
                  <span className="text-[10px] text-stone-400 font-medium block truncate">
                    {p.brand} · {p.quantity}
                  </span>
                  <h3 className="font-bold text-xs text-stone-900 truncate">
                    {p.name}
                  </h3>

                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <ScoreBadge score={p.score} size="sm" />
                    <NovaBadge nova={p.dimensions.processing.nova} size="sm" />
                  </div>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
            </div>
          ))
        )}
      </div>

      {/* Filter Drawer Bottom Sheet */}
      {showFilterDrawer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center p-0 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-t-3xl p-6 shadow-2xl">
            <div className="w-10 h-1.5 bg-stone-300 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between mb-5">
              <h3 className="font-extrabold text-base text-stone-900">Filtros de análisis</h3>
              <button
                onClick={() => {
                  setFilterNova1(false);
                  setFilterLowSugar(false);
                  setFilterHighFiber(false);
                }}
                className="text-xs text-stone-400 hover:text-stone-700"
              >
                Limpiar
              </button>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200/60 cursor-pointer">
                <div>
                  <span className="font-bold text-xs text-stone-900 block">Poco procesados</span>
                  <span className="text-[11px] text-stone-500">Solo alimentos clasificados NOVA 1 o 2</span>
                </div>
                <input
                  type="checkbox"
                  checked={filterNova1}
                  onChange={e => setFilterNova1(e.target.checked)}
                  className="w-5 h-5 accent-emerald-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200/60 cursor-pointer">
                <div>
                  <span className="font-bold text-xs text-stone-900 block">Menos azúcar</span>
                  <span className="text-[11px] text-stone-500">Máximo 5 g de azúcar / 100 g</span>
                </div>
                <input
                  type="checkbox"
                  checked={filterLowSugar}
                  onChange={e => setFilterLowSugar(e.target.checked)}
                  className="w-5 h-5 accent-emerald-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200/60 cursor-pointer">
                <div>
                  <span className="font-bold text-xs text-stone-900 block">Alto en fibra</span>
                  <span className="text-[11px] text-stone-500">Mínimo 6 g de fibra / 100 g</span>
                </div>
                <input
                  type="checkbox"
                  checked={filterHighFiber}
                  onChange={e => setFilterHighFiber(e.target.checked)}
                  className="w-5 h-5 accent-emerald-600 rounded"
                />
              </label>
            </div>

            <button
              onClick={() => setShowFilterDrawer(false)}
              className="w-full h-12 mt-6 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-sm hover:bg-emerald-700 transition-colors"
            >
              Aplicar filtros ({filteredProducts.length} productos)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
