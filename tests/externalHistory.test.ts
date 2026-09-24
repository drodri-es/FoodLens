import assert from 'node:assert/strict';
import test from 'node:test';
import type { ExternalHistoryItem, FoodLensProduct } from '../src/domain/product/FoodLensProduct';
import { filterExternalHistory, formatScanDate, groupExternalHistory } from '../src/domain/history/externalHistory';

const product = (barcode: string, name: string, brand?: string): FoodLensProduct => ({
  barcode,
  name,
  brand,
  categories: [],
  nutrition: {},
  additives: [],
  allergens: [],
  sourceAssessments: [],
  completeness: 0,
  missingFields: [],
  source: { provider: 'Open Food Facts', fetchedAt: '2026-09-20T10:00:00.000Z' },
});

const item = (scannedAt: string, barcode: string, name: string, brand?: string): ExternalHistoryItem => ({
  scannedAt,
  product: product(barcode, name, brand),
});

test('groups scan history by calendar recency and sorts newest first', () => {
  const groups = groupExternalHistory([
    item('2026-09-10T10:00:00.000Z', '4', 'Antiguo'),
    item('2026-09-24T08:00:00.000Z', '2', 'Ayer'),
    item('2026-09-21T08:00:00.000Z', '3', 'Semana'),
    item('2026-09-25T08:00:00.000Z', '1', 'Hoy'),
  ], new Date('2026-09-25T12:00:00.000Z'));

  assert.deepEqual(groups.map(group => group.id), ['today', 'yesterday', 'week', 'older']);
  assert.deepEqual(groups.flatMap(group => group.items.map(entry => entry.product.barcode)), ['1', '2', '3', '4']);
});

test('searches product name, brand and barcode without accent sensitivity', () => {
  const items = [
    item('2026-09-25T08:00:00.000Z', '841000000001', 'Crema de cacahuete', 'María Bio'),
    item('2026-09-25T09:00:00.000Z', '841000000002', 'Copos de avena', 'Campo'),
  ];

  assert.equal(filterExternalHistory(items, 'maria').length, 1);
  assert.equal(filterExternalHistory(items, 'CACAHUETE').length, 1);
  assert.equal(filterExternalHistory(items, '000002')[0].product.name, 'Copos de avena');
});

test('formats recent dates and handles invalid legacy values', () => {
  const now = new Date('2026-09-25T12:00:00.000Z');
  assert.match(formatScanDate('2026-09-25T08:00:00.000Z', now), /^Hoy,/);
  assert.match(formatScanDate('2026-09-24T08:00:00.000Z', now), /^Ayer,/);
  assert.equal(formatScanDate('Ahora mismo', now), 'Fecha no disponible');
});
