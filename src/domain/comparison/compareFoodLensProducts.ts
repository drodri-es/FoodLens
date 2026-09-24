import { FoodLensProduct } from '../product/FoodLensProduct';

export interface ProductComparisonHighlight {
  nutrient: 'sugars' | 'fiber' | 'protein' | 'salt';
  text: string;
}

const format = (value: number): string => Number.isInteger(value) ? String(value) : value.toFixed(1);

export function compareFoodLensProducts(
  first: FoodLensProduct,
  second: FoodLensProduct,
): ProductComparisonHighlight[] {
  const highlights: ProductComparisonHighlight[] = [];
  const { nutrition: a } = first;
  const { nutrition: b } = second;

  if (a.sugars !== undefined && b.sugars !== undefined && a.sugars !== b.sugars) {
    const [lower, higher, lowerName] = a.sugars < b.sugars
      ? [a.sugars, b.sugars, first.name]
      : [b.sugars, a.sugars, second.name];
    const percent = higher > 0 ? Math.round(((higher - lower) / higher) * 100) : 0;
    highlights.push({
      nutrient: 'sugars',
      text: `${lowerName} declara ${percent} % menos azúcares por 100 g o 100 ml.`,
    });
  }

  if (a.fiber !== undefined && b.fiber !== undefined && a.fiber !== b.fiber) {
    const [higher, lower, higherName] = a.fiber > b.fiber
      ? [a.fiber, b.fiber, first.name]
      : [b.fiber, a.fiber, second.name];
    highlights.push({
      nutrient: 'fiber',
      text: `${higherName} declara ${format(higher - lower)} g más de fibra por 100 g o 100 ml.`,
    });
  }

  if (a.protein !== undefined && b.protein !== undefined && a.protein !== b.protein) {
    const [higher, lower, higherName] = a.protein > b.protein
      ? [a.protein, b.protein, first.name]
      : [b.protein, a.protein, second.name];
    highlights.push({
      nutrient: 'protein',
      text: `${higherName} declara ${format(higher - lower)} g más de proteína por 100 g o 100 ml.`,
    });
  }

  if (a.salt !== undefined && b.salt !== undefined && a.salt !== b.salt) {
    const [lower, higher, lowerName] = a.salt < b.salt
      ? [a.salt, b.salt, first.name]
      : [b.salt, a.salt, second.name];
    highlights.push({
      nutrient: 'salt',
      text: `${lowerName} declara ${format(higher - lower)} g menos de sal por 100 g o 100 ml.`,
    });
  }

  return highlights;
}
