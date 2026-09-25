import assert from 'node:assert/strict';
import test from 'node:test';
import { FoodLensProduct } from '../src/domain/product/FoodLensProduct';
import { calculateFoodLensScore, FOODLENS_SCORE_VERSION } from '../src/domain/scoring/calculateFoodLensScore';

const product = (overrides: Partial<FoodLensProduct> = {}): FoodLensProduct => ({
  barcode: '3017620422003',
  name: 'Producto de prueba',
  categories: [],
  nutrition: {},
  additives: [],
  allergens: [],
  completeness: 80,
  missingFields: [],
  sourceAssessments: [
    { id: 'nutrition', score: 80, title: 'Nutri-Score B' },
    { id: 'processing', score: 40, title: 'Processed food' },
    { id: 'additives', score: 60, title: '2 additives' },
  ],
  source: { provider: 'Open Food Facts', fetchedAt: '2026-09-24T00:00:00.000Z' },
  ...overrides,
});

test('calculates a versioned weighted score from known source assessments', () => {
  const result = calculateFoodLensScore(product());

  assert.ok(result);
  assert.equal(result.overall, 68);
  assert.equal(result.label, 'Buena opción');
  assert.equal(result.confidence, 60);
  assert.equal(result.algorithmVersion, FOODLENS_SCORE_VERSION);
  assert.equal(result.dimensions.find(item => item.id === 'ingredients')?.score, undefined);
});

test('does not score a product without nutrition and another known dimension', () => {
  assert.equal(calculateFoodLensScore(product({ sourceAssessments: [] })), null);
  assert.equal(calculateFoodLensScore(product({
    sourceAssessments: [{ id: 'nutrition', score: 80, title: 'Nutri-Score B' }],
  })), null);
});

test('accepts products restored from the previous cache without assessments', () => {
  const { sourceAssessments: _sourceAssessments, ...legacy } = product();
  assert.equal(calculateFoodLensScore(legacy as FoodLensProduct), null);
});

test('uses traceable Nutri-Score and NOVA fallbacks when attributes are missing', () => {
  const result = calculateFoodLensScore(product({
    sourceAssessments: [],
    nutriScore: 'b',
    nova: 3,
  }));

  assert.ok(result);
  assert.equal(result.overall, 69);
  assert.equal(result.algorithmVersion, '0.2.0-experimental');
  assert.equal(result.dimensions.find(item => item.id === 'nutrition')?.score, 75);
  assert.equal(result.dimensions.find(item => item.id === 'processing')?.score, 50);
  assert.match(
    result.dimensions.find(item => item.id === 'nutrition')?.explanation ?? '',
    /Conversión ordinal/,
  );
});

test('prefers precise source attributes over ordinal fallbacks', () => {
  const result = calculateFoodLensScore(product({ nutriScore: 'a', nova: 1 }));
  assert.ok(result);
  assert.equal(result.dimensions.find(item => item.id === 'nutrition')?.score, 80);
  assert.equal(result.dimensions.find(item => item.id === 'processing')?.score, 40);
});
