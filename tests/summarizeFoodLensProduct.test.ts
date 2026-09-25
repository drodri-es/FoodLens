import assert from 'node:assert/strict';
import test from 'node:test';
import type { FoodLensProduct } from '../src/domain/product/FoodLensProduct';
import { summarizeFoodLensProduct } from '../src/domain/product/summarizeFoodLensProduct';

const product = (overrides: Partial<FoodLensProduct> = {}): FoodLensProduct => ({
  barcode: '8410000000001',
  name: 'Producto de prueba',
  categories: [],
  nutrition: {},
  additives: [],
  allergens: [],
  sourceAssessments: [],
  completeness: 50,
  missingFields: [],
  source: { provider: 'Open Food Facts', fetchedAt: '2026-09-25T00:00:00.000Z' },
  ...overrides,
});

test('selects factual positive and attention highlights from known values', () => {
  const highlights = summarizeFoodLensProduct(product({
    nutriScore: 'b',
    nova: 4,
    nutrition: { fiber: 7.2, sugars: 18, saturatedFat: 6 },
    additives: ['e322'],
  }));

  assert.deepEqual(highlights.best.map(item => item.id), ['nutriscore', 'fiber']);
  assert.deepEqual(highlights.attention.map(item => item.id), ['sugars', 'saturated-fat', 'nova']);
  assert.match(highlights.attention[0].text, /18 g de azúcares/);
});

test('does not treat an empty additives array as evidence unless the source assessment is known', () => {
  assert.equal(summarizeFoodLensProduct(product()).best.some(item => item.id === 'additives'), false);

  const highlights = summarizeFoodLensProduct(product({
    sourceAssessments: [{ id: 'additives', score: 100, title: 'Sin aditivos' }],
  }));
  assert.equal(highlights.best.some(item => item.id === 'additives'), true);
});

test('returns explicit empty summaries when source data is absent', () => {
  assert.deepEqual(summarizeFoodLensProduct(product()), { best: [], attention: [] });
});
