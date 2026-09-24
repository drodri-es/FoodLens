import assert from 'node:assert/strict';
import test from 'node:test';
import { compareFoodLensProducts } from '../src/domain/comparison/compareFoodLensProducts';
import { FoodLensProduct } from '../src/domain/product/FoodLensProduct';

const product = (name: string, nutrition: FoodLensProduct['nutrition']): FoodLensProduct => ({
  barcode: name,
  name,
  categories: [],
  nutrition,
  additives: [],
  allergens: [],
  sourceAssessments: [],
  completeness: 50,
  missingFields: [],
  source: { provider: 'Open Food Facts', fetchedAt: '2026-09-25T00:00:00.000Z' },
});

test('calculates neutral differences from two real product models', () => {
  const highlights = compareFoodLensProducts(
    product('Producto A', { sugars: 12, fiber: 8.2, protein: 9, salt: 0.4 }),
    product('Producto B', { sugars: 7, fiber: 9.1, protein: 8, salt: 0.5 }),
  );

  assert.deepEqual(highlights.map(item => item.text), [
    'Producto B declara 42 % menos azúcares por 100 g o 100 ml.',
    'Producto B declara 0.9 g más de fibra por 100 g o 100 ml.',
    'Producto A declara 1 g más de proteína por 100 g o 100 ml.',
    'Producto A declara 0.1 g menos de sal por 100 g o 100 ml.',
  ]);
});

test('does not invent differences for missing or equal values', () => {
  const highlights = compareFoodLensProducts(
    product('Producto A', { sugars: 5, fiber: 4 }),
    product('Producto B', { sugars: 5 }),
  );

  assert.deepEqual(highlights, []);
});
