import {
  BasketItem,
  DietaryPreference,
  FavoriteItem,
  HealthGoal,
  HistoryItem,
  Product,
} from '../../types/foodlens';
import { ExternalFavoriteItem, ExternalHistoryItem, FoodLensProduct } from '../../domain/product/FoodLensProduct';

const STORAGE_KEY = 'foodlens:app-state';
const STORAGE_VERSION = 1;

export interface PersistedUserAccount {
  name: string;
  email: string;
  isGuest: boolean;
  avatar?: string;
}

interface PersistedAppStateV1 {
  version: 1;
  history: Array<{ productId: string; scannedAt: string }>;
  externalHistory?: ExternalHistoryItem[];
  externalFavorites?: ExternalFavoriteItem[];
  favorites: FavoriteItem[];
  favoriteLists: Array<{ id: string; name: string }>;
  basket: Array<{ productId: string; quantity: number; addedAt: string }>;
  comparisonProductIds: string[];
  userGoals: HealthGoal[];
  dietaryPreferences: DietaryPreference[];
  userAccount: PersistedUserAccount;
}

export interface AppStateSnapshot {
  history: HistoryItem[];
  externalHistory: ExternalHistoryItem[];
  externalFavorites: ExternalFavoriteItem[];
  favorites: FavoriteItem[];
  favoriteLists: Array<{ id: string; name: string }>;
  basket: BasketItem[];
  comparisonProductIds: string[];
  userGoals: HealthGoal[];
  dietaryPreferences: DietaryPreference[];
  userAccount: PersistedUserAccount;
}

export function getBrowserStorage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isExternalProductItem = (item: unknown): boolean => {
  if (!isRecord(item) || !isRecord(item.product)) return false;
  const product = item.product as unknown as FoodLensProduct;
  return typeof product.barcode === 'string'
    && typeof product.name === 'string'
    && product.source?.provider === 'Open Food Facts';
};

export function loadAppState(
  storage: Storage | null = getBrowserStorage(),
  products: Product[] = [],
): Partial<AppStateSnapshot> {
  if (!storage) return {};

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== STORAGE_VERSION) return {};

    const state = parsed as unknown as PersistedAppStateV1;
    const productsById = new Map(products.map(product => [product.id, product]));

    return {
      history: Array.isArray(state.history)
        ? state.history.flatMap(item => {
            const product = isRecord(item) && typeof item.productId === 'string'
              ? productsById.get(item.productId)
              : undefined;
            return product
              ? [{ product, scannedAt: typeof item.scannedAt === 'string' ? item.scannedAt : 'Anteriormente' }]
              : [];
          })
        : undefined,
      externalHistory: Array.isArray(state.externalHistory)
        ? state.externalHistory.filter(isExternalProductItem) as ExternalHistoryItem[]
        : undefined,
      externalFavorites: Array.isArray(state.externalFavorites)
        ? state.externalFavorites.filter(isExternalProductItem) as ExternalFavoriteItem[]
        : undefined,
      favorites: Array.isArray(state.favorites)
        ? state.favorites.filter(item => isRecord(item) && typeof item.productId === 'string') as FavoriteItem[]
        : undefined,
      favoriteLists: Array.isArray(state.favoriteLists)
        ? state.favoriteLists.filter(item => isRecord(item) && typeof item.id === 'string' && typeof item.name === 'string') as Array<{ id: string; name: string }>
        : undefined,
      basket: Array.isArray(state.basket)
        ? state.basket.flatMap(item => {
            const product = isRecord(item) && typeof item.productId === 'string'
              ? productsById.get(item.productId)
              : undefined;
            return product && typeof item.quantity === 'number' && item.quantity > 0
              ? [{ product, quantity: item.quantity, addedAt: typeof item.addedAt === 'string' ? item.addedAt : 'Anteriormente' }]
              : [];
          })
        : undefined,
      comparisonProductIds: Array.isArray(state.comparisonProductIds)
        ? state.comparisonProductIds.filter(id => typeof id === 'string' && productsById.has(id))
        : undefined,
      userGoals: Array.isArray(state.userGoals) ? state.userGoals as HealthGoal[] : undefined,
      dietaryPreferences: Array.isArray(state.dietaryPreferences)
        ? state.dietaryPreferences as DietaryPreference[]
        : undefined,
      userAccount: isRecord(state.userAccount)
        && typeof state.userAccount.name === 'string'
        && typeof state.userAccount.email === 'string'
        && typeof state.userAccount.isGuest === 'boolean'
        ? state.userAccount as PersistedUserAccount
        : undefined,
    };
  } catch {
    return {};
  }
}

export function saveAppState(
  snapshot: AppStateSnapshot,
  storage: Storage | null = getBrowserStorage(),
): boolean {
  if (!storage) return false;

  const persisted: PersistedAppStateV1 = {
    version: STORAGE_VERSION,
    history: snapshot.history.map(item => ({
      productId: item.product.id,
      scannedAt: item.scannedAt,
    })),
    externalHistory: snapshot.externalHistory,
    externalFavorites: snapshot.externalFavorites,
    favorites: snapshot.favorites,
    favoriteLists: snapshot.favoriteLists,
    basket: snapshot.basket.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
      addedAt: item.addedAt,
    })),
    comparisonProductIds: snapshot.comparisonProductIds,
    userGoals: snapshot.userGoals,
    dietaryPreferences: snapshot.dietaryPreferences,
    userAccount: snapshot.userAccount,
  };

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    return true;
  } catch {
    return false;
  }
}
