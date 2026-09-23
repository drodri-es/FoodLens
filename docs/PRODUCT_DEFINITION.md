# FoodLens — PWA mobile-first de análisis y comparación de alimentos

Aplicación web mobile-first instalable como PWA para escanear productos alimentarios por código de barras, analizar su perfil nutricional, ingredientes, procesamiento y aditivos, compararlos con productos similares y ofrecer recomendaciones transparentes y personalizadas.

La aplicación debe priorizar:

* rapidez;
* claridad;
* transparencia;
* explicación comprensible;
* ausencia de alarmismo;
* separación clara entre datos originales, cálculos propios e información personalizada.

El objetivo no es únicamente asignar una nota a un alimento, sino ayudar al usuario a comprender:

1. qué contiene;
2. cómo es nutricionalmente;
3. cómo está procesado;
4. qué aditivos contiene;
5. cómo se compara con productos similares;
6. y, más adelante, cómo encaja con sus objetivos personales.

---

# 1. Tipo de aplicación

**Progressive Web App mobile-first**, instalable en iOS y Android.

Debe estar diseñada desde el principio para poder evolucionar posteriormente hacia una app empaquetada con **Capacitor**, reutilizando el frontend React existente.

El acceso a cámara debe realizarse mediante una abstracción independiente del frontend para evitar dependencia directa de una tecnología concreta.

Estrategia de escáner:

1. `BarcodeDetector` cuando esté disponible.
2. `@zxing/browser` como fallback.
3. Entrada manual del código como último fallback.

Crear una interfaz interna similar a:

```typescript
interface BarcodeScanner {
  start(): Promise<void>
  stop(): void
  onDetected(code: string): void
}
```

Con implementaciones:

```text
BarcodeDetectorScanner
ZXingScanner
ManualScanner
```

La UI no debe conocer qué motor está utilizando.

---

# 2. Público objetivo

Consumidores que quieren comprender qué comen y tomar mejores decisiones de compra.

No debe dirigirse solamente a usuarios expertos en nutrición.

FoodLens debe transformar información compleja en respuestas sencillas como:

* "Tiene menos azúcar que la mayoría de productos similares."
* "Tiene mucha fibra."
* "Contiene tres aditivos autorizados."
* "La información disponible es incompleta."
* "Esta alternativa tiene menos azúcar y más fibra."

El tono debe ser informativo y neutral.

Evitar mensajes como:

* "producto tóxico";
* "alimento peligroso";
* "ingrediente malo";
* "debes evitarlo".

---

# 3. Principio fundamental de arquitectura

FoodLens debe manejar tres capas completamente separadas:

```text
PRODUCTO
   │
   ├── DATA
   │      Datos originales del producto
   │      Open Food Facts / fabricante
   │
   ├── ANALYSIS
   │      Cálculos y scoring FoodLens
   │
   └── PERSONAL
          Preferencias y objetivos del usuario
```

La aplicación debe indicar claramente al usuario qué información pertenece a cada capa.

---

# 4. Fase 1 — MVP

El MVP debe permitir completar este flujo:

```text
Abrir app
   ↓
Escanear código
   ↓
Buscar producto
   ↓
Normalizar datos
   ↓
Comprobar completitud
   ↓
Calcular análisis FoodLens
   ↓
Mostrar ficha
   ↓
Comparar con otro producto
   ↓
Guardar en historial/favoritos
```

---

# 5. Pantallas del MVP

## Onboarding

Máximo 3 slides.

Explicar:

1. Escanea cualquier alimento.
2. Entiende nutrición, ingredientes, procesamiento y aditivos.
3. Compara productos y encuentra diferencias relevantes.

No obligar a registrarse.

CTA:

**Escanear mi primer producto**

---

## Home

Mostrar:

* saludo;
* CTA principal "Escanear producto";
* últimos escaneos reales;
* favoritos;
* acceso rápido a comparar productos;
* buscador;
* estado vacío bien diseñado si el usuario todavía no ha escaneado nada.

No precargar historial ficticio en producción.

Los datos mock solo deben utilizarse en modo demo/desarrollo.

---

## Escáner

Pantalla completa.

Debe soportar:

* EAN-13;
* EAN-8;
* UPC;
* QR;
* DataMatrix;
* GS1 Digital Link cuando sea posible.

Fallback:

* ZXing;
* introducción manual del código.

Al detectar un código:

* feedback visual;
* vibración/haptic cuando el dispositivo lo permita;
* pequeña animación;
* consulta automática.

---

## Producto no encontrado

Si el código ya se ha escaneado, no pedirlo de nuevo.

Mostrar:

```text
No encontramos este producto

Código:
8412345678901
```

Opciones:

**Añadir producto**

**Buscar otro producto**

En MVP, "Añadir producto" puede permitir introducir manualmente:

* nombre;
* marca;
* categoría;
* cantidad;
* tabla nutricional;
* ingredientes.

El OCR se implementará posteriormente.

---

# 6. Open Food Facts

Utilizar Open Food Facts como fuente principal de información de producto.

Para lectura individual de productos utilizar preferentemente **API v3**.

Utilizar API v2 únicamente en funcionalidades todavía no cubiertas adecuadamente por v3, por ejemplo determinadas búsquedas o consultas por categoría.

Nunca consumir directamente el JSON de Open Food Facts desde la UI.

Debe existir obligatoriamente:

```text
Open Food Facts
      ↓
OFF Adapter
      ↓
Product Normalizer
      ↓
FoodLensProduct
      ↓
Scoring Engine
      ↓
Frontend
```

---

# 7. Modelo interno normalizado

Crear un modelo propio independiente de Open Food Facts.

Ejemplo:

```typescript
type FoodLensProduct = {
  barcode: string

  name: string
  brand?: string
  quantity?: string
  category?: string

  nutrition: {
    energyKcal?: number
    sugars?: number
    saturatedFat?: number
    salt?: number
    fiber?: number
    protein?: number
  }

  ingredients?: Ingredient[]

  additives?: Additive[]

  allergens?: string[]

  nova?: 1 | 2 | 3 | 4

  nutriScore?: string

  completeness: number

  source: {
    provider: string
    updatedAt?: string
  }
}
```

El frontend únicamente debe utilizar `FoodLensProduct`.

Nunca depender directamente del esquema de Open Food Facts.

---

# 8. Caché de productos desde el MVP

Implementar caché desde la primera versión.

Flujo:

```text
EAN
 ↓
FoodLens DB
 ↓
¿Producto cacheado?
 ├── Sí → devolver
 └── No
       ↓
    Open Food Facts
       ↓
    normalizar
       ↓
    guardar
       ↓
    devolver
```

Esto permite:

* reducir dependencia de Open Food Facts;
* mejorar velocidad;
* evitar rate limits;
* disponer de productos usados frecuentemente;
* recalcular scores posteriormente.

Guardar también:

```text
source_updated_at
cached_at
```

Para poder refrescar productos antiguos.

---

# 9. Persistencia

Preferir:

**PostgreSQL + JSONB**

frente a MongoDB.

Entidades principales:

```text
users
products
product_sources
product_scores
scans
favorites
preferences
goals
additives
baskets
basket_items
```

Los datos originales procedentes de Open Food Facts deben estar separados de los cálculos propios de FoodLens.

Ejemplo:

```text
off_products
foodlens_product_analysis
users
scans
favorites
preferences
```

---

# 10. Licencia y procedencia de los datos

Diseñar la base de datos teniendo en cuenta que Open Food Facts utiliza licencia ODbL.

Mantener claramente diferenciados:

### Datos derivados de Open Food Facts

```text
off_products
```

### Datos propios FoodLens

```text
foodlens_scores
foodlens_additives
foodlens_analysis
```

### Datos del usuario

```text
users
scans
favorites
goals
preferences
```

La UI debe mostrar:

```text
Fuente:
Open Food Facts
```

cuando corresponda.

---

# 11. Completitud de datos

FoodLens nunca debe asumir que un valor ausente equivale a cero.

Ejemplo incorrecto:

```text
fiber missing → fiber = 0
```

Debe calcular:

```text
dataCompleteness
```

Ejemplo:

```text
Completitud de datos: 91 %
```

Factores:

* tabla nutricional disponible;
* ingredientes disponibles;
* categoría conocida;
* información de aditivos;
* NOVA disponible;
* Nutri-Score disponible.

Si faltan demasiados datos:

```text
No tenemos suficiente información para calcular una valoración fiable.
```

Ofrecer:

**Completar información**

---

# 12. Nivel de confianza

Además de la puntuación, calcular:

```text
confidence
```

Ejemplo:

```text
76 / 100

Confianza alta
```

O:

```text
68 / 100

Confianza baja

Faltan datos de fibra e ingredientes.
```

La confianza debe depender de la completitud y calidad de la información disponible.

Esto debe visualizarse de manera sencilla y no técnica.

---

# 13. Lógica de scoring

El scoring debe ser:

* determinista;
* reproducible;
* versionado;
* transparente;
* independiente de cualquier LLM.

Calcular dimensiones independientes:

```text
nutritionScore
ingredientScore
processingScore
additiveScore
```

Ejemplo:

```json
{
  "overall": 76,
  "nutrition": 82,
  "ingredients": 73,
  "processing": 61,
  "additives": 89,
  "confidence": 0.91,
  "completeness": 0.94,
  "algorithmVersion": "1.0.0"
}
```

---

# 14. Versionado del scoring

Todos los cálculos deben guardar:

```text
algorithm_version
```

Ejemplo:

```text
1.0.0
```

Esto permitirá modificar el algoritmo y recalcular posteriormente.

Nunca guardar únicamente:

```text
score = 76
```

Guardar siempre también versión y sub-scores.

---

# 15. Nutrición

Basar el score nutricional principalmente en:

* azúcar;
* sal;
* grasas saturadas;
* fibra;
* proteína;
* densidad energética;
* cuando sea posible, proporción de frutas, verduras, legumbres y frutos secos.

Mostrar también Nutri-Score cuando esté disponible.

Nutri-Score debe ser una referencia adicional, no el score completo de FoodLens.

---

# 16. Ingredientes

No penalizar automáticamente por "nombres químicos".

Analizar aspectos como:

* azúcar añadido;
* múltiples fuentes de azúcar;
* edulcorantes;
* ingredientes integrales;
* cantidad aproximada de ingredientes;
* grasas añadidas;
* aceites añadidos;
* presencia de aditivos.

Evitar inicialmente reglas fuertes como:

```text
aceite refinado = malo
```

El motor debe ser conservador y explicable.

---

# 17. Alérgenos

Los alérgenos NO deben reducir la puntuación general del producto.

Ejemplo:

```text
Yogur natural

Score ingredientes: 94

Contiene:
Leche
```

Un alimento no es peor porque contenga leche, huevo, soja, gluten o frutos secos.

Los alérgenos deben mostrarse como información independiente.

Más adelante, si el usuario configura una alergia o intolerancia:

```text
⚠ Contiene leche
```

pero eso pertenece a la capa PERSONAL, no al score general.

---

# 18. Aditivos

No utilizar terminología del tipo:

```text
seguro / peligroso
```

ni:

```text
lista blanca / evitar
```

Utilizar categorías moderadas:

```text
Sin preocupación identificada
Atención
Exposición frecuente a moderar
Datos insuficientes
```

Cada aditivo debe disponer de un registro estructurado.

Ejemplo:

```json
{
  "code": "E250",
  "name": "Nitrito de sodio",
  "function": "Conservante",
  "euStatus": "authorized",
  "foodlensLevel": "moderate",
  "reason": "Descripción breve",
  "sources": [],
  "version": "1.0"
}
```

La información debe estar versionada.

No utilizar un JSON arbitrario sin versión o fuentes.

---

# 19. Procesamiento

Mostrar el grado de procesamiento independientemente.

Utilizar NOVA cuando esté disponible:

```text
NOVA 1
NOVA 2
NOVA 3
NOVA 4
```

No equiparar automáticamente:

```text
NOVA 4 = alimento malo
```

Mostrar:

```text
Procesamiento alto
```

y explicar por qué.

---

# 20. Score global

Puede existir un score general 0–100, pero nunca debe ser la única información.

Ejemplo:

```text
76 / 100

Buena opción
```

Debajo:

```text
Nutrición      82
Ingredientes   73
Procesamiento  61
Aditivos       89
```

El usuario debe poder entender por qué existe la puntuación.

---

# 21. Página "Cómo calculamos"

Debe existir en MVP.

Mostrar:

* componentes utilizados;
* ponderaciones;
* versión del algoritmo;
* explicación sencilla;
* fecha de actualización;
* limitaciones.

Ejemplo:

```text
FoodLens Score v1.0.0
```

Explicar claramente:

> La puntuación es orientativa y no sustituye asesoramiento nutricional o médico.

---

# 22. Detalle de producto

La ficha principal debe mostrar:

### Header

* imagen;
* nombre;
* marca;
* cantidad;
* categoría;
* código de barras.

### Score

```text
76 / 100
Buena opción
Confianza alta
```

### Sub-scores

```text
Nutrición
Ingredientes
Procesamiento
Aditivos
```

### Lo mejor

Ejemplo:

```text
✓ Buena cantidad de fibra
✓ Bajo en sal
```

### A tener en cuenta

```text
• 12 g de azúcar / 100 g
• Procesamiento alto
```

### Nutrición

Toggle:

```text
Por 100 g
Por ración
```

### Ingredientes

Lista original + interpretación FoodLens claramente separadas.

### Aditivos

Listado estructurado.

### Procesamiento

NOVA + explicación.

### Transparencia

Mostrar:

```text
Datos:
Open Food Facts

Análisis:
FoodLens Score v1.0.0

Completitud:
94 %
```

---

# 23. Comparación de productos — incluir en MVP

La comparación debe pasar de Fase 2 al MVP.

Permitir inicialmente comparar dos productos.

Flujo:

```text
Producto A
   ↓
Comparar
   ↓
Escanear producto B
   ↓
Comparison View
```

Mostrar:

```text
                   A        B

Score             76       82
Nutrición         82       91
Ingredientes      73       78
Procesamiento     61       60
Aditivos          89       88

Azúcar          12 g      7 g
Fibra           8.2 g    9.1 g
Proteína        9 g      8 g
Sal             0.4 g    0.5 g
```

Mostrar diferencias relevantes:

```text
Producto B tiene 42 % menos azúcar.

Producto A tiene ligeramente más proteína.
```

Evitar:

```text
Producto B es mejor.
```

Utilizar:

```text
Si quieres reducir azúcar, Producto B destaca.
```

---

# 24. Historial

Guardar solamente escaneos reales del usuario.

Mostrar:

* hoy;
* ayer;
* esta semana;
* anteriores.

Permitir:

* búsqueda;
* eliminar;
* volver a abrir;
* comparar.

Modo invitado:

```text
localStorage / IndexedDB
```

Usuario registrado:

sincronizar con servidor.

---

# 25. Favoritos

Permitir guardar productos.

En MVP:

```text
Favoritos
```

Más adelante permitir listas personalizadas.

---

# 26. Autenticación

Modo invitado por defecto.

No exigir registro para:

* escanear;
* analizar;
* comparar;
* guardar historial local;
* favoritos locales.

Al registrarse:

migrar historial y favoritos locales.

Preferiblemente simplificar la autenticación utilizando:

**Supabase Auth**

con:

* Google;
* email/password;
* refresh tokens;
* recuperación de contraseña.

Alternativamente mantener FastAPI + JWT si se prefiere control total.

---

# 27. Datos mock

Incluir aproximadamente 30 productos representativos para:

* desarrollo;
* Storybook;
* tests;
* modo demo;
* preview Lovable.

Nunca utilizarlos para rellenar artificialmente:

* historial;
* favoritos;
* cesta.

El usuario real debe empezar con estados vacíos.

Puede existir una sección:

```text
Ejemplos de productos
```

claramente marcada como demo.

---

# 28. Estados de error

Diseñar explícitamente:

### Sin conexión

```text
No podemos consultar nuevos productos.
Puedes seguir viendo productos que ya hayas escaneado.
```

### Cámara no disponible

Ofrecer:

```text
Introducir código manualmente.
```

### Código inválido

Mostrar explicación.

### Producto no encontrado

Permitir añadirlo.

### Datos incompletos

Mostrar:

```text
No tenemos suficiente información para una valoración fiable.
```

---

# 29. Fase 1.5

Después del MVP, añadir rápidamente:

## Alternativas

Buscar productos de la misma categoría.

Mostrar:

```text
Producto A

7 g menos de azúcar
2.1 g más de fibra
```

No basar la recomendación únicamente en score.

---

## Comparación de hasta 3 productos

Ampliar el componente existente.

---

## Ranking por categoría

Ejemplo:

```text
Cereales similares
```

Pero evitar conceptos absolutos como:

```text
Los mejores cereales.
```

Preferir:

```text
Productos destacados según este criterio.
```

---

# 30. Fase 2 — Personalización

Añadir:

## Objetivos personales

Máximo 3 prioritarios.

Ejemplos:

* reducir azúcar;
* reducir sal;
* aumentar proteína;
* aumentar fibra;
* reducir grasas saturadas;
* priorizar alimentos menos procesados.

---

## Preferencias

* vegetariano;
* vegano;
* sin gluten;
* sin lactosa;
* evitar aceite de palma;
* evitar determinados edulcorantes.

---

# 31. "Encaje contigo"

El score global del alimento NO debe cambiar.

Mostrar un indicador independiente:

```text
Calidad del producto

76 / 100
```

y:

```text
Encaje contigo

91 / 100
```

Ejemplo:

```text
Encaja bien con tus objetivos porque:

✓ tiene menos azúcar que la media
✓ aporta bastante fibra
⚠ tiene una densidad energética relativamente alta
```

La lógica debe seguir siendo determinista.

---

# 32. Mi cesta

Permitir añadir productos a una cesta.

Mostrar:

```text
Mi cesta
12 productos
```

Análisis agregado:

* azúcar;
* sal;
* fibra;
* proteína;
* porcentaje de productos muy procesados.

Mostrar recomendaciones como:

```text
El cambio con mayor impacto sería sustituir estos cereales por una alternativa con menos azúcar.
```

No reducir toda la cesta a una sola nota.

---

# 33. Fase 3

Añadir:

## OCR de etiquetas

Cuando un producto no existe o tiene datos incompletos:

1. fotografía frontal;
2. ingredientes;
3. tabla nutricional.

Utilizar visión/OCR para estructurar los datos.

El usuario siempre debe confirmar antes de guardar.

---

## Explorador

Buscar por:

* producto;
* marca;
* categoría.

Filtros:

* Nutri-Score;
* azúcar;
* sal;
* proteína;
* fibra;
* procesamiento;
* score FoodLens.

---

## Evolución

Mostrar tendencias basadas en productos escaneados/comprados.

Ejemplos:

```text
Azúcar añadido ↓ 12 %
Fibra ↑ 8 %
```

Evitar gamificación moralizante.

---

## Reportar errores

Permitir seleccionar:

* nombre incorrecto;
* ingredientes;
* valores nutricionales;
* cantidad;
* imagen;
* categoría.

Fotografía opcional.

---

# 34. Fase 3 — Asistente IA

Añadir chat contextual.

El LLM NO participa en el scoring.

El LLM recibe únicamente datos estructurados y análisis calculados.

Ejemplos:

```text
¿Por qué este producto tiene un 62?
```

```text
¿Qué diferencias importantes hay entre estos dos yogures?
```

```text
Quiero algo parecido pero con menos azúcar.
```

Modelos posibles:

* Gemini Flash;
* Claude Sonnet;
* modelo equivalente disponible en ese momento.

El LLM debe explicar, no decidir.

---

# 35. Stack técnico recomendado

## Frontend

```text
React
TypeScript
Vite
Tailwind
shadcn/ui
React Router
Zustand
TanStack Query
```

---

## PWA

```text
Service Worker
Web App Manifest
IndexedDB
Asset cache
```

Dejar preparado para:

```text
Capacitor
```

en una futura versión nativa.

---

## Backend

```text
FastAPI
Python
```

Responsabilidades:

* acceso a Open Food Facts;
* normalización;
* caché;
* scoring;
* comparación;
* usuarios;
* favoritos;
* historial.

---

## Base de datos

Preferentemente:

```text
PostgreSQL
+
JSONB
```

---

## Auth

Preferentemente:

```text
Supabase Auth
```

Alternativa:

```text
FastAPI JWT
Google OAuth
```

---

# 36. Arquitectura backend

Separar módulos:

```text
api/
products/
off/
normalizer/
scoring/
additives/
comparison/
users/
favorites/
history/
```

Ejemplo:

```text
GET /products/{barcode}

GET /products/{barcode}/analysis

POST /compare

POST /favorites

GET /history
```

---

# 37. Product Repository

Crear una capa de acceso a producto:

```text
ProductRepository
```

Responsable de:

1. buscar cache;
2. consultar OFF si hace falta;
3. normalizar;
4. persistir;
5. devolver modelo FoodLens.

El resto de la aplicación no debe conocer Open Food Facts.

---

# 38. Scoring Engine

Crear módulo independiente:

```text
ScoringEngine
```

Entradas:

```text
FoodLensProduct
ScoringVersion
```

Salida:

```text
FoodLensAnalysis
```

Ejemplo:

```typescript
type FoodLensAnalysis = {
  overall: number | null

  nutrition: number | null
  ingredients: number | null
  processing: number | null
  additives: number | null

  completeness: number
  confidence: number

  positives: AnalysisReason[]
  warnings: AnalysisReason[]

  algorithmVersion: string
}
```

Debe poder testearse independientemente.

---

# 39. Provenance

Cada dato importante debería poder indicar origen.

Ejemplo:

```text
Proteína
9.1 g
Fuente: Open Food Facts
```

```text
NOVA
4
Fuente: Open Food Facts
```

```text
Ingredient Score
73
Calculado por FoodLens
```

```text
Encaje contigo
91
Calculado usando tus objetivos
```

---

# 40. UX y diseño

Estética:

* limpia;
* moderna;
* premium pero cercana;
* fondos claros;
* border radius 16–20 px;
* sombras muy sutiles;
* buena jerarquía;
* uso moderado de color.

Paleta semántica:

* verde = favorable;
* amarillo = moderación;
* naranja = atención;
* rojo apagado = atención importante;
* gris = neutro.

Nunca depender únicamente del color.

---

# 41. Bottom navigation

MVP:

```text
Inicio
Escanear
Historial
Perfil
```

Escanear debe ser el botón central destacado.

Comparación puede abrirse desde producto/Home.

Cuando crezca la app:

```text
Inicio
Explorar
Escanear
Mi cesta
Perfil
```

---

# 42. Progressive disclosure

La ficha del producto no debe ser una página saturada.

Primera pantalla:

```text
Producto

Score

Confianza

4 dimensiones

Lo mejor

A tener en cuenta

Comparar
```

Detalles bajo secciones expandibles:

```text
Nutrición

Ingredientes

Aditivos

Procesamiento

Fuente

Metodología
```

Un usuario debe comprender el resultado principal en 5 segundos.

---

# 43. Microinteracciones

Añadir:

* skeleton loaders;
* scanner animation;
* feedback al detectar código;
* transición del score;
* animación suave al guardar favorito;
* sliders/barras animadas.

No utilizar animaciones excesivas.

No utilizar confeti.

---

# 44. Performance

La experiencia de escaneo debe ser muy rápida.

Optimizar:

* carga inicial;
* cámara;
* consultas;
* imágenes;
* cache local.

Idealmente:

```text
scan → resultado
```

debe sentirse prácticamente instantáneo para productos ya cacheados.

---

# 45. Offline

La aplicación debería permitir consultar productos previamente escaneados sin conexión.

Flujo offline:

```text
Código
 ↓
¿Producto local?
 ├── Sí → mostrar
 └── No → informar que necesita conexión
```

---

# 46. Tests mínimos

Crear tests para:

### Normalización

Verificar diferentes respuestas de OFF.

### Scoring

Casos:

* datos completos;
* datos incompletos;
* azúcar alto;
* fibra alta;
* ausencia de NOVA;
* ausencia de ingredientes.

### Comparación

Verificar porcentajes y diferencias.

### Barcode

Verificar EAN válido/inválido.

---

# 47. Principios de producto que no deben romperse

1. No confundir ausencia de datos con valor cero.

2. No utilizar un LLM para calcular puntuaciones.

3. No penalizar alérgenos en la nota general.

4. No presentar aditivos como automáticamente peligrosos.

5. No mezclar datos de Open Food Facts y cálculos FoodLens sin identificar su origen.

6. No mostrar scores si los datos son demasiado incompletos.

7. No utilizar productos ficticios como si fueran escaneos reales.

8. No hacer depender el frontend del esquema de Open Food Facts.

9. Versionar siempre el algoritmo de scoring.

10. Mantener separadas:

* calidad general;
* información factual;
* encaje personal.

---

# 48. Prioridad de desarrollo

Implementar en este orden:

```text
1. Design system
2. Navegación
3. Scanner abstraction
4. ProductRepository
5. OpenFoodFacts Adapter
6. Product Normalizer
7. Cache
8. Scoring Engine
9. Product Detail
10. Data completeness / confidence
11. History
12. Favorites
13. Comparison
14. Authentication
15. PWA/offline
```

Después:

```text
Alternatives
Personalization
Basket
Explorer
OCR
AI Assistant
```

---

# 49. Resultado esperado

Generar una aplicación funcional, no únicamente un mock visual.

Debe incluir:

* componentes reutilizables;
* navegación real;
* mock data para desarrollo;
* scanner con fallback;
* integración estructurada con Open Food Facts;
* Product Normalizer;
* ProductRepository;
* Scoring Engine versionado;
* manejo de datos incompletos;
* cálculo de confidence;
* historial;
* favoritos;
* comparación de dos productos;
* estados vacíos;
* errores;
* responsive mobile-first;
* PWA instalable.

El código debe estar organizado para que en futuras iteraciones podamos añadir personalización, cesta, alternativas, OCR e IA sin rehacer la arquitectura base.

El objetivo del MVP no es replicar Yuka visualmente.

El objetivo es validar esta propuesta:

**"FoodLens no solo te da una nota: te explica el producto, te dice qué información conoce realmente y te permite compararlo de forma transparente."**
