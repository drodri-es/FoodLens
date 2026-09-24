import React from 'react';
import { useFoodLens } from '../../context/FoodLensContext';
import { BottomNav } from './BottomNav';
import { HomeView } from '../home/HomeView';
import { ExploreView } from '../explore/ExploreView';
import { BasketView } from '../basket/BasketView';
import { ProfileView } from '../profile/ProfileView';
import { ProductDetailView } from '../product/ProductDetailView';
import { ScannerView } from '../scanner/ScannerView';
import { ComparisonView } from '../comparison/ComparisonView';
import { OnboardingModal } from '../onboarding/OnboardingModal';
import { ScoreMethodologyModal } from '../modals/ScoreMethodologyModal';
import { ReportErrorModal } from '../modals/ReportErrorModal';
import { FoodLensAssistantModal } from '../assistant/FoodLensAssistantModal';
import { ExternalProductView } from '../product/ExternalProductView';
import { CheckCircle, Info, AlertTriangle } from 'lucide-react';

export const MobileShell: React.FC = () => {
  const { 
    activeTab, 
    currentProduct, 
    currentExternalProduct,
    closeProductDetail, 
    toggleExternalFavorite,
    isExternalFavorite,
    toast 
  } = useFoodLens();

  return (
    <div className="min-h-screen bg-stone-200/60 flex items-center justify-center font-sans antialiased selection:bg-emerald-500 selection:text-white sm:py-6 sm:px-4">
      {/* Mobile container device wrapper */}
      <main className="w-full max-w-md bg-stone-100 min-h-screen sm:min-h-[844px] sm:max-h-[920px] sm:rounded-[40px] sm:shadow-2xl overflow-hidden relative flex flex-col border border-stone-300/40">
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative">
          {currentExternalProduct ? (
            <ExternalProductView
              product={currentExternalProduct}
              onBack={closeProductDetail}
              isFavorite={isExternalFavorite(currentExternalProduct.barcode)}
              onToggleFavorite={() => toggleExternalFavorite(currentExternalProduct)}
            />
          ) : currentProduct ? (
            <ProductDetailView 
              product={currentProduct} 
              onBack={closeProductDetail} 
            />
          ) : (
            <>
              {activeTab === 'home' && <HomeView />}
              {activeTab === 'explore' && <ExploreView />}
              {activeTab === 'basket' && <BasketView />}
              {activeTab === 'profile' && <ProfileView />}
            </>
          )}
        </div>

        {/* Persistent Bottom Nav (shown unless product detail is open) */}
        {!currentProduct && !currentExternalProduct && <BottomNav />}

        {/* Global Floating Toast */}
        {toast && (
          <aside
            aria-live="polite"
            className="fixed sm:absolute bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-stone-900/90 backdrop-blur-md text-white text-xs font-semibold shadow-xl flex items-center gap-2 max-w-[90%] border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none"
          >
            {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
            <span className="truncate">{toast.message}</span>
          </aside>
        )}

        {/* Global Modals & Overlays */}
        <ScannerView />
        <ComparisonView />
        <OnboardingModal />
        <ScoreMethodologyModal />
        <ReportErrorModal />
        <FoodLensAssistantModal />
      </main>
    </div>
  );
};
