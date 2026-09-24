import { FoodLensProduct } from '../product/FoodLensProduct';

export const FOODLENS_SCORE_VERSION = '0.1.0-experimental';

export interface FoodLensScoreDimension {
  id: 'nutrition' | 'ingredients' | 'processing' | 'additives';
  label: string;
  weight: number;
  score?: number;
  explanation: string;
}

export interface FoodLensScoreResult {
  overall: number;
  label: 'Excelente' | 'Buena opción' | 'Mejorable' | 'Ocasional';
  confidence: number;
  algorithmVersion: string;
  dimensions: FoodLensScoreDimension[];
}

const clampScore = (value: number): number => Math.round(Math.max(0, Math.min(100, value)));

const getLabel = (score: number): FoodLensScoreResult['label'] => {
  if (score >= 80) return 'Excelente';
  if (score >= 60) return 'Buena opción';
  if (score >= 40) return 'Mejorable';
  return 'Ocasional';
};

export function calculateFoodLensScore(product: FoodLensProduct): FoodLensScoreResult | null {
  const assessmentById = new Map((product.sourceAssessments ?? []).map(item => [item.id, item]));
  const nutrition = assessmentById.get('nutrition');
  const processing = assessmentById.get('processing');
  const additives = assessmentById.get('additives');

  const dimensions: FoodLensScoreDimension[] = [
    {
      id: 'nutrition',
      label: 'Calidad nutricional',
      weight: 45,
      score: nutrition?.score,
      explanation: nutrition?.title ?? 'Open Food Facts no ofrece una valoración nutricional utilizable.',
    },
    {
      id: 'ingredients',
      label: 'Ingredientes',
      weight: 25,
      explanation: 'Sin evaluar: todavía no existe una regla validada para interpretar la lista de ingredientes.',
    },
    {
      id: 'processing',
      label: 'Procesamiento',
      weight: 15,
      score: processing?.score,
      explanation: processing?.title ?? 'Open Food Facts no ofrece una valoración NOVA utilizable.',
    },
    {
      id: 'additives',
      label: 'Aditivos',
      weight: 15,
      score: additives?.score,
      explanation: additives?.title ?? 'Open Food Facts no ofrece una valoración de aditivos utilizable.',
    },
  ];

  const available = dimensions.filter(
    (dimension): dimension is FoodLensScoreDimension & { score: number } => dimension.score !== undefined,
  );
  const availableWeight = available.reduce((total, dimension) => total + dimension.weight, 0);

  // Nutrition is mandatory and at least one additional dimension must be known.
  if (!nutrition || available.length < 2 || availableWeight < 60) return null;

  const weightedTotal = available.reduce(
    (total, dimension) => total + dimension.score * dimension.weight,
    0,
  );
  const overall = clampScore(weightedTotal / availableWeight);
  const confidence = clampScore(product.completeness * (availableWeight / 100));

  return {
    overall,
    label: getLabel(overall),
    confidence,
    algorithmVersion: FOODLENS_SCORE_VERSION,
    dimensions,
  };
}
