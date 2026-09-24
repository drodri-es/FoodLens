import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  HealthGoal, 
  DietaryPreference, 
  BasketItem, 
  FavoriteItem, 
  HistoryItem 
} from '../types/foodlens';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { productRepository } from '../data/products/ProductRepository';
import { ExternalFavoriteItem, ExternalHistoryItem, FoodLensProduct } from '../domain/product/FoodLensProduct';
import { loadAppState, saveAppState } from '../data/persistence/appStateStorage';

interface FoodLensContextType {
  activeTab: 'home' | 'explore' | 'scan' | 'basket' | 'profile';
  setActiveTab: (tab: 'home' | 'explore' | 'scan' | 'basket' | 'profile') => void;
  currentProduct: Product | null;
  currentExternalProduct: FoodLensProduct | null;
  setCurrentProduct: (product: Product | null) => void;
  closeProductDetail: () => void;
  openProductById: (id: string) => void;
  
  // Scanner
  isScannerOpen: boolean;
  openScanner: () => void;
  closeScanner: () => void;
  scanBarcode: (code: string) => Promise<{
    found: boolean;
    product?: Product;
    externalProduct?: FoodLensProduct;
    reason?: 'not-found' | 'invalid-code' | 'unavailable';
    message?: string;
  }>;
  
  // History
  history: HistoryItem[];
  externalHistory: ExternalHistoryItem[];
  externalFavorites: ExternalFavoriteItem[];
  openExternalProduct: (product: FoodLensProduct) => void;
  toggleExternalFavorite: (product: FoodLensProduct) => void;
  isExternalFavorite: (barcode: string) => boolean;
  addToHistory: (product: Product) => void;
  removeFromHistory: (productId: string) => void;
  clearHistory: () => void;
  
  // Favorites
  favorites: FavoriteItem[];
  toggleFavorite: (productId: string, listId?: string) => void;
  isFavorite: (productId: string) => boolean;
  favoriteLists: Array<{ id: string; name: string }>;
  addFavoriteList: (name: string) => void;
  
  // Basket
  basket: BasketItem[];
  addToBasket: (product: Product, quantity?: number) => void;
  removeFromBasket: (productId: string) => void;
  updateBasketQuantity: (productId: string, qty: number) => void;
  swapBasketProduct: (oldProductId: string, newProduct: Product) => void;
  clearBasket: () => void;
  
  // Comparison
  comparisonProductIds: string[];
  addToCompare: (productId: string) => boolean;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isComparingOpen: boolean;
  openCompareModal: () => void;
  closeCompareModal: () => void;
  externalComparisonProducts: FoodLensProduct[];
  startExternalComparison: (product: FoodLensProduct) => void;
  clearExternalComparison: () => void;
  
  // User Goals & Preferences
  userGoals: HealthGoal[];
  toggleGoal: (goal: HealthGoal) => void;
  setGoals: (goals: HealthGoal[]) => void;
  dietaryPreferences: DietaryPreference[];
  toggleDietaryPreference: (pref: DietaryPreference) => void;
  
  // User Account
  userAccount: { name: string; email: string; isGuest: boolean; avatar?: string };
  loginSimulated: (provider: 'apple' | 'google' | 'email', email?: string) => void;
  logoutSimulated: () => void;
  
  // Onboarding
  onboardingCompleted: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  
  // Toast notifications
  toast: { message: string; type?: 'info' | 'success' | 'warning' } | null;
  showToast: (message: string, type?: 'info' | 'success' | 'warning') => void;
  
  // Device Frame View Mode
  viewMode: 'mobile-frame' | 'fluid';
  toggleViewMode: () => void;
  
  // Assistant
  isAssistantOpen: boolean;
  openAssistant: () => void;
  closeAssistant: () => void;
  
  // Score details modal
  isScoreModalOpen: boolean;
  openScoreModal: () => void;
  closeScoreModal: () => void;

  // Report error modal
  isReportModalOpen: boolean;
  openReportModal: () => void;
  closeReportModal: () => void;
}

const FoodLensContext = createContext<FoodLensContextType | undefined>(undefined);

export const FoodLensProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [persistedState] = useState(() => loadAppState(undefined, MOCK_PRODUCTS));
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'scan' | 'basket' | 'profile'>('home');
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [currentExternalProduct, setCurrentExternalProduct] = useState<FoodLensProduct | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isComparingOpen, setIsComparingOpen] = useState<boolean>(false);
  const [externalComparisonProducts, setExternalComparisonProducts] = useState<FoodLensProduct[]>([]);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'mobile-frame' | 'fluid'>('mobile-frame');

  const [history, setHistory] = useState<HistoryItem[]>(persistedState.history ?? []);
  const [externalHistory, setExternalHistory] = useState<ExternalHistoryItem[]>(persistedState.externalHistory ?? []);
  const [externalFavorites, setExternalFavorites] = useState<ExternalFavoriteItem[]>(persistedState.externalFavorites ?? []);

  const [favorites, setFavorites] = useState<FavoriteItem[]>(persistedState.favorites ?? []);

  const [favoriteLists, setFavoriteLists] = useState<Array<{ id: string; name: string }>>(persistedState.favoriteLists ?? [
    { id: 'habituales', name: 'Habituales' },
    { id: 'desayuno', name: 'Desayuno' },
    { id: 'ninos', name: 'Niños' },
    { id: 'deporte', name: 'Deporte' },
    { id: 'semanal', name: 'Compra semanal' },
  ]);

  const [basket, setBasket] = useState<BasketItem[]>(persistedState.basket ?? []);

  const [userGoals, setUserGoals] = useState<HealthGoal[]>(persistedState.userGoals ?? []);

  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreference[]>(persistedState.dietaryPreferences ?? []);

  const [comparisonProductIds, setComparisonProductIds] = useState<string[]>(persistedState.comparisonProductIds ?? []);

  const [userAccount, setUserAccount] = useState<{
    name: string;
    email: string;
    isGuest: boolean;
    avatar?: string;
  }>(persistedState.userAccount ?? {
    name: 'Usuario Invitado',
    email: '',
    isGuest: true,
  });

  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('foodlens_onboarding') === 'true';
    } catch {
      return false;
    }
  });

  const [toast, setToast] = useState<{ message: string; type?: 'info' | 'success' | 'warning' } | null>(null);

  useEffect(() => {
    saveAppState({
      history,
      externalHistory,
      externalFavorites,
      favorites,
      favoriteLists,
      basket,
      comparisonProductIds,
      userGoals,
      dietaryPreferences,
      userAccount,
    });
  }, [
    history,
    externalHistory,
    externalFavorites,
    favorites,
    favoriteLists,
    basket,
    comparisonProductIds,
    userGoals,
    dietaryPreferences,
    userAccount,
  ]);

  const showToast = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 2800);
  };

  const completeOnboarding = () => {
    setOnboardingCompleted(true);
    try {
      localStorage.setItem('foodlens_onboarding', 'true');
    } catch {
      // safe fallback
    }
  };

  const resetOnboarding = () => {
    setOnboardingCompleted(false);
    try {
      localStorage.removeItem('foodlens_onboarding');
    } catch {
      // safe fallback
    }
    showToast('Onboarding reiniciado', 'info');
  };

  const openProductById = (id: string) => {
    const p = MOCK_PRODUCTS.find(item => item.id === id);
    if (p) {
      setCurrentExternalProduct(null);
      setCurrentProduct(p);
      addToHistory(p);
    }
  };

  const openExternalProduct = (product: FoodLensProduct) => {
    setCurrentProduct(null);
    setCurrentExternalProduct(product);
  };

  const isExternalFavorite = (barcode: string) =>
    externalFavorites.some(item => item.product.barcode === barcode);

  const toggleExternalFavorite = (product: FoodLensProduct) => {
    const wasFavorite = isExternalFavorite(product.barcode);
    setExternalFavorites(previous => {
      const exists = previous.some(item => item.product.barcode === product.barcode);
      if (exists) return previous.filter(item => item.product.barcode !== product.barcode);
      return [{ product, addedAt: 'Ahora mismo' }, ...previous].slice(0, 100);
    });
    showToast(wasFavorite ? 'Eliminado de favoritos' : 'Guardado en favoritos', 'success');
  };

  const openScanner = () => setIsScannerOpen(true);
  const closeScanner = () => setIsScannerOpen(false);

  const scanBarcode = async (code: string) => {
    const trimmed = code.trim();
    const found = import.meta.env.DEV
      ? MOCK_PRODUCTS.find(p => p.barcode === trimmed || p.id.includes(trimmed.toLowerCase()))
      : undefined;
    if (found) {
      setCurrentExternalProduct(null);
      setCurrentProduct(found);
      addToHistory(found);
      closeScanner();
      return { found: true, product: found };
    }

    const result = await productRepository.findByBarcode(trimmed);
    if (result.status === 'found') {
      if (externalComparisonProducts.length === 1) {
        const first = externalComparisonProducts[0];
        if (first.barcode === result.product.barcode) {
          return {
            found: false,
            reason: 'invalid-code' as const,
            message: 'Escanea un producto diferente para completar la comparación.',
          };
        }
        setExternalComparisonProducts([first, result.product]);
        closeScanner();
        setIsComparingOpen(true);
        return { found: true, externalProduct: result.product };
      }
      setCurrentProduct(null);
      setCurrentExternalProduct(result.product);
      setExternalHistory(previous => [
        { product: result.product, scannedAt: 'Ahora mismo' },
        ...previous.filter(item => item.product.barcode !== result.product.barcode),
      ].slice(0, 50));
      closeScanner();
      return { found: true, externalProduct: result.product };
    }

    return {
      found: false,
      reason: result.status,
      message: result.status === 'unavailable' ? result.message : undefined,
    };
  };

  const addToHistory = (product: Product) => {
    setHistory(prev => {
      const filtered = prev.filter(item => item.product.id !== product.id);
      return [{ product, scannedAt: 'Ahora mismo' }, ...filtered];
    });
  };

  const removeFromHistory = (productId: string) => {
    setHistory(prev => prev.filter(item => item.product.id !== productId));
    showToast('Producto eliminado del historial');
  };

  const clearHistory = () => {
    setHistory([]);
    showToast('Historial vaciado');
  };

  const toggleFavorite = (productId: string, listId = 'habituales') => {
    setFavorites(prev => {
      const exists = prev.some(item => item.productId === productId);
      if (exists) {
        showToast('Eliminado de favoritos');
        return prev.filter(item => item.productId !== productId);
      } else {
        showToast('Guardado en favoritos', 'success');
        return [...prev, { productId, listId, addedAt: 'Hoy' }];
      }
    });
  };

  const isFavorite = (productId: string) => {
    return favorites.some(item => item.productId === productId);
  };

  const addFavoriteList = (name: string) => {
    const id = name.toLowerCase().replace(/\s+/g, '-');
    if (!favoriteLists.some(l => l.id === id)) {
      setFavoriteLists(prev => [...prev, { id, name }]);
      showToast(`Lista "${name}" creada`, 'success');
    }
  };

  const addToBasket = (product: Product, quantity = 1) => {
    setBasket(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity, addedAt: 'Hoy' }];
    });
    showToast(`"${product.name}" añadido a tu cesta`, 'success');
  };

  const removeFromBasket = (productId: string) => {
    setBasket(prev => prev.filter(item => item.product.id !== productId));
    showToast('Producto quitado de la cesta');
  };

  const updateBasketQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromBasket(productId);
      return;
    }
    setBasket(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const swapBasketProduct = (oldProductId: string, newProduct: Product) => {
    setBasket(prev => {
      const oldItem = prev.find(item => item.product.id === oldProductId);
      const qty = oldItem ? oldItem.quantity : 1;
      const filtered = prev.filter(item => item.product.id !== oldProductId);
      return [...filtered, { product: newProduct, quantity: qty, addedAt: 'Hoy (mejorado)' }];
    });
    showToast(`Cambiado con éxito por ${newProduct.name}`, 'success');
  };

  const clearBasket = () => {
    setBasket([]);
    showToast('Cesta vaciada');
  };

  const addToCompare = (productId: string): boolean => {
    if (comparisonProductIds.includes(productId)) {
      showToast('Ya está en la lista de comparación');
      return true;
    }
    if (comparisonProductIds.length >= 3) {
      showToast('Máximo 3 productos simultáneos para comparar');
      return false;
    }
    setComparisonProductIds(prev => [...prev, productId]);
    showToast('Añadido a la comparativa', 'success');
    return true;
  };

  const removeFromCompare = (productId: string) => {
    setComparisonProductIds(prev => prev.filter(id => id !== productId));
  };

  const clearCompare = () => {
    setComparisonProductIds([]);
  };

  const openCompareModal = () => setIsComparingOpen(true);
  const closeCompareModal = () => setIsComparingOpen(false);

  const startExternalComparison = (product: FoodLensProduct) => {
    setExternalComparisonProducts([product]);
    setCurrentExternalProduct(null);
    setIsScannerOpen(true);
    showToast('Escanea ahora el segundo producto', 'info');
  };

  const clearExternalComparison = () => {
    setExternalComparisonProducts([]);
    setIsComparingOpen(false);
  };

  const toggleGoal = (goal: HealthGoal) => {
    setUserGoals(prev => {
      if (prev.includes(goal)) {
        return prev.filter(g => g !== goal);
      }
      if (prev.length >= 3) {
        showToast('Se recomienda un máximo de 3 objetivos prioritarios');
      }
      return [...prev, goal];
    });
  };

  const setGoals = (goals: HealthGoal[]) => {
    setUserGoals(goals);
  };

  const toggleDietaryPreference = (pref: DietaryPreference) => {
    setDietaryPreferences(prev =>
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  const loginSimulated = (provider: 'apple' | 'google' | 'email', email?: string) => {
    setUserAccount({
      name: email ? email.split('@')[0] : 'David Rodríguez',
      email: email || 'drodri@gmail.com',
      isGuest: false,
    });
    showToast(`Sesión iniciada con ${provider}`, 'success');
  };

  const logoutSimulated = () => {
    setUserAccount({
      name: 'Usuario Invitado',
      email: '',
      isGuest: true
    });
    showToast('Modo invitado activado');
  };

  const toggleViewMode = () => {
    setViewMode(prev => (prev === 'mobile-frame' ? 'fluid' : 'mobile-frame'));
  };

  const openAssistant = () => setIsAssistantOpen(true);
  const closeAssistant = () => setIsAssistantOpen(false);

  const openScoreModal = () => setIsScoreModalOpen(true);
  const closeScoreModal = () => setIsScoreModalOpen(false);

  const openReportModal = () => setIsReportModalOpen(true);
  const closeReportModal = () => setIsReportModalOpen(false);

  const closeProductDetail = () => {
    setCurrentProduct(null);
    setCurrentExternalProduct(null);
  };

  return (
    <FoodLensContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentProduct,
        currentExternalProduct,
        setCurrentProduct,
        closeProductDetail,
        openProductById,
        isScannerOpen,
        openScanner,
        closeScanner,
        scanBarcode,
        history,
        externalHistory,
        externalFavorites,
        openExternalProduct,
        toggleExternalFavorite,
        isExternalFavorite,
        addToHistory,
        removeFromHistory,
        clearHistory,
        favorites,
        toggleFavorite,
        isFavorite,
        favoriteLists,
        addFavoriteList,
        basket,
        addToBasket,
        removeFromBasket,
        updateBasketQuantity,
        swapBasketProduct,
        clearBasket,
        comparisonProductIds,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isComparingOpen,
        openCompareModal,
        closeCompareModal,
        externalComparisonProducts,
        startExternalComparison,
        clearExternalComparison,
        userGoals,
        toggleGoal,
        setGoals,
        dietaryPreferences,
        toggleDietaryPreference,
        userAccount,
        loginSimulated,
        logoutSimulated,
        onboardingCompleted,
        completeOnboarding,
        resetOnboarding,
        toast,
        showToast,
        viewMode,
        toggleViewMode,
        isAssistantOpen,
        openAssistant,
        closeAssistant,
        isScoreModalOpen,
        openScoreModal,
        closeScoreModal,
        isReportModalOpen,
        openReportModal,
        closeReportModal,
      }}
    >
      {children}
    </FoodLensContext.Provider>
  );
};

export const useFoodLens = () => {
  const context = useContext(FoodLensContext);
  if (!context) {
    throw new Error('useFoodLens must be used within a FoodLensProvider');
  }
  return context;
};
