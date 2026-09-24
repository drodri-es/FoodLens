import assert from 'node:assert/strict';
import test from 'node:test';
import { loadAppState, saveAppState } from '../src/data/persistence/appStateStorage';
import type { Product } from '../src/types/foodlens';
import type { FoodLensProduct } from '../src/domain/product/FoodLensProduct';
import { MemoryStorage } from './helpers';

test('persists state using product identifiers and restores current fixtures', () => {
  const storage = new MemoryStorage();
  const firstProduct = { id: 'product-one' } as Product;
  const secondProduct = { id: 'product-two' } as Product;
  const externalProduct = {
    barcode: '3017620422003',
    name: 'Producto externo',
    source: { provider: 'Open Food Facts', fetchedAt: '2026-09-25T00:00:00.000Z' },
  } as FoodLensProduct;
  const saved = saveAppState({
    history: [{ product: firstProduct, scannedAt: 'Ahora' }],
    externalHistory: [],
    externalFavorites: [{ product: externalProduct, addedAt: 'Ahora' }],
    favorites: [{ productId: firstProduct.id, listId: 'habituales', addedAt: 'Hoy' }],
    favoriteLists: [{ id: 'habituales', name: 'Habituales' }],
    basket: [{ product: secondProduct, quantity: 2, addedAt: 'Hoy' }],
    comparisonProductIds: [firstProduct.id],
    userGoals: ['reduce_sugar'],
    dietaryPreferences: ['vegetarian'],
    userAccount: { name: 'Invitado', email: '', isGuest: true },
  }, storage);

  const restored = loadAppState(storage, [firstProduct, secondProduct]);
  assert.equal(saved, true);
  assert.equal(restored.history?.[0].product, firstProduct);
  assert.equal(restored.basket?.[0].product, secondProduct);
  assert.equal(restored.basket?.[0].quantity, 2);
  assert.equal(restored.externalFavorites?.[0].product.barcode, externalProduct.barcode);
  assert.deepEqual(restored.userGoals, ['reduce_sugar']);
});

test('discards malformed external favorites', () => {
  const storage = new MemoryStorage();
  storage.setItem('foodlens:app-state', JSON.stringify({
    version: 1,
    history: [],
    externalFavorites: [
      { product: { barcode: '123', name: 'Sin fuente' }, addedAt: 'Ahora' },
      { product: { barcode: '456', name: 'Válido', source: { provider: 'Open Food Facts' } }, addedAt: 'Ahora' },
    ],
    favorites: [],
    favoriteLists: [],
    basket: [],
    comparisonProductIds: [],
    userGoals: [],
    dietaryPreferences: [],
    userAccount: { name: 'Invitado', email: '', isGuest: true },
  }));

  const restored = loadAppState(storage);
  assert.equal(restored.externalFavorites?.length, 1);
  assert.equal(restored.externalFavorites?.[0].product.barcode, '456');
});

test('ignores corrupt and unsupported stored state', () => {
  const corrupt = new MemoryStorage();
  corrupt.setItem('foodlens:app-state', '{not-json');
  assert.deepEqual(loadAppState(corrupt), {});

  const future = new MemoryStorage();
  future.setItem('foodlens:app-state', JSON.stringify({ version: 99 }));
  assert.deepEqual(loadAppState(future), {});
});
