# Capa de datos de producto

**Estado:** implementada para consultas individuales de Open Food Facts  
**Última revisión:** 23 de septiembre de 2026

## Flujo actual

```text
Scanner / entrada manual
        ↓
ProductRepository
        ↓
OpenFoodFactsClient (API v3)
        ↓
normalizeOpenFoodFactsProduct
        ↓
FoodLensProduct
        ↓
ExternalProductView
```

Los componentes visuales no consumen el JSON de Open Food Facts ni dependen de
sus nombres de campos. Solo reciben el modelo interno `FoodLensProduct`.

## Responsabilidades

- `OpenFoodFactsClient`: solicita únicamente los campos necesarios y distingue
  respuestas válidas, productos no encontrados y errores del servicio.
- `normalizeOpenFoodFactsProduct`: traduce el esquema externo sin convertir
  valores ausentes en cero y calcula una indicación inicial de completitud.
- `ProductRepository`: valida o extrae el código, coordina la consulta y mantiene
  una caché persistente de 30 minutos para evitar peticiones repetidas.
- `FoodLensProduct`: contrato interno utilizado por la aplicación.

## Presentación de productos externos

Los productos obtenidos de Open Food Facts se muestran en una ficha factual
independiente. La ficha identifica la fuente, los campos ausentes y la
completitud. También conserva las valoraciones normalizadas que Open Food Facts
publica para Nutri-Score, NOVA y aditivos. El motor experimental puede utilizarlas
como entradas trazables; no reinterpreta los alérgenos ni inventa valores para
dimensiones ausentes.

La normalización conserva por separado los nutrientes por 100 g/ml y por
ración. Los valores por ración solo se exponen cuando la fuente los proporciona
y no intervienen en el cálculo del Score.

## Limitaciones actuales

- No hay backend propio ni caché compartida en base de datos.
- La disponibilidad y exactitud de un producto dependen del registro que ofrece
  Open Food Facts en el momento de la consulta.
- La completitud actual es una métrica estructural simple, no un nivel de
  confianza científico.

La persistencia duradera, las pruebas automatizadas y la caché offline forman
parte del punto 6 de la hoja de ruta.
