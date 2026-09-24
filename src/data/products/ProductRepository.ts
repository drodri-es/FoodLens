import { FoodLensProduct, ProductLookupResult } from '../../domain/product/FoodLensProduct';
import { getBrowserStorage } from '../persistence/appStateStorage';
import { OpenFoodFactsClient } from '../openFoodFacts/OpenFoodFactsClient';
import { normalizeOpenFoodFactsProduct } from '../openFoodFacts/normalizeOpenFoodFactsProduct';

const CACHE_TTL_MS = 30 * 60 * 1000;
const CACHE_PREFIX = 'foodlens:product-cache:v2:';

export function extractBarcode(input: string): string | null {
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

  constructor(
    private readonly client: Pick<OpenFoodFactsClient, 'getProduct'> = new OpenFoodFactsClient(),
    private readonly storage: Storage | null = getBrowserStorage(),
  ) {}

  private readPersisted(barcode: string): { product: FoodLensProduct; expiresAt: number } | null {
    if (!this.storage) return null;
    try {
      const raw = this.storage.getItem(`${CACHE_PREFIX}${barcode}`);
      if (!raw) return null;
      const entry = JSON.parse(raw) as { expiresAt?: number; product?: FoodLensProduct };
      if (!entry.product || typeof entry.expiresAt !== 'number' || entry.expiresAt <= Date.now()) {
        this.storage.removeItem(`${CACHE_PREFIX}${barcode}`);
        return null;
      }
      return { product: entry.product, expiresAt: entry.expiresAt };
    } catch {
      return null;
    }
  }

  private persist(barcode: string, product: FoodLensProduct, expiresAt: number): void {
    if (!this.storage) return;
    try {
      this.storage.setItem(`${CACHE_PREFIX}${barcode}`, JSON.stringify({ expiresAt, product }));
    } catch {
      // A full or unavailable cache must not prevent product lookup.
    }
  }

  async findByBarcode(input: string, signal?: AbortSignal): Promise<ProductLookupResult> {
    const barcode = extractBarcode(input);
    if (!barcode) return { status: 'invalid-code', input };

    const cached = this.cache.get(barcode);
    if (cached && cached.expiresAt > Date.now() && cached.result.status === 'found') {
      return { ...cached.result, fromCache: true };
    }

    const persisted = this.readPersisted(barcode);
    if (persisted) {
      const result: ProductLookupResult = { status: 'found', product: persisted.product, fromCache: true };
      this.cache.set(barcode, { expiresAt: persisted.expiresAt, result });
      return result;
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
      const expiresAt = Date.now() + CACHE_TTL_MS;
      this.cache.set(barcode, { expiresAt, result });
      this.persist(barcode, result.product, expiresAt);
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
