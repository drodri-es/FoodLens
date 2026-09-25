import { FoodLensProduct } from './FoodLensProduct';

export interface ProductHighlight {
  id: string;
  text: string;
}

export interface ProductHighlights {
  best: ProductHighlight[];
  attention: ProductHighlight[];
}

const formatValue = (value: number) => value.toLocaleString('es-ES', {
  maximumFractionDigits: 1,
});

export function summarizeFoodLensProduct(product: FoodLensProduct): ProductHighlights {
  const best: ProductHighlight[] = [];
  const attention: ProductHighlight[] = [];
  const nutrition = product.nutrition;
  const assessmentIds = new Map((product.sourceAssessments ?? []).map(item => [item.id, item]));

  if (product.nutriScore === 'a' || product.nutriScore === 'b') {
    best.push({
      id: 'nutriscore',
      text: `Nutri-Score ${product.nutriScore.toUpperCase()} según Open Food Facts`,
    });
  } else if (product.nutriScore === 'd' || product.nutriScore === 'e') {
    attention.push({
      id: 'nutriscore',
      text: `Nutri-Score ${product.nutriScore.toUpperCase()} según Open Food Facts`,
    });
  }

  if (nutrition.fiber !== undefined && nutrition.fiber >= 6) {
    best.push({ id: 'fiber', text: `${formatValue(nutrition.fiber)} g de fibra por 100 g/ml` });
  }
  if (nutrition.salt !== undefined && nutrition.salt <= 0.3) {
    best.push({ id: 'salt', text: `${formatValue(nutrition.salt)} g de sal por 100 g/ml` });
  }
  if (product.nova !== undefined && product.nova <= 2) {
    best.push({ id: 'nova', text: `Clasificación NOVA ${product.nova}` });
  }
  if (assessmentIds.get('additives')?.score === 100) {
    best.push({ id: 'additives', text: 'Open Food Facts no declara aditivos' });
  }

  if (nutrition.sugars !== undefined && nutrition.sugars >= 15) {
    attention.push({ id: 'sugars', text: `${formatValue(nutrition.sugars)} g de azúcares por 100 g/ml` });
  }
  if (nutrition.saturatedFat !== undefined && nutrition.saturatedFat >= 5) {
    attention.push({
      id: 'saturated-fat',
      text: `${formatValue(nutrition.saturatedFat)} g de grasas saturadas por 100 g/ml`,
    });
  }
  if (nutrition.salt !== undefined && nutrition.salt >= 1.5) {
    attention.push({ id: 'salt', text: `${formatValue(nutrition.salt)} g de sal por 100 g/ml` });
  }
  if (product.nova === 4) {
    attention.push({ id: 'nova', text: 'Clasificación NOVA 4' });
  }
  if (product.additives.length > 0) {
    attention.push({
      id: 'additives',
      text: `${product.additives.length} ${product.additives.length === 1 ? 'aditivo declarado' : 'aditivos declarados'}`,
    });
  }

  return {
    best: best.slice(0, 3),
    attention: attention.slice(0, 3),
  };
}
