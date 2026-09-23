export interface OpenFoodFactsNutriments {
  'energy-kcal_100g'?: number;
  fat_100g?: number;
  'saturated-fat_100g'?: number;
  carbohydrates_100g?: number;
  sugars_100g?: number;
  fiber_100g?: number;
  proteins_100g?: number;
  salt_100g?: number;
}

export interface OpenFoodFactsProductPayload {
  code?: string;
  product_name?: string;
  product_name_es?: string;
  brands?: string;
  quantity?: string;
  categories_tags?: string[];
  image_front_url?: string;
  image_front_small_url?: string;
  nutriments?: OpenFoodFactsNutriments;
  ingredients_text?: string;
  ingredients_text_es?: string;
  additives_tags?: string[];
  allergens_tags?: string[];
  nova_group?: number;
  nutriscore_grade?: string;
  last_modified_t?: number;
}

export interface OpenFoodFactsProductResponse {
  status: 'success' | 'failure';
  code?: string;
  product?: OpenFoodFactsProductPayload;
  error?: string;
}
