import React from 'react';
import { useFoodLens } from '../../context/FoodLensContext';
import { Home, Search, Scan, ShoppingBag, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, openScanner, basket } = useFoodLens();

  const totalBasketCount = basket.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav 
      aria-label="Navegación principal"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-stone-200/80 max-w-md mx-auto shadow-lg"
    >
      <div className="grid grid-cols-5 items-center h-16 px-1">
        {/* 1. Inicio */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'home' ? 'text-emerald-700' : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] font-bold tracking-tight mt-1">Inicio</span>
        </button>

        {/* 2. Explorar */}
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'explore' ? 'text-emerald-700' : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <Search className={`w-5 h-5 ${activeTab === 'explore' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] font-bold tracking-tight mt-1">Explorar</span>
        </button>

        {/* 3. Central Prominent Scanner Button */}
        <div className="relative flex justify-center items-center">
          <button
            onClick={openScanner}
            className="absolute -top-6 w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/35 border-4 border-stone-100 active:scale-95 transition-transform hover:bg-emerald-700"
            aria-label="Escanear producto"
          >
            <Scan className="w-6 h-6 stroke-[2.2]" />
          </button>
          <span className="text-[10px] font-bold tracking-tight text-emerald-800 mt-7 block">
            Escanear
          </span>
        </div>

        {/* 4. Mi Cesta */}
        <button
          onClick={() => setActiveTab('basket')}
          className={`flex flex-col items-center justify-center min-h-[44px] relative transition-colors ${
            activeTab === 'basket' ? 'text-emerald-700' : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 ${activeTab === 'basket' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {totalBasketCount > 0 && (
              <span className="absolute -top-1 -right-2.5 w-4 h-4 rounded-full bg-emerald-600 text-white font-black text-[9px] flex items-center justify-center shadow-xs">
                {totalBasketCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight mt-1">Mi cesta</span>
        </button>

        {/* 5. Perfil */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'profile' ? 'text-emerald-700' : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] font-bold tracking-tight mt-1">Perfil</span>
        </button>
      </div>
    </nav>
  );
};
