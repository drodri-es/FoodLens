# Presentación de procedencia y estado de los datos

**Estado:** convención visual implementada  
**Última revisión:** 23 de septiembre de 2026

FoodLens debe indicar qué tipo de información está mostrando. La interfaz
utiliza el componente `DataOriginBadge` con estas categorías:

| Categoría | Significado | Ejemplo |
| --- | --- | --- |
| Dato de la fuente | Valor recibido de un proveedor externo, sin cálculo FoodLens | Azúcares por 100 g recibidos de Open Food Facts |
| Cálculo FoodLens | Resultado determinista calculado a partir de datos de entrada | Completitud estructural del registro |
| Estimación FoodLens | Valor inferido que no aparece literalmente en la fuente | Reservado para futuras inferencias explícitas |
| Dato de demostración | Fixture ficticio utilizado para presentar o desarrollar la interfaz | Catálogo, historial, cesta y puntuaciones mock |

## Reglas

1. Un dato de demostración nunca debe presentarse como verificado ni atribuirse
   a Open Food Facts.
2. Una estimación debe identificarse como tal y explicar su base cuando llegue
   a implementarse.
3. Un cálculo debe poder vincularse a una regla y versión reproducibles.
4. Los valores ausentes deben mostrarse como no disponibles, nunca como cero.
5. La procedencia debe aparecer cerca de la información relevante, no solo en
   términos legales o documentación externa.

## Estado actual

- Las pantallas alimentadas por `MOCK_PRODUCTS` muestran un aviso de modo
  demostración.
- Los mocks no se precargan como historial, favoritos, cesta, comparativa ni
  identidad del usuario; en producción un código escaneado siempre se consulta
  mediante la capa de datos real.
- Las fichas mock identifican su fuente como ficticia y no verificada.
- Las fichas obtenidas mediante la API identifican Open Food Facts como fuente.
- La completitud se identifica como un cálculo estructural de FoodLens.
- FoodLens todavía no muestra estimaciones en las fichas reales.
