import { FoodLensNutrition, FoodLensProduct } from '../../domain/product/FoodLensProduct';
import { OpenFoodFactsProductPayload } from './OpenFoodFactsTypes';

const finiteNumber = (value: unknown): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined;

const localizedTag = (tag: string): string => {
  const separator = tag.indexOf(':');
  return separator >= 0 ? tag.slice(separator + 1).replaceAll('-', ' ') : tag;
};

export function normalizeOpenFoodFactsProduct(
  payload: OpenFoodFactsProductPayload,
  fallbackBarcode: string,
  fetchedAt = new Date(),
): FoodLensProduct {
  const nutriments = payload.nutriments ?? {};
  const nutrition: FoodLensNutrition = {
    energyKcal: finiteNumber(nutriments['energy-kcal_100g']),
    fat: finiteNumber(nutriments.fat_100g),
    saturatedFat: finiteNumber(nutriments['saturated-fat_100g']),
    carbohydrates: finiteNumber(nutriments.carbohydrates_100g),
    sugars: finiteNumber(nutriments.sugars_100g),
    fiber: finiteNumber(nutriments.fiber_100g),
    protein: finiteNumber(nutriments.proteins_100g),
    salt: finiteNumber(nutriments.salt_100g),
  };

  const name = payload.product_name_es?.trim() || payload.product_name?.trim() || 'Producto sin nombre';
  const ingredientsText = payload.ingredients_text_es?.trim() || payload.ingredients_text?.trim() || undefined;
  const nova = [1, 2, 3, 4].includes(payload.nova_group ?? 0)
    ? payload.nova_group as 1 | 2 | 3 | 4
    : undefined;
  const grade = payload.nutriscore_grade?.toLowerCase();
  const nutriScore = grade && ['a', 'b', 'c', 'd', 'e'].includes(grade)
    ? grade as FoodLensProduct['nutriScore']
    : undefined;

  const completenessChecks = [
    { label: 'nombre', complete: Boolean(payload.product_name_es || payload.product_name) },
    { label: 'marca', complete: Boolean(payload.brands) },
    { label: 'cantidad', complete: Boolean(payload.quantity) },
    { label: 'categoría', complete: Boolean(payload.categories_tags?.length) },
    { label: 'tabla nutricional', complete: Object.values(nutrition).some(value => value !== undefined) },
    { label: 'ingredientes', complete: Boolean(ingredientsText) },
    { label: 'procesamiento NOVA', complete: nova !== undefined },
    { label: 'Nutri-Score', complete: nutriScore !== undefined },
  ];
  const completed = completenessChecks.filter(item => item.complete).length;

  return {
    barcode: payload.code || fallbackBarcode,
    name,
    brand: payload.brands?.trim() || undefined,
    quantity: payload.quantity?.trim() || undefined,
    categories: (payload.categories_tags ?? []).map(localizedTag),
    imageUrl: payload.image_front_url || payload.image_front_small_url || undefined,
    nutrition,
    ingredientsText,
    additives: (payload.additives_tags ?? []).map(localizedTag),
    allergens: (payload.allergens_tags ?? []).map(localizedTag),
    nova,
    nutriScore,
    completeness: Math.round((completed / completenessChecks.length) * 100),
    missingFields: completenessChecks.filter(item => !item.complete).map(item => item.label),
    source: {
      provider: 'Open Food Facts',
      updatedAt: payload.last_modified_t
        ? new Date(payload.last_modified_t * 1000).toISOString()
        : undefined,
      fetchedAt: fetchedAt.toISOString(),
    },
  };
}
