import { ProductLookupResult } from '../../domain/product/FoodLensProduct';
import { OpenFoodFactsClient } from '../openFoodFacts/OpenFoodFactsClient';
import { normalizeOpenFoodFactsProduct } from '../openFoodFacts/normalizeOpenFoodFactsProduct';

const CACHE_TTL_MS = 30 * 60 * 1000;

function extractBarcode(input: string): string | null {
  const trimmed = input.trim();
  if (/^\d{8,14}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    const match = url.pathname.match(/(?:^|\/)(\d{8,14})(?:\/|$)/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

export class ProductRepository {
  private readonly cache = new Map<string, { expiresAt: number; result: ProductLookupResult }>();

  constructor(private readonly client = new OpenFoodFactsClient()) {}

  async findByBarcode(input: string, signal?: AbortSignal): Promise<ProductLookupResult> {
    const barcode = extractBarcode(input);
    if (!barcode) return { status: 'invalid-code', input };

    const cached = this.cache.get(barcode);
    if (cached && cached.expiresAt > Date.now() && cached.result.status === 'found') {
      return { ...cached.result, fromCache: true };
    }

    try {
      const response = await this.client.getProduct(barcode, signal);
      if (response.status !== 'success' || !response.product) {
        return { status: 'not-found', barcode };
      }

      const result: ProductLookupResult = {
        status: 'found',
        product: normalizeOpenFoodFactsProduct(response.product, barcode),
        fromCache: false,
      };
      this.cache.set(barcode, { expiresAt: Date.now() + CACHE_TTL_MS, result });
      return result;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') throw error;
      return {
        status: 'unavailable',
        barcode,
        message: error instanceof Error ? error.message : 'No se pudo consultar Open Food Facts.',
      };
    }
  }
}

export const productRepository = new ProductRepository();
