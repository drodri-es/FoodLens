# Documentación de FoodLens

Este directorio reúne la visión objetivo del producto y la documentación del
estado que está realmente implementado. Cuando exista una diferencia entre
ambas, el código y los documentos de estado actual describen lo disponible hoy;
la definición de producto marca la dirección de desarrollo.

## Documentos

- [Definición de producto](./PRODUCT_DEFINITION.md): visión funcional y técnica,
  alcance del MVP, fases posteriores, arquitectura propuesta y orden de
  implementación. Es la guía principal para las decisiones futuras.
- [Metodología de puntuación](./METHODOLOGY.md): estado actual del scoring,
  limitaciones del prototipo y modelo pendiente de implementación y validación.
- [Capa de datos](./DATA_LAYER.md): integración con Open Food Facts, modelo
  normalizado, responsabilidades y limitaciones actuales.
- [Procedencia visual](./DATA_PROVENANCE.md): convención para distinguir datos
  externos, cálculos, estimaciones y contenido de demostración.
- [Persistencia y calidad](./QUALITY_AND_PERSISTENCE.md): almacenamiento local,
  pruebas automatizadas, CI y limitaciones pendientes.
- [Auditoría de afirmaciones nutricionales](./NUTRITION_CLAIMS_AUDIT.md): criterios,
  correcciones, fuentes y control automático de lenguaje no respaldado.
- [Comparación de productos reales](./COMPARISON.md): flujo, datos comparados y
  reglas neutrales para calcular diferencias.
- [Historial de escaneos reales](./HISTORY.md): fechas, búsqueda, agrupación,
  reapertura, comparación y borrado local.
- [PWA y modo sin conexión](./PWA_AND_OFFLINE.md): instalación, Service Worker,
  cachés y recuperación segura de productos guardados.
- [Borradores de aportaciones](./CONTRIBUTION_DRAFTS.md): captura fotográfica,
  almacenamiento local y límites del envío a Open Food Facts.
- [Resumen de producto](./PRODUCT_HIGHLIGHTS.md): reglas neutrales para «Lo
  mejor» y «A tener en cuenta».
- [Información nutricional](./NUTRITION_DISPLAY.md): alternancia entre valores
  por 100 g/ml y por ración sin alterar el Score.
- [Despliegue](./DEPLOYMENT.md): publicación automática en GitHub Pages y
  configuración de la ruta base.

## Regla de mantenimiento

Los cambios que alteren el alcance, la arquitectura, el tratamiento de los
datos o la metodología de puntuación deben actualizar también el documento
correspondiente. Las funcionalidades previstas no deben describirse como
implementadas hasta que existan en el código y hayan sido verificadas.
