import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const auditedFiles = [
  'src/data/mockProducts.ts',
  'src/components/assistant/FoodLensAssistantModal.tsx',
  'src/components/basket/BasketView.tsx',
  'src/components/product/ProductDetailView.tsx',
  'src/components/product/ExternalProductView.tsx',
  'src/domain/product/summarizeFoodLensProduct.ts',
];

const unsupportedLanguage = [
  /\b(?:completamente )?segur[oa]\b/i,
  /\binocu[oa]\b/i,
  /cardiosaludable/i,
  /\bsaciante\b/i,
  /bacterias probióticas beneficiosas/i,
  /digestión óptima/i,
  /impacto en microbiota/i,
  /ingredientes más limpios/i,
  /sustituciones saludables/i,
];

test('audited user-facing fixtures avoid unsupported categorical health language', () => {
  for (const file of auditedFiles) {
    const source = readFileSync(file, 'utf8');
    for (const pattern of unsupportedLanguage) {
      assert.doesNotMatch(source, pattern, `${file} contains ${pattern}`);
    }
  }
});
