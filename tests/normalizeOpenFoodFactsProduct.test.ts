import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeOpenFoodFactsProduct } from '../src/data/openFoodFacts/normalizeOpenFoodFactsProduct';

test('normalizes source fields without replacing missing values with zero', () => {
  const product = normalizeOpenFoodFactsProduct({
    code: '3017620422003',
    product_name: 'Example product',
    brands: 'Example brand',
    nutriments: { sugars_100g: 12.5, proteins_100g: 4 },
    allergens_tags: ['en:milk'],
    nova_group: 4,
    nutriscore_grade: 'D',
    attribute_groups: [{ attributes: [
      { id: 'nutriscore', status: 'known', match: 31.6, title: 'Nutri-Score D' },
      { id: 'nova', status: 'known', match: 0, title: 'Ultra-processed foods' },
      { id: 'additives', status: 'unknown', match: 100, title: 'Unknown' },
    ] }],
  }, 'fallback', new Date('2026-09-23T12:00:00.000Z'));

  assert.equal(product.barcode, '3017620422003');
  assert.equal(product.nutrition.sugars, 12.5);
  assert.equal(product.nutrition.fiber, undefined);
  assert.deepEqual(product.allergens, ['milk']);
  assert.equal(product.nova, 4);
  assert.equal(product.nutriScore, 'd');
  assert.deepEqual(product.sourceAssessments, [
    { id: 'nutrition', score: 32, title: 'Nutri-Score D' },
    { id: 'processing', score: 0, title: 'Ultra-processed foods' },
  ]);
  assert.ok(product.missingFields.includes('ingredientes'));
  assert.equal(product.source.provider, 'Open Food Facts');
});

test('uses the fallback barcode and an explicit missing name', () => {
  const product = normalizeOpenFoodFactsProduct({}, '12345678');
  assert.equal(product.barcode, '12345678');
  assert.equal(product.name, 'Producto sin nombre');
  assert.equal(product.completeness, 0);
  assert.deepEqual(product.sourceAssessments, []);
});
