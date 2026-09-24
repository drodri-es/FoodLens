import assert from 'node:assert/strict';
import test from 'node:test';
import { OpenFoodFactsClient } from '../src/data/openFoodFacts/OpenFoodFactsClient';

test('uses the browser-compatible Open Food Facts identification header', async () => {
  let requestedUrl = '';
  let requestedHeaders: HeadersInit | undefined;
  const fetcher: typeof fetch = async (input, init) => {
    requestedUrl = String(input);
    requestedHeaders = init?.headers;
    return new Response(JSON.stringify({
      status: 'success',
      product: { code: '3017620422003', product_name: 'Product' },
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };

  await new OpenFoodFactsClient(fetcher).getProduct('3017620422003');

  const headers = new Headers(requestedHeaders);
  assert.match(requestedUrl, /\/api\/v3\/product\/3017620422003\.json/);
  assert.equal(headers.get('X-User-Agent'), 'FoodLens/0.0.0 (web application)');
  assert.equal(headers.has('X-OpenFoodFacts-User-Agent'), false);
});

test('returns the structured body for a not-found response', async () => {
  const fetcher: typeof fetch = async () => new Response(
    JSON.stringify({ status: 'failure' }),
    { status: 404, headers: { 'Content-Type': 'application/json' } },
  );

  const response = await new OpenFoodFactsClient(fetcher).getProduct('0000000000000');
  assert.equal(response.status, 'failure');
});
