import assert from 'node:assert/strict';
import test from 'node:test';
import { ProductRepository, extractBarcode } from '../src/data/products/ProductRepository';
import { OpenFoodFactsProductResponse } from '../src/data/openFoodFacts/OpenFoodFactsTypes';
import { MemoryStorage } from './helpers';

test('extracts barcodes from plain input and GS1 Digital Link URLs', () => {
  assert.equal(extractBarcode(' 3017620422003 '), '3017620422003');
  assert.equal(extractBarcode('https://id.gs1.org/01/09506000134352'), '09506000134352');
  assert.equal(extractBarcode('not-a-code'), null);
});

test('normalizes a product and reuses the persistent cache', async () => {
  let calls = 0;
  const response: OpenFoodFactsProductResponse = {
    status: 'success',
    product: { code: '3017620422003', product_name: 'Cached product', nutriments: { sugars_100g: 7 } },
  };
  const client = { async getProduct() { calls += 1; return response; } };
  const storage = new MemoryStorage();

  const first = await new ProductRepository(client, storage).findByBarcode('3017620422003');
  const second = await new ProductRepository(client, storage).findByBarcode('3017620422003');

  assert.equal(first.status, 'found');
  assert.equal(first.status === 'found' && first.fromCache, false);
  assert.equal(second.status === 'found' && second.fromCache, true);
  assert.equal(calls, 1);
});

test('distinguishes missing products and unavailable services', async () => {
  const missing = new ProductRepository({
    async getProduct() { return { status: 'failure' as const }; },
  }, null);
  const unavailable = new ProductRepository({
    async getProduct() { throw new Error('network down'); },
  }, null);

  assert.equal((await missing.findByBarcode('3017620422003')).status, 'not-found');
  assert.equal((await unavailable.findByBarcode('3017620422003')).status, 'unavailable');
});
