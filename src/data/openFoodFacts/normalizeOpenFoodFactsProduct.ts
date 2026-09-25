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
  const nutritionPerServing: FoodLensNutrition = {
    energyKcal: finiteNumber(nutriments['energy-kcal_serving']),
    fat: finiteNumber(nutriments.fat_serving),
    saturatedFat: finiteNumber(nutriments['saturated-fat_serving']),
    carbohydrates: finiteNumber(nutriments.carbohydrates_serving),
    sugars: finiteNumber(nutriments.sugars_serving),
    fiber: finiteNumber(nutriments.fiber_serving),
    protein: finiteNumber(nutriments.proteins_serving),
    salt: finiteNumber(nutriments.salt_serving),
  };
  const hasServingNutrition = Object.values(nutritionPerServing).some(value => value !== undefined);

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
  const sourceAssessmentIds: ReadonlyMap<string, 'nutrition' | 'processing' | 'additives'> = new Map([
    ['nutriscore', 'nutrition'],
    ['nova', 'processing'],
    ['additives', 'additives'],
  ] as const);
  const sourceAssessments = (payload.attribute_groups ?? [])
    .flatMap(group => group.attributes ?? [])
    .flatMap(attribute => {
      const id = attribute.id ? sourceAssessmentIds.get(attribute.id) : undefined;
      if (!id || attribute.status !== 'known' || !Number.isFinite(attribute.match)) return [];
      return [{
        id,
        score: Math.round(Math.max(0, Math.min(100, attribute.match as number))),
        title: attribute.title,
      }];
    });

  return {
    barcode: payload.code || fallbackBarcode,
    name,
    brand: payload.brands?.trim() || undefined,
    quantity: payload.quantity?.trim() || undefined,
    servingSize: payload.serving_size?.trim() || undefined,
    categories: (payload.categories_tags ?? []).map(localizedTag),
    imageUrl: payload.image_front_url || payload.image_front_small_url || undefined,
    nutrition,
    nutritionPerServing: hasServingNutrition ? nutritionPerServing : undefined,
    ingredientsText,
    additives: (payload.additives_tags ?? []).map(localizedTag),
    allergens: (payload.allergens_tags ?? []).map(localizedTag),
    nova,
    nutriScore,
    sourceAssessments,
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
