import { OpenFoodFactsProductResponse } from './OpenFoodFactsTypes';

const DEFAULT_BASE_URL = 'https://world.openfoodfacts.org/api/v3';

const PRODUCT_FIELDS = [
  'code',
  'product_name',
  'product_name_es',
  'brands',
  'quantity',
  'serving_size',
  'categories_tags',
  'image_front_url',
  'image_front_small_url',
  'nutriments',
  'ingredients_text',
  'ingredients_text_es',
  'additives_tags',
  'allergens_tags',
  'nova_group',
  'nutriscore_grade',
  'attribute_groups',
  'last_modified_t',
].join(',');

export class OpenFoodFactsClient {
  constructor(
    private readonly fetcher: typeof fetch = globalThis.fetch.bind(globalThis),
    private readonly baseUrl = DEFAULT_BASE_URL,
  ) {}

  async getProduct(barcode: string, signal?: AbortSignal): Promise<OpenFoodFactsProductResponse> {
    const url = `${this.baseUrl}/product/${encodeURIComponent(barcode)}.json?fields=${PRODUCT_FIELDS}&lc=es`;
    const response = await this.fetcher(url, {
      signal,
    });

    if (response.status === 404) {
      return response.json() as Promise<OpenFoodFactsProductResponse>;
    }

    if (!response.ok) {
      throw new Error(`Open Food Facts respondió con HTTP ${response.status}.`);
    }

    return response.json() as Promise<OpenFoodFactsProductResponse>;
  }
}
