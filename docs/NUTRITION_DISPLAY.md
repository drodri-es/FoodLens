# Presentación de información nutricional

**Estado:** implementado  
**Última revisión:** 25 de septiembre de 2026

La ficha de un producto muestra siempre los valores normalizados por 100 g o
100 ml que proporciona Open Food Facts. Cuando la fuente incluye valores por
ración, aparece un selector para alternar entre ambas vistas y se muestra el
tamaño de ración declarado si está disponible.

Los valores ausentes no se sustituyen por cero. Si Open Food Facts no ofrece
datos por ración, la interfaz mantiene la vista por 100 g/ml e informa de que la
otra vista no está disponible.

FoodLens Score y los resúmenes «Lo mejor» y «A tener en cuenta» utilizan
exclusivamente los valores por 100 g/ml. Los datos por ración solo cambian la
tabla visible; no modifican el cálculo ni sus umbrales. Esto mantiene las
comparaciones entre productos sobre una base homogénea.
