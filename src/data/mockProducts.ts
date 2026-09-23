import { Product, GoalDefinition } from '../types/foodlens';

import cerealImg from '../assets/images/cereal_choco_crunch_1790111757028.jpg';
import yogurtImg from '../assets/images/greek_yogurt_natural_1790111768521.jpg';
import breadImg from '../assets/images/whole_wheat_bread_1790111778643.jpg';
import oilImg from '../assets/images/olive_oil_extra_virgin_1790111788739.jpg';

export const HEALTH_GOALS: GoalDefinition[] = [
  { id: 'reduce_sugar', label: 'Reducir azúcar', description: 'Prioriza alimentos con menos de 5 g de azúcar / 100 g o sin azúcares añadidos', iconName: 'CandyOff' },
  { id: 'reduce_salt', label: 'Reducir sal', description: 'Limita productos con más de 1 g de sal / 100 g', iconName: 'Waves' },
  { id: 'increase_protein', label: 'Aumentar proteína', description: 'Destaca alimentos con más de 10 g de proteína / 100 g', iconName: 'Dumbbell' },
  { id: 'increase_fiber', label: 'Aumentar fibra', description: 'Busca productos ricos en fibra (> 6 g / 100 g)', iconName: 'Sprout' },
  { id: 'reduce_sat_fat', label: 'Reducir grasas saturadas', description: 'Prefiere fuentes de grasas insaturadas cardiosaludables', iconName: 'HeartPulse' },
  { id: 'reduce_calories', label: 'Reducir densidad calórica', description: 'Prioriza alimentos saciantes con menor aporte energético', iconName: 'Scale' },
  { id: 'avoid_ultraprocessed', label: 'Evitar ultraprocesados', description: 'Minimiza alimentos clasificados como NOVA 4', iconName: 'ShieldCheck' },
  { id: 'prefer_whole_foods', label: 'Preferir alimentos simples', description: 'Listas de ingredientes cortas y materias primas integrales', iconName: 'Leaf' },
];

export const DIETARY_PREFERENCES = [
  { id: 'vegetarian', label: 'Vegetariano' },
  { id: 'vegan', label: 'Vegano' },
  { id: 'gluten_free', label: 'Sin gluten' },
  { id: 'lactose_free', label: 'Sin lactosa' },
  { id: 'avoid_palm_oil', label: 'Evitar aceite de palma' },
  { id: 'avoid_sweeteners', label: 'Evitar edulcorantes' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-cereales-choco-crunch',
    barcode: '8410123456789',
    name: 'Cereales Choco Crunch',
    brand: 'BioNatur',
    quantity: '375 g',
    category: 'Cereales de desayuno',
    imageUrl: cerealImg,
    score: 76,
    scoreLabel: 'Buena opción',
    scoreSummary: 'Basado en nutrición, ingredientes, procesamiento y aditivos.',
    dimensions: {
      nutrition: {
        score: 82,
        label: 'Muy buena',
        summary: 'Buen balance energético con notable aporte de fibra y proteína vegetal.'
      },
      ingredients: {
        score: 73,
        label: 'Buena',
        summary: 'Mayoría de cereales integrales; contiene cacao puro y azúcar de caña como 4º ingrediente.'
      },
      processing: {
        score: 61,
        label: 'Alto',
        summary: 'Proceso de extrusión y tostado estándar para cereales crujientes.',
        nova: 4
      },
      additives: {
        score: 89,
        label: 'Sin preocupación relevante',
        summary: 'Solo contiene 1 aditivo emulsionante seguro (lecitina de girasol).',
        count: 1
      }
    },
    pros: [
      'Alto contenido en fibra (8,2 g / 100 g)',
      'Buena cantidad de proteína vegetal (9 g)',
      'Bajo en sal (0,4 g / 100 g)'
    ],
    cons: [
      '12 g de azúcar / 100 g (azúcar de caña añadido)',
      'Clasificado como producto ultraprocesado (NOVA 4) por extrusión'
    ],
    serving: {
      standardUnit: '100 g',
      defaultServing: 30,
      servingUnit: 'g',
      per100g: {
        calories: 380,
        fat: 4.8,
        satFat: 1.6,
        carbs: 68.0,
        sugars: 12.0,
        fiber: 8.2,
        protein: 9.0,
        salt: 0.4
      },
      nutriScore: 'B'
    },
    ingredientsList: {
      rawText: 'Avena integral (45%), trigo integral (25%), azúcar de caña, cacao desgrasado en polvo (7%), aceite de girasol alto oleico, emulgente (lecitina de girasol E322), sal marina, aroma natural de vainilla.',
      highlighted: [
        { name: 'Avena integral', type: 'neutral', note: 'Grano entero nutritivo' },
        { name: 'Trigo integral', type: 'neutral', note: 'Grano entero con salvado' },
        { name: 'azúcar de caña', type: 'sugar', note: 'Azúcar añadido (4º ingrediente)' },
        { name: 'cacao desgrasado en polvo', type: 'neutral', note: 'Antioxidantes y polifenoles' },
        { name: 'aceite de girasol alto oleico', type: 'refined_oil', note: 'Grasa monoinsaturada' },
        { name: 'lecitina de girasol E322', type: 'additive', note: 'Emulsionante natural' },
        { name: 'trigo', type: 'allergen', note: 'Contiene gluten' }
      ],
      summary: 'Lista de ingredientes relativamente sencilla. El azúcar aparece como cuarto ingrediente aportando 12 g por cada 100 g.'
    },
    additivesList: [
      {
        code: 'E322',
        name: 'Lecitinas de girasol',
        function: 'Emulsionante',
        status: 'Autorizado en la UE',
        assessment: 'Sin preocupación relevante en las cantidades habituales.',
        riskLevel: 'safe',
        evidenceNote: 'Compuesto natural presente en células vegetales, bien tolerado y seguro.',
        concentrationKnown: false
      }
    ],
    processingDetail: {
      nova: 4,
      level: 'Alto',
      shortExplanation: 'El producto contiene varios procesos industriales de extrusión y tostado típicos de cereales listos para consumir.',
      whatMeans: 'Los granos son molidos, cocidos a presión y moldeados para lograr su textura crujiente.',
      notAutomaticallyBadNote: 'NOVA 4 no significa automáticamente dañino: su perfil nutricional sigue aportando fibra de grano completo.'
    },
    categoryComparison: {
      categoryName: 'cereales de desayuno',
      percentile: 68,
      averages: {
        sugars: 18.0,
        fiber: 5.3,
        protein: 7.4,
        salt: 0.7
      },
      sugarDiffPercent: -33,
      fiberDiffPercent: 55,
      proteinDiffPercent: 22,
      saltDiffPercent: -43,
    },
    alternatives: [
      {
        productId: 'prod-copos-avena-integral',
        name: 'Avena Integral en Copos',
        brand: 'NaturTierra',
        score: 94,
        scoreLabel: 'Excelente',
        reason: 'Menos azúcar y sin procesar',
        keyDifference: '11,3 g menos de azúcar / 100 g y 0 procesados (NOVA 1).',
        imageUrl: cerealImg
      },
      {
        productId: 'prod-cereales-espelta-bio',
        name: 'Copos Tostados de Espelta',
        brand: 'SoriaBio',
        score: 84,
        scoreLabel: 'Excelente',
        reason: 'Ingredientes más sencillos',
        keyDifference: 'Solo 4,5 g de azúcar y sin aditivos.',
        imageUrl: cerealImg
      }
    ],
    transparency: {
      source: 'Datos ficticios de demostración',
      lastUpdated: '12 septiembre 2026',
      verifiedByFoodLens: false
    }
  },
  {
    id: 'prod-copos-avena-integral',
    barcode: '8420000000012',
    name: 'Avena Integral en Copos Suaves',
    brand: 'NaturTierra',
    quantity: '500 g',
    category: 'Cereales de desayuno',
    imageUrl: cerealImg,
    score: 94,
    scoreLabel: 'Excelente',
    scoreSummary: 'Alimento sin procesar con extraordinaria riqueza en betaglucanos y fibra.',
    dimensions: {
      nutrition: {
        score: 96,
        label: 'Excelente',
        summary: 'Bajo en azúcares simples, alto contenido en fibra soluble y proteína vegetal de calidad.'
      },
      ingredients: {
        score: 98,
        label: 'Excelente',
        summary: '100% copos de avena integral pura. Sin ningún añadido.'
      },
      processing: {
        score: 92,
        label: 'Mínimo',
        summary: 'Copos prensados al vapor, sin aditivos ni ultraprocesamiento.',
        nova: 1
      },
      additives: {
        score: 100,
        label: 'Sin aditivos',
        summary: '0 aditivos presentes en la composición.',
        count: 0
      }
    },
    pros: [
      '10 g de fibra por 100 g (rica en betaglucanos saciantes)',
      'Apenas 0,7 g de azúcar intrínseco (sin azúcares añadidos)',
      '13,5 g de proteína vegetal',
      'Ingrediente único y mínimamente procesado (NOVA 1)'
    ],
    cons: [
      'Contiene trazas de gluten naturales de la avena'
    ],
    serving: {
      standardUnit: '100 g',
      defaultServing: 40,
      servingUnit: 'g',
      per100g: {
        calories: 365,
        fat: 6.9,
        satFat: 1.2,
        carbs: 58.7,
        sugars: 0.7,
        fiber: 10.0,
        protein: 13.5,
        salt: 0.02
      },
      nutriScore: 'A'
    },
    ingredientsList: {
      rawText: '100% copos de avena integral procedentes de cultivo ecológico.',
      highlighted: [
        { name: 'copos de avena integral', type: 'neutral', note: '100% grano completo' },
        { name: 'avena', type: 'allergen', note: 'Puede contener gluten' }
      ],
      summary: 'Ingrediente único. Máxima sencillez y pureza nutricional.'
    },
    additivesList: [],
    processingDetail: {
      nova: 1,
      level: 'Mínimo',
      shortExplanation: 'El grano simplemente se limpia, se cuece brevemente al vapor y se lamina en rodillos.',
      whatMeans: 'Mantiene intactas todas las capas del grano: salvado, germen y endospermo.',
      notAutomaticallyBadNote: 'Clasificación ejemplar de alimento integral mínimamente modificado.'
    },
    categoryComparison: {
      categoryName: 'cereales de desayuno',
      percentile: 96,
      averages: {
        sugars: 18.0,
        fiber: 5.3,
        protein: 7.4,
        salt: 0.7
      },
      sugarDiffPercent: -96,
      fiberDiffPercent: 88,
      proteinDiffPercent: 82,
      saltDiffPercent: -97,
    },
    alternatives: [
      {
        productId: 'prod-cereales-choco-crunch',
        name: 'Cereales Choco Crunch',
        brand: 'BioNatur',
        score: 76,
        scoreLabel: 'Buena opción',
        reason: 'Alternativa con sabor chocolate si buscas algo crujiente',
        keyDifference: 'Tiene 12 g de azúcar pero conserva 8,2 g de fibra.',
        imageUrl: cerealImg
      }
    ],
    transparency: {
      source: 'Datos ficticios de demostración',
      lastUpdated: '18 agosto 2026',
      verifiedByFoodLens: false
    }
  },
  {
    id: 'prod-cereales-infantiles-azucarados',
    barcode: '8430000000025',
    name: 'Choco Puffs Mágicos',
    brand: 'CrunchyPuffs',
    quantity: '400 g',
    category: 'Cereales de desayuno',
    imageUrl: cerealImg,
    score: 38,
    scoreLabel: 'Ocasional',
    scoreSummary: 'Alto contenido de azúcares simples y harinas refinadas con varios aditivos y aromas sintéticos.',
    dimensions: {
      nutrition: {
        score: 34,
        label: 'Mejorable',
        summary: '28 g de azúcar por cada 100 g; el aporte de fibra y proteína es testimonial.'
      },
      ingredients: {
        score: 36,
        label: 'Mejorable',
        summary: 'Harina refinada de maíz, azúcar refinado, jarabe de glucosa y grasas hidrogenadas.'
      },
      processing: {
        score: 30,
        label: 'Muy alto',
        summary: 'Alimento altamente reconstituido e hinchado a presión con glaseado azucarado.',
        nova: 4
      },
      additives: {
        score: 52,
        label: 'Atención',
        summary: 'Contiene 4 aditivos entre colorantes sintéticos, conservantes y emulsionantes.',
        count: 4
      }
    },
    pros: [
      'Enriquecido artificialmente con hierro y vitaminas del complejo B'
    ],
    cons: [
      '28 g de azúcar añadido / 100 g (casi un tercio del producto)',
      'Harina de maíz refinada de rápida digestión',
      'Ultraprocesado NOVA 4 con jarabe de glucosa y emulsionantes',
      'Bajo en fibra saciante (2,1 g / 100 g)'
    ],
    serving: {
      standardUnit: '100 g',
      defaultServing: 30,
      servingUnit: 'g',
      per100g: {
        calories: 410,
        fat: 4.2,
        satFat: 2.1,
        carbs: 82.0,
        sugars: 28.0,
        fiber: 2.1,
        protein: 5.2,
        salt: 0.95
      },
      nutriScore: 'D'
    },
    ingredientsList: {
      rawText: 'Harina de maíz (62%), azúcar, jarabe de glucosa y fructosa, cacao desgrasado, aceite vegetal de palma, sal, aroma artificial, emulgente (mono y diglicéridos de ácidos grasos E471), colorante (caramelo amónico E150c), antioxidante (extracto rico en tocoferoles E306).',
      highlighted: [
        { name: 'azúcar', type: 'sugar', note: '2º ingrediente' },
        { name: 'jarabe de glucosa y fructosa', type: 'sugar', note: 'Azúcar libre de alta absorción' },
        { name: 'aceite vegetal de palma', type: 'palm', note: 'Alto en ácidos grasos saturados' },
        { name: 'E471', type: 'additive', note: 'Emulsionante sintético' },
        { name: 'E150c', type: 'additive', note: 'Colorante caramelo' }
      ],
      summary: 'Predominan harinas refinadas combinadas con dos fuentes de azúcar y aceite de palma.'
    },
    additivesList: [
      {
        code: 'E471',
        name: 'Mono y diglicéridos de ácidos grasos',
        function: 'Emulsionante',
        status: 'Autorizado en la UE',
        assessment: 'Uso generalizado; conviene vigilar en dietas altas en ultraprocesados.',
        riskLevel: 'moderate',
        evidenceNote: 'Estudios sugieren posible impacto en microbiota intestinal con exposición acumulativa alta.',
        concentrationKnown: false
      },
      {
        code: 'E150c',
        name: 'Caramelo amónico',
        function: 'Colorante marrón',
        status: 'Autorizado en la UE con IDA establecida',
        assessment: 'Consumo habitual moderado.',
        riskLevel: 'moderate',
        evidenceNote: 'Obtenido por calentamiento de azúcares con compuestos de amonio.',
        concentrationKnown: false
      }
    ],
    processingDetail: {
      nova: 4,
      level: 'Muy alto',
      shortExplanation: 'Fórmula basada en ingredientes refinados, jarabes y sustancias aromatizantes.',
      whatMeans: 'Diseñado industrialmente para máxima palatabilidad y larga caducidad.',
      notAutomaticallyBadNote: 'Aconsejable para consumo muy esporádico o festivo.'
    },
    categoryComparison: {
      categoryName: 'cereales de desayuno',
      percentile: 18,
      averages: {
        sugars: 18.0,
        fiber: 5.3,
        protein: 7.4,
        salt: 0.7
      },
      sugarDiffPercent: 55,
      fiberDiffPercent: -60,
      proteinDiffPercent: -30,
      saltDiffPercent: 36,
    },
    alternatives: [
      {
        productId: 'prod-cereales-choco-crunch',
        name: 'Cereales Choco Crunch',
        brand: 'BioNatur',
        score: 76,
        scoreLabel: 'Buena opción',
        reason: 'Mismo sabor a cacao con 57% menos azúcar',
        keyDifference: '16 g menos de azúcar y grano 100% integral.',
        imageUrl: cerealImg
      },
      {
        productId: 'prod-copos-avena-integral',
        name: 'Avena Integral en Copos',
        brand: 'NaturTierra',
        score: 94,
        scoreLabel: 'Excelente',
        reason: 'La mejor alternativa sin azúcar añadido',
        keyDifference: 'Cero azúcares libres y casi 5 veces más fibra.',
        imageUrl: cerealImg
      }
    ],
    transparency: {
      source: 'Datos ficticios de demostración',
      lastUpdated: '04 mayo 2026',
      verifiedByFoodLens: false
    }
  },
  {
    id: 'prod-yogur-griego-natural',
    barcode: '8414567890123',
    name: 'Yogur Griego Natural Artesanal',
    brand: 'Pastoret',
    quantity: '150 g',
    category: 'Lácteos y yogures',
    imageUrl: yogurtImg,
    score: 88,
    scoreLabel: 'Excelente',
    scoreSummary: 'Lácteo fermentado de gran pureza con fermentos vivos y sin azúcares añadidos.',
    dimensions: {
      nutrition: {
        score: 89,
        label: 'Muy buena',
        summary: 'Rico en proteínas lácteas de alto valor biológico y calcio biodisponible.'
      },
      ingredients: {
        score: 95,
        label: 'Excelente',
        summary: 'Leche entera pasteurizada, nata fresca y fermentos lácticos vivos.'
      },
      processing: {
        score: 90,
        label: 'Mínimo',
        summary: 'Fermentación tradicional natural sin desuerado químico.',
        nova: 1
      },
      additives: {
        score: 100,
        label: 'Sin aditivos',
        summary: '0 aditivos, espesantes ni almidones añadidos.',
        count: 0
      }
    },
    pros: [
      'Sin azúcar añadido (solo 3,8 g de lactosa natural)',
      '9,2 g de proteína por envase (saciante y nutritivo)',
      'Aporte natural de probióticos (Lactobacillus bulgaricus)',
      'Lista limpia con solo 3 ingredientes esenciales'
    ],
    cons: [
      'Contenido calórico moderado por nata láctea natural (125 kcal / 100 g)'
    ],
    serving: {
      standardUnit: '100 g',
      defaultServing: 150,
      servingUnit: 'g',
      per100g: {
        calories: 125,
        fat: 9.5,
        satFat: 6.2,
        carbs: 3.8,
        sugars: 3.8,
        fiber: 0.0,
        protein: 6.1,
        salt: 0.1
      },
      nutriScore: 'B'
    },
    ingredientsList: {
      rawText: 'Leche entera pasteurizada de vaca, nata fresca pasteurizada y fermentos lácticos vivos.',
      highlighted: [
        { name: 'Leche entera pasteurizada', type: 'neutral', note: 'Calcio y proteínas naturales' },
        { name: 'nata fresca', type: 'neutral', note: 'Aporta cremosidad natural' },
        { name: 'fermentos lácticos vivos', type: 'neutral', note: 'Bacterias probióticas beneficiosas' },
        { name: 'leche', type: 'allergen', note: 'Contiene lactosa' }
      ],
      summary: 'Receta tradicional sin azúcares, conservantes ni gelificantes.'
    },
    additivesList: [],
    processingDetail: {
      nova: 1,
      level: 'Mínimo',
      shortExplanation: 'Fermentación natural de leche fresca mediante cultivos vivos.',
      whatMeans: 'Proceso biológico ancestral que preserva e incrementa nutrientes y digestibilidad.',
      notAutomaticallyBadNote: 'Excelente ejemplo de alimento procesado de manera beneficiosa.'
    },
    categoryComparison: {
      categoryName: 'yogures y lácteos',
      percentile: 84,
      averages: {
        sugars: 9.8,
        fiber: 0.2,
        protein: 3.8,
        salt: 0.12
      },
      sugarDiffPercent: -61,
      fiberDiffPercent: 0,
      proteinDiffPercent: 60,
      saltDiffPercent: -17,
    },
    alternatives: [
      {
        productId: 'prod-yogur-desnatado-natural',
        name: 'Yogur Natural 0% Grasa',
        brand: 'Pastoret',
        score: 92,
        scoreLabel: 'Excelente',
        reason: 'Si prefieres menor aporte calórico',
        keyDifference: 'Menos grasas saturadas manteniendo fermentos vivos.',
        imageUrl: yogurtImg
      }
    ],
    transparency: {
      source: 'Datos ficticios de demostración',
      lastUpdated: '29 julio 2026',
      verifiedByFoodLens: false
    }
  },
  {
    id: 'prod-pan-artesanal-masa-madre',
    barcode: '8417778889991',
    name: 'Pan 100% Integral de Masa Madre',
    brand: 'Obrador Central',
    quantity: '500 g',
    category: 'Panadería y masas',
    imageUrl: breadImg,
    score: 91,
    scoreLabel: 'Excelente',
    scoreSummary: 'Fermentación lenta de 24 horas con harina de grano completo y agua de manantial.',
    dimensions: {
      nutrition: {
        score: 92,
        label: 'Muy buena',
        summary: '7,5 g de fibra por 100 g y liberación lenta de energía.'
      },
      ingredients: {
        score: 96,
        label: 'Excelente',
        summary: 'Solo 4 ingredientes nobles: harina integral, masa madre, agua y sal marina.'
      },
      processing: {
        score: 85,
        label: 'Artesanal',
        summary: 'Fermentación biológica lenta sin gasificantes químicos.',
        nova: 3
      },
      additives: {
        score: 100,
        label: 'Sin aditivos',
        summary: 'Sin mejorantes panarios ni conservantes de molde.',
        count: 0
      }
    },
    pros: [
      '100% harina de trigo integral molida a la piedra',
      'Masa madre viva con fermentación lenta de 24h',
      'Excelente índice de saciedad gracias a 7,5 g de fibra',
      'Sin azúcares añadidos ni grasas añadidas'
    ],
    cons: [
      'Contiene 1,1 g de sal / 100 g (nivel estándar en panadería tradicional)'
    ],
    serving: {
      standardUnit: '100 g',
      defaultServing: 50,
      servingUnit: 'g',
      per100g: {
        calories: 235,
        fat: 1.8,
        satFat: 0.3,
        carbs: 44.0,
        sugars: 1.2,
        fiber: 7.5,
        protein: 9.8,
        salt: 1.1
      },
      nutriScore: 'A'
    },
    ingredientsList: {
      rawText: 'Harina de trigo integral ecológica (65%), agua, masa madre natural de trigo (20%), sal marina.',
      highlighted: [
        { name: 'Harina de trigo integral ecológica', type: 'neutral', note: 'Grano completo con salvado y germen' },
        { name: 'masa madre natural', type: 'neutral', note: 'Cultivo natural de levaduras y lactobacilos' },
        { name: 'trigo', type: 'allergen', note: 'Contiene gluten' }
      ],
      summary: 'Fórmula pura de panadería limpia. Ausencia total de conservantes o alcohol de conservación.'
    },
    additivesList: [],
    processingDetail: {
      nova: 3,
      level: 'Elaborado',
      shortExplanation: 'Alimento procesado mediante técnica culinaria clásica de fermentación y horneado.',
      whatMeans: 'La combinación de ingredientes simples produce una digestión óptima y biodisponibilidad mineral.',
      notAutomaticallyBadNote: 'Procesamiento culinario positivo que mejora la absorción de nutrientes.'
    },
    categoryComparison: {
      categoryName: 'panes y tostadas',
      percentile: 89,
      averages: {
        sugars: 3.4,
        fiber: 3.8,
        protein: 7.6,
        salt: 1.3
      },
      sugarDiffPercent: -65,
      fiberDiffPercent: 97,
      proteinDiffPercent: 29,
      saltDiffPercent: -15,
    },
    alternatives: [
      {
        productId: 'prod-pan-centeno-puro',
        name: 'Pan Alemán de Centeno Integral',
        brand: 'Mestemacher',
        score: 93,
        scoreLabel: 'Excelente',
        reason: 'Aún más fibra y menor índice glucémico',
        keyDifference: '9,5 g de fibra / 100 g.',
        imageUrl: breadImg
      }
    ],
    transparency: {
      source: 'Datos ficticios de demostración',
      lastUpdated: '10 agosto 2026',
      verifiedByFoodLens: false
    }
  },
  {
    id: 'prod-pan-molde-blanco',
    barcode: '8415555444333',
    name: 'Pan de Molde Blanco Tierno',
    brand: 'PanBlanco Panett',
    quantity: '450 g',
    category: 'Panadería y masas',
    imageUrl: breadImg,
    score: 48,
    scoreLabel: 'Mejorable',
    scoreSummary: 'Elaborado con harinas refinadas, aceite de palma y emulgentes para textura esponjosa.',
    dimensions: {
      nutrition: {
        score: 51,
        label: 'Mejorable',
        summary: 'Poca fibra (1,9 g), azúcares añadidos y harinas de absorción rápida.'
      },
      ingredients: {
        score: 46,
        label: 'Mejorable',
        summary: 'Contiene azúcar, grasa de palma y varios mejorantes industriales.'
      },
      processing: {
        score: 42,
        label: 'Alto',
        summary: 'Pan industrial con conservantes para mantener humedad semanas.',
        nova: 4
      },
      additives: {
        score: 54,
        label: 'Atención',
        summary: '3 aditivos: E471, E282 y E300.',
        count: 3
      }
    },
    pros: [
      'Textura muy blanda y fácil masticación para niños'
    ],
    cons: [
      '3,8 g de azúcar añadido para dorar la corteza',
      'Harina de trigo refinada sin salvado ni germen',
      'Contiene propionato cálcico (E282) como conservante antifúngico',
      'Baja capacidad saciante'
    ],
    serving: {
      standardUnit: '100 g',
      defaultServing: 50,
      servingUnit: 'g',
      per100g: {
        calories: 260,
        fat: 3.5,
        satFat: 1.1,
        carbs: 48.0,
        sugars: 3.8,
        fiber: 1.9,
        protein: 7.5,
        salt: 1.2
      },
      nutriScore: 'C'
    },
    ingredientsList: {
      rawText: 'Harina de trigo refinada, agua, azúcar, aceite de palma fraccionado, levadura, sal, emulgentes (E471, E481), conservador (propionato cálcico E282), agente de tratamiento de la harina (ácido ascórbico E300).',
      highlighted: [
        { name: 'azúcar', type: 'sugar', note: 'Azúcar añadido' },
        { name: 'aceite de palma', type: 'palm', note: 'Grasa saturada' },
        { name: 'E282', type: 'additive', note: 'Conservante antifúngico' },
        { name: 'E471', type: 'additive', note: 'Emulsionante de textura' }
      ],
      summary: 'Pan industrial con aditivos para extender vida útil y azúcares añadidos.'
    },
    additivesList: [
      {
        code: 'E282',
        name: 'Propionato cálcico',
        function: 'Conservante antifúngico',
        status: 'Autorizado en la UE',
        assessment: 'Uso aprobado; puede causar sensibilidad en personas susceptibles.',
        riskLevel: 'moderate',
        evidenceNote: 'Inhibe el moho en panes embolsados industriales.',
        concentrationKnown: false
      }
    ],
    processingDetail: {
      nova: 4,
      level: 'Alto',
      shortExplanation: 'Elaboración con grasas hidrogenadas y mejorantes industriales.',
      whatMeans: 'Optimizado para vida comercial prolongada y volumen.',
      notAutomaticallyBadNote: 'Adecuado como consumo ocasional, preferir grano entero en uso diario.'
    },
    categoryComparison: {
      categoryName: 'panes y tostadas',
      percentile: 32,
      averages: {
        sugars: 3.4,
        fiber: 3.8,
        protein: 7.6,
        salt: 1.3
      },
      sugarDiffPercent: 12,
      fiberDiffPercent: -50,
      proteinDiffPercent: -1,
      saltDiffPercent: -8,
    },
    alternatives: [
      {
        productId: 'prod-pan-artesanal-masa-madre',
        name: 'Pan 100% Integral Masa Madre',
        brand: 'Obrador Central',
        score: 91,
        scoreLabel: 'Excelente',
        reason: '4 veces más fibra y sin conservantes',
        keyDifference: 'Masa madre tradicional con solo 4 ingredientes.',
        imageUrl: breadImg
      }
    ],
    transparency: {
      source: 'Datos ficticios de demostración',
      lastUpdated: '15 julio 2026',
      verifiedByFoodLens: false
    }
  },
  {
    id: 'prod-aceite-oliva-virgen-extra',
    barcode: '8410000998877',
    name: 'Aceite de Oliva Virgen Extra Ecológico',
    brand: 'Hacienda Verde',
    quantity: '750 ml',
    category: 'Aceites y grasas saludables',
    imageUrl: oilImg,
    score: 95,
    scoreLabel: 'Excelente',
    scoreSummary: 'Puro zumo de aceitunas arbequinas prensadas en frío el mismo día de la cosecha.',
    dimensions: {
      nutrition: {
        score: 94,
        label: 'Excelente',
        summary: 'Fuente excepcional de ácido oleico monoinsaturado, vitamina E y polifenoles.'
      },
      ingredients: {
        score: 100,
        label: 'Excelente',
        summary: '100% aceite de oliva virgen extra de primera presión mecánica.'
      },
      processing: {
        score: 98,
        label: 'Mínimo',
        summary: 'Extracción mecánica en frío (< 27 °C) sin refino ni disolventes.',
        nova: 1
      },
      additives: {
        score: 100,
        label: 'Sin aditivos',
        summary: 'Cero aditivos ni antioxidantes sintéticos.',
        count: 0
      }
    },
    pros: [
      'Grasa cardiosaludable rica en ácido oleico (75%)',
      'Alto contenido en antioxidantes naturales y polifenoles',
      'Extracción en frío exclusivamente por medios mecánicos',
      'Cero sodio, cero azúcares'
    ],
    cons: [
      'Calóricamente denso (900 kcal / 100 ml), dosificar según gasto energético'
    ],
    serving: {
      standardUnit: '100 ml',
      defaultServing: 15,
      servingUnit: 'ml',
      per100g: {
        calories: 900,
        fat: 100.0,
        satFat: 14.0,
        carbs: 0.0,
        sugars: 0.0,
        fiber: 0.0,
        protein: 0.0,
        salt: 0.0
      },
      nutriScore: 'B'
    },
    ingredientsList: {
      rawText: '100% Aceite de oliva virgen extra de cultivo ecológico controlado.',
      highlighted: [
        { name: 'Aceite de oliva virgen extra', type: 'neutral', note: 'Puro zumo de aceituna mecánica' }
      ],
      summary: 'Ingrediente único. Producto icono de la dieta mediterránea.'
    },
    additivesList: [],
    processingDetail: {
      nova: 1,
      level: 'Mínimo',
      shortExplanation: 'Molturación y centrifugación mecánica en frío.',
      whatMeans: 'No sufre procesos de decoloración ni desodorización con disolventes.',
      notAutomaticallyBadNote: 'Procesamiento mecánico limpio.'
    },
    categoryComparison: {
      categoryName: 'aceites y condimentos',
      percentile: 98,
      averages: {
        sugars: 0.0,
        fiber: 0.0,
        protein: 0.0,
        salt: 0.0
      },
      sugarDiffPercent: 0,
      fiberDiffPercent: 0,
      proteinDiffPercent: 0,
      saltDiffPercent: 0,
    },
    alternatives: [],
    transparency: {
      source: 'Datos ficticios de demostración',
      lastUpdated: '01 septiembre 2026',
      verifiedByFoodLens: false
    }
  },
  {
    id: 'prod-hummus-clasico-aove',
    barcode: '8435000112233',
    name: 'Hummus Clásico con AOVE',
    brand: 'SaborMediterráneo',
    quantity: '220 g',
    category: 'Platos preparados y snacks',
    imageUrl: cerealImg,
    score: 86,
    scoreLabel: 'Excelente',
    scoreSummary: 'Garbanzos cocidos con pasta de sésamo (tahini), aceite de oliva virgen extra y limón.',
    dimensions: {
      nutrition: {
        score: 88,
        label: 'Muy buena',
        summary: 'Rico en fibra vegetal, hierro y grasas saludables poliinsaturadas.'
      },
      ingredients: {
        score: 89,
        label: 'Muy buena',
        summary: 'Garbanzos (60%), tahini (15%), AOVE (10%), zumo de limón y sal.'
      },
      processing: {
        score: 80,
        label: 'Culinario',
        summary: 'Triturado y pasteurizado suave sin texturizantes artificiales.',
        nova: 3
      },
      additives: {
        score: 90,
        label: 'Sin preocupación relevante',
        summary: 'Solo antioxidante natural (ácido cítrico E330).',
        count: 1
      }
    },
    pros: [
      'Fuente natural de fibra (6,4 g / 100 g)',
      'Grasas cardiosaludables de sésamo y AOVE',
      'Sin azúcares añadidos (solo 0,8 g naturales)',
      '6,8 g de proteína vegetal'
    ],
    cons: [
      'Contiene sésamo (alérgeno de declaración obligatoria)'
    ],
    serving: {
      standardUnit: '100 g',
      defaultServing: 40,
      servingUnit: 'g',
      per100g: {
        calories: 245,
        fat: 17.5,
        satFat: 2.4,
        carbs: 11.2,
        sugars: 0.8,
        fiber: 6.4,
        protein: 6.8,
        salt: 0.85
      },
      nutriScore: 'B'
    },
    ingredientsList: {
      rawText: 'Garbanzos cocidos (62%), tahini (pasta de sésamo 15%), aceite de oliva virgen extra (10%), agua, zumo de limón, sal marina, ajo fresco, acidulante (ácido cítrico E330).',
      highlighted: [
        { name: 'Garbanzos cocidos', type: 'neutral', note: 'Legumbre rica en fibra' },
        { name: 'tahini', type: 'allergen', note: 'Semillas de sésamo (alérgeno)' },
        { name: 'aceite de oliva virgen extra', type: 'neutral', note: 'Grasa monoinsaturada' },
        { name: 'ácido cítrico E330', type: 'additive', note: 'Acidulante natural idéntico al del limón' }
      ],
      summary: 'Receta casera pasteurizada de base legumbre con aceite virgen extra.'
    },
    additivesList: [
      {
        code: 'E330',
        name: 'Ácido cítrico',
        function: 'Acidulante y conservador natural',
        status: 'Autorizado en la UE',
        assessment: 'Completamente seguro e inocuo.',
        riskLevel: 'safe',
        evidenceNote: 'Intermediario del metabolismo celular humano.',
        concentrationKnown: false
      }
    ],
    processingDetail: {
      nova: 3,
      level: 'Culinario',
      shortExplanation: 'Elaboración mediante cocción y emulsión mecánica.',
      whatMeans: 'Composición similar a la preparación doméstica tradicional.',
      notAutomaticallyBadNote: 'Excelente opción de snack y picoteo saciante.'
    },
    categoryComparison: {
      categoryName: 'untables y dips',
      percentile: 86,
      averages: {
        sugars: 3.5,
        fiber: 2.2,
        protein: 3.1,
        salt: 1.2
      },
      sugarDiffPercent: -77,
      fiberDiffPercent: 190,
      proteinDiffPercent: 119,
      saltDiffPercent: -29,
    },
    alternatives: [],
    transparency: {
      source: 'Datos ficticios de demostración',
      lastUpdated: '22 agosto 2026',
      verifiedByFoodLens: false
    }
  },
  {
    id: 'prod-refresco-cola-clasico',
    barcode: '8400000000077',
    name: 'Refresco de Cola Tradicional',
    brand: 'SparkCola',
    quantity: '330 ml',
    category: 'Bebidas y refrescos',
    imageUrl: cerealImg,
    score: 22,
    scoreLabel: 'Ocasional',
    scoreSummary: 'Bebida azucarada con 35 g de azúcar por lata (10,6 g / 100 ml), cafeína y ácido fosfórico.',
    dimensions: {
      nutrition: {
        score: 18,
        label: 'Ocasional',
        summary: 'Calorías vacías de absorción ultra-rápida. Cero fibra y cero proteína.'
      },
      ingredients: {
        score: 22,
        label: 'Mejorable',
        summary: 'Agua carbonatada, jarabe de glucosa-fructosa, azúcar y acidulantes.'
      },
      processing: {
        score: 15,
        label: 'Muy alto',
        summary: 'Formulación sintética con caramelo sulfito amónico y cafeína.',
        nova: 4
      },
      additives: {
        score: 35,
        label: 'Moderación',
        summary: 'Ácido fosfórico (E338) y colorante caramelo E150d.',
        count: 2
      }
    },
    pros: [
      'Sensación refrescante e hidratante inmediata'
    ],
    cons: [
      '35 g de azúcares libres por lata de 330 ml (supera el límite diario de la OMS)',
      'Ácido fosfórico desmineralizante del esmalte dental',
      'Ultraprocesado NOVA 4 sin micronutrientes útiles'
    ],
    serving: {
      standardUnit: '100 ml',
      defaultServing: 330,
      servingUnit: 'ml',
      per100g: {
        calories: 42,
        fat: 0.0,
        satFat: 0.0,
        carbs: 10.6,
        sugars: 10.6,
        fiber: 0.0,
        protein: 0.0,
        salt: 0.01
      },
      nutriScore: 'E'
    },
    ingredientsList: {
      rawText: 'Agua carbonatada, azúcar, jarabe de glucosa y fructosa, colorante caramelo de sulfito amónico (E150d), acidulante ácido fosfórico (E338), aromas naturales (incluye cafeína).',
      highlighted: [
        { name: 'azúcar', type: 'sugar', note: 'Azúcar refinado' },
        { name: 'jarabe de glucosa y fructosa', type: 'sugar', note: 'Azúcar libre de absorción inmediata' },
        { name: 'E150d', type: 'additive', note: 'Caramelo sulfito amónico' },
        { name: 'E338', type: 'additive', note: 'Ácido fosfórico' }
      ],
      summary: 'Agua carbonatada saturada de azúcares libres y acidulantes.'
    },
    additivesList: [
      {
        code: 'E338',
        name: 'Ácido fosfórico',
        function: 'Acidulante y conservador',
        status: 'Autorizado en la UE con ingesta diaria admisible',
        assessment: 'Conviene moderar la exposición frecuente.',
        riskLevel: 'caution',
        evidenceNote: 'El consumo excesivo de fosfatos puede desequilibrar la ratio calcio-fósforo.',
        concentrationKnown: false
      },
      {
        code: 'E150d',
        name: 'Caramelo de sulfito amónico',
        function: 'Colorante marrón',
        status: 'Autorizado en la UE',
        assessment: 'Seguro en dosis reguladas, presente en refrescos oscuros.',
        riskLevel: 'moderate',
        evidenceNote: 'Evaluado periódicamente por la EFSA.',
        concentrationKnown: false
      }
    ],
    processingDetail: {
      nova: 4,
      level: 'Muy alto',
      shortExplanation: 'Bebida 100% sintética obtenida por disolución de jarabes y gas carbónico.',
      whatMeans: 'No contiene ingredientes de origen natural intacto.',
      notAutomaticallyBadNote: 'Consumo recomendable únicamente de forma muy esporádica.'
    },
    categoryComparison: {
      categoryName: 'refrescos carbonatados',
      percentile: 24,
      averages: {
        sugars: 8.5,
        fiber: 0.0,
        protein: 0.0,
        salt: 0.02
      },
      sugarDiffPercent: 25,
      fiberDiffPercent: 0,
      proteinDiffPercent: 0,
      saltDiffPercent: -50,
    },
    alternatives: [
      {
        productId: 'prod-agua-con-gas-limon',
        name: 'Agua Mineral con Gas e Infusión de Limón',
        brand: 'FontClara',
        score: 96,
        scoreLabel: 'Excelente',
        reason: '0 azúcares y máxima hidratación',
        keyDifference: 'Sin azúcar, sin calorías y sin ácido fosfórico.',
        imageUrl: cerealImg
      }
    ],
    transparency: {
      source: 'Datos ficticios de demostración',
      lastUpdated: '14 junio 2026',
      verifiedByFoodLens: false
    }
  },
  {
    id: 'prod-pizza-cuatro-quesos',
    barcode: '8489999000111',
    name: 'Pizza Masa Fina Cuatro Quesos',
    brand: 'BuonaPasta',
    quantity: '400 g',
    category: 'Platos preparados y pizzas',
    imageUrl: cerealImg,
    score: 44,
    scoreLabel: 'Mejorable',
    scoreSummary: 'Alto contenido en sal (1,8 g / 100 g) y grasas saturadas derivadas de quesos procesados.',
    dimensions: {
      nutrition: {
        score: 42,
        label: 'Mejorable',
        summary: 'Elevada densidad calórica, 8 g de grasas saturadas y sal en el umbral alto.'
      },
      ingredients: {
        score: 48,
        label: 'Mejorable',
        summary: 'Harina refinada, mezcla de quesos con sales fundentes y aceite de girasol.'
      },
      processing: {
        score: 45,
        label: 'Alto',
        summary: 'Precocinado industrial con conservantes para masa refrigerada.',
        nova: 4
      },
      additives: {
        score: 49,
        label: 'Moderación',
        summary: 'Contiene 3 aditivos entre almidones modificados y sales fundentes.',
        count: 3
      }
    },
    pros: [
      'Aporte notable de proteínas lácteas (11 g / 100 g)'
    ],
    cons: [
      '1,8 g de sal por 100 g (7,2 g de sal en la pizza entera)',
      '8,4 g de grasas saturadas por 100 g',
      'Ultraprocesado NOVA 4 con sales fundentes'
    ],
    serving: {
      standardUnit: '100 g',
      defaultServing: 200,
      servingUnit: 'g',
      per100g: {
        calories: 285,
        fat: 13.5,
        satFat: 8.4,
        carbs: 29.0,
        sugars: 2.1,
        fiber: 1.8,
        protein: 11.0,
        salt: 1.8
      },
      nutriScore: 'D'
    },
    ingredientsList: {
      rawText: 'Harina de trigo, agua, salsa de tomate, quesos (24%): mozzarella, gouda, emmental, gorgonzola (leche, sal, fermentos lácticos, cuajo, sales fundentes E339, E452), aceite de girasol, levadura, almidón modificado E1422, orégano.',
      highlighted: [
        { name: 'quesos', type: 'allergen', note: 'Contiene leche y derivados' },
        { name: 'sales fundentes E339, E452', type: 'additive', note: 'Fosfatos fundentes' },
        { name: 'almidón modificado E1422', type: 'additive', note: 'Espesante' },
        { name: 'trigo', type: 'allergen', note: 'Gluten' }
      ],
      summary: 'Masa de harina blanca con quesos fundidos comerciales y conservadores.'
    },
    additivesList: [
      {
        code: 'E452',
        name: 'Polifosfatos',
        function: 'Sales fundentes y emulsionantes',
        status: 'Autorizado en la UE con IDA',
        assessment: 'Conviene moderar la exposición frecuente.',
        riskLevel: 'moderate',
        evidenceNote: 'Utilizado para fundir quesos homogéneamente.',
        concentrationKnown: false
      }
    ],
    processingDetail: {
      nova: 4,
      level: 'Alto',
      shortExplanation: 'Precocinado con ingredientes recombinados y estabilizantes.',
      whatMeans: 'Plato preparado para calentar en horno doméstico.',
      notAutomaticallyBadNote: 'Opción cómoda pero que conviene compensar con ensaladas frescas.'
    },
    categoryComparison: {
      categoryName: 'pizzas y platos preparados',
      percentile: 41,
      averages: {
        sugars: 2.8,
        fiber: 2.1,
        protein: 9.8,
        salt: 1.5
      },
      sugarDiffPercent: -25,
      fiberDiffPercent: -14,
      proteinDiffPercent: 12,
      saltDiffPercent: 20,
    },
    alternatives: [],
    transparency: {
      source: 'Datos ficticios de demostración',
      lastUpdated: '19 agosto 2026',
      verifiedByFoodLens: false
    }
  },
  {
    id: 'prod-frutos-secos-tostados',
    barcode: '8470000000088',
    name: 'Mix de Frutos Secos Tostados sin Sal',
    brand: 'Almendra & Nuez Bio',
    quantity: '200 g',
    category: 'Snacks y frutos secos',
    imageUrl: cerealImg,
    score: 92,
    scoreLabel: 'Excelente',
    scoreSummary: 'Almendras, nueces, anacardos y avellanas tostados al horno sin sal ni aceites añadidos.',
    dimensions: {
      nutrition: {
        score: 91,
        label: 'Excelente',
        summary: 'Gran densidad de ácidos grasos omega-3 y omega-9, magnesio, fósforo y vitamina E.'
      },
      ingredients: {
        score: 98,
        label: 'Excelente',
        summary: '100% frutos secos nobles ecológicos tostados con piel.'
      },
      processing: {
        score: 93,
        label: 'Mínimo',
        summary: 'Tostado tradicional por aire caliente, sin fritura ni añadidos.',
        nova: 1
      },
      additives: {
        score: 100,
        label: 'Sin aditivos',
        summary: 'Cero aditivos ni aromas.',
        count: 0
      }
    },
    pros: [
      'Cero sal añadida (solo 0,02 g natural)',
      'Excelente fuente de fibra saciante (8,5 g / 100 g)',
      '18 g de proteína vegetal',
      'Alto contenido en grasas poliinsaturadas protectoras'
    ],
    cons: [
      'Alimento muy energético (620 kcal / 100 g), ración recomendada: 30 g'
    ],
    serving: {
      standardUnit: '100 g',
      defaultServing: 30,
      servingUnit: 'g',
      per100g: {
        calories: 620,
        fat: 54.0,
        satFat: 5.8,
        carbs: 12.0,
        sugars: 4.1,
        fiber: 8.5,
        protein: 18.0,
        salt: 0.02
      },
      nutriScore: 'A'
    },
    ingredientsList: {
      rawText: 'Almendras con piel tostadas (35%), nueces en mitades (25%), avellanas tostadas (20%), anacardos tostados (20%). Cultivo ecológico.',
      highlighted: [
        { name: 'Almendras', type: 'allergen', note: 'Frutos de cáscara' },
        { name: 'nueces', type: 'allergen', note: 'Frutos de cáscara (omega-3)' },
        { name: 'avellanas', type: 'allergen', note: 'Frutos de cáscara' },
        { name: 'anacardos', type: 'allergen', note: 'Frutos de cáscara' }
      ],
      summary: 'Frutos secos puros tostados por aire. Cero ingredientes secundarios.'
    },
    additivesList: [],
    processingDetail: {
      nova: 1,
      level: 'Mínimo',
      shortExplanation: 'Descascarado y tostado por convección de aire.',
      whatMeans: 'No utiliza aceites de freír ni baños de sal.',
      notAutomaticallyBadNote: 'Procesamiento limpio que realza el aroma natural.'
    },
    categoryComparison: {
      categoryName: 'frutos secos y snacks',
      percentile: 94,
      averages: {
        sugars: 5.2,
        fiber: 6.1,
        protein: 14.5,
        salt: 0.95
      },
      sugarDiffPercent: -21,
      fiberDiffPercent: 39,
      proteinDiffPercent: 24,
      saltDiffPercent: -98,
    },
    alternatives: [],
    transparency: {
      source: 'Datos ficticios de demostración',
      lastUpdated: '05 septiembre 2026',
      verifiedByFoodLens: false
    }
  }
];

// Helper to compute personalized fit score (0-100) based on active user goals
export function calculatePersonalFit(product: Product, activeGoals: string[]): {
  score: number;
  fitLabel: string;
  reasons: string[];
  caveats: string[];
} {
  if (!activeGoals || activeGoals.length === 0) {
    return {
      score: product.score,
      fitLabel: 'Configura tus objetivos para personalizar',
      reasons: [],
      caveats: []
    };
  }

  let delta = 0;
  const reasons: string[] = [];
  const caveats: string[] = [];

  const per100g = product.serving.per100g;

  if (activeGoals.includes('reduce_sugar')) {
    if (per100g.sugars <= 5) {
      delta += 14;
      reasons.push('Muy bajo en azúcar (' + per100g.sugars + ' g / 100 g)');
    } else if (per100g.sugars > 15) {
      delta -= 16;
      caveats.push('Alto en azúcares (' + per100g.sugars + ' g / 100 g)');
    } else {
      reasons.push('Nivel moderado de azúcar (' + per100g.sugars + ' g / 100 g)');
    }
  }

  if (activeGoals.includes('increase_fiber')) {
    if (per100g.fiber >= 6) {
      delta += 14;
      reasons.push('Excelente aporte de fibra (' + per100g.fiber + ' g / 100 g)');
    } else if (per100g.fiber < 2) {
      delta -= 8;
      caveats.push('Pobre en fibra (' + per100g.fiber + ' g)');
    }
  }

  if (activeGoals.includes('increase_protein')) {
    if (per100g.protein >= 10) {
      delta += 12;
      reasons.push('Alto en proteína (' + per100g.protein + ' g / 100 g)');
    } else if (per100g.protein < 3) {
      delta -= 6;
      caveats.push('Aporte proteico bajo (' + per100g.protein + ' g)');
    }
  }

  if (activeGoals.includes('reduce_salt')) {
    if (per100g.salt <= 0.4) {
      delta += 10;
      reasons.push('Bajo contenido en sal (' + per100g.salt + ' g / 100 g)');
    } else if (per100g.salt >= 1.2) {
      delta -= 14;
      caveats.push('Contenido de sal elevado (' + per100g.salt + ' g / 100 g)');
    }
  }

  if (activeGoals.includes('avoid_ultraprocessed')) {
    if (product.dimensions.processing.nova <= 2) {
      delta += 15;
      reasons.push('Alimento mínimamente procesado (NOVA ' + product.dimensions.processing.nova + ')');
    } else if (product.dimensions.processing.nova === 4) {
      delta -= 18;
      caveats.push('Producto ultraprocesado industrial (NOVA 4)');
    }
  }

  if (activeGoals.includes('reduce_sat_fat')) {
    if (per100g.satFat <= 1.5) {
      delta += 10;
      reasons.push('Bajo en grasas saturadas (' + per100g.satFat + ' g)');
    } else if (per100g.satFat >= 5) {
      delta -= 12;
      caveats.push('Grasas saturadas a vigilar (' + per100g.satFat + ' g)');
    }
  }

  let finalScore = Math.max(10, Math.min(99, Math.round(product.score + delta)));
  
  let fitLabel = 'Encaje óptimo con tus metas';
  if (finalScore >= 85) fitLabel = 'Encaja especialmente bien contigo';
  else if (finalScore >= 70) fitLabel = 'Buen encaje con tus objetivos';
  else if (finalScore >= 50) fitLabel = 'Encaje moderado';
  else fitLabel = 'Poco alineado con tus objetivos actuales';

  return {
    score: finalScore,
    fitLabel,
    reasons: reasons.slice(0, 3),
    caveats: caveats.slice(0, 2)
  };
}
