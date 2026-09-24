export interface FoodLensNutrition {
  energyKcal?: number;
  fat?: number;
  saturatedFat?: number;
  carbohydrates?: number;
  sugars?: number;
  fiber?: number;
  protein?: number;
  salt?: number;
}

export interface FoodLensProductSource {
  provider: 'Open Food Facts';
  updatedAt?: string;
  fetchedAt: string;
}

export interface FoodLensSourceAssessment {
  id: 'nutrition' | 'processing' | 'additives';
  score: number;
  title?: string;
}

export interface FoodLensProduct {
  barcode: string;
  name: string;
  brand?: string;
  quantity?: string;
  categories: string[];
  imageUrl?: string;
  nutrition: FoodLensNutrition;
  ingredientsText?: string;
  additives: string[];
  allergens: string[];
  nova?: 1 | 2 | 3 | 4;
  nutriScore?: 'a' | 'b' | 'c' | 'd' | 'e';
  sourceAssessments: FoodLensSourceAssessment[];
  completeness: number;
  missingFields: string[];
  source: FoodLensProductSource;
}

export interface ExternalHistoryItem {
  product: FoodLensProduct;
  scannedAt: string;
}

export interface ExternalFavoriteItem {
  product: FoodLensProduct;
  addedAt: string;
}

export type ProductLookupResult =
  | { status: 'found'; product: FoodLensProduct; fromCache: boolean }
  | { status: 'not-found'; barcode: string }
  | { status: 'invalid-code'; input: string }
  | { status: 'unavailable'; barcode: string; message: string };
