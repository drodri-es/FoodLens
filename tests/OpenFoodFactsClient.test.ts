import assert from 'node:assert/strict';
import test from 'node:test';
import { OpenFoodFactsClient } from '../src/data/openFoodFacts/OpenFoodFactsClient';

test('uses a simple browser request that does not trigger a CORS preflight', async () => {
  let requestedUrl = '';
  let requestedInit: RequestInit | undefined;
  const fetcher: typeof fetch = async (input, init) => {
    requestedUrl = String(input);
    requestedInit = init;
    return new Response(JSON.stringify({
      status: 'success',
      product: { code: '3017620422003', product_name: 'Product' },
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };

  await new OpenFoodFactsClient(fetcher).getProduct('3017620422003');

  assert.match(requestedUrl, /\/api\/v3\/product\/3017620422003\.json/);
  assert.equal(requestedInit?.headers, undefined);
});

test('returns the structured body for a not-found response', async () => {
  const fetcher: typeof fetch = async () => new Response(
    JSON.stringify({ status: 'failure' }),
    { status: 404, headers: { 'Content-Type': 'application/json' } },
  );

  const response = await new OpenFoodFactsClient(fetcher).getProduct('0000000000000');
  assert.equal(response.status, 'failure');
});
