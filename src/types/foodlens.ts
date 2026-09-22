export type ScoreCategory = 'Excelente' | 'Buena opción' | 'Mejorable' | 'Ocasional';

export type NovaLevel = 1 | 2 | 3 | 4;

export type NutriScoreGrade = 'A' | 'B' | 'C' | 'D' | 'E';

export interface NutritionalValues {
  calories: number; // kcal
  fat: number; // g
  satFat: number; // g
  carbs: number; // g
  sugars: number; // g
  fiber: number; // g
  protein: number; // g
  salt: number; // g
}

export interface HighlightedIngredient {
  name: string;
  type: 'sugar' | 'sweetener' | 'palm' | 'refined_oil' | 'additive' | 'allergen' | 'neutral';
  note?: string;
}

export interface AdditiveItem {
  code: string; // e.g. E322, E250
  name: string;
  function: string;
  status: string; // e.g. "Autorizado en la UE"
  assessment: string; // e.g. "Sin preocupación relevante"
  riskLevel: 'safe' | 'moderate' | 'caution';
  evidenceNote: string;
  concentrationKnown: boolean;
}

export interface CategoryComparison {
  categoryName: string;
  percentile: number; // e.g. 68 (better than 68%)
  averages: {
    sugars: number;
    fiber: number;
    protein: number;
    salt: number;
  };
  sugarDiffPercent: number; // e.g. -42
  fiberDiffPercent: number; // e.g. +55
  proteinDiffPercent: number; // e.g. +22
  saltDiffPercent: number; // e.g. -40
}

export interface ProductAlternative {
  productId: string;
  name: string;
  brand: string;
  score: number;
  scoreLabel: ScoreCategory;
  reason: string;
  keyDifference: string;
  imageUrl: string;
}

export interface Product {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  quantity: string;
  category: string;
  imageUrl: string;
  score: number; // 0 to 100
  scoreLabel: ScoreCategory;
  scoreSummary: string;
  dimensions: {
    nutrition: {
      score: number;
      label: string;
      summary: string;
    };
    ingredients: {
      score: number;
      label: string;
      summary: string;
    };
    processing: {
      score: number;
      label: string;
      summary: string;
      nova: NovaLevel;
    };
    additives: {
      score: number;
      label: string;
      summary: string;
      count: number;
    };
  };
  pros: string[];
  cons: string[];
  serving: {
    standardUnit: string;
    defaultServing: number;
    servingUnit: string;
    per100g: NutritionalValues;
    nutriScore: NutriScoreGrade;
  };
  ingredientsList: {
    rawText: string;
    highlighted: HighlightedIngredient[];
    summary: string;
  };
  additivesList: AdditiveItem[];
  processingDetail: {
    nova: NovaLevel;
    level: string;
    shortExplanation: string;
    whatMeans: string;
    notAutomaticallyBadNote: string;
  };
  categoryComparison: CategoryComparison;
  alternatives: ProductAlternative[];
  transparency: {
    source: string;
    lastUpdated: string;
    verifiedByFoodLens: boolean;
  };
}

export type HealthGoal = 
  | 'reduce_sugar'
  | 'reduce_salt'
  | 'increase_protein'
  | 'increase_fiber'
  | 'reduce_sat_fat'
  | 'reduce_calories'
  | 'avoid_ultraprocessed'
  | 'prefer_whole_foods';

export interface GoalDefinition {
  id: HealthGoal;
  label: string;
  description: string;
  iconName: string;
}

export type DietaryPreference = 
  | 'vegetarian'
  | 'vegan'
  | 'gluten_free'
  | 'lactose_free'
  | 'avoid_palm_oil'
  | 'avoid_sweeteners';

export interface BasketItem {
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface FavoriteItem {
  productId: string;
  listId: string;
  addedAt: string;
}

export interface HistoryItem {
  product: Product;
  scannedAt: string;
}
