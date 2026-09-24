# Comparación de productos reales

**Estado:** implementada para dos productos escaneados
**Última revisión:** 25 de septiembre de 2026

## Flujo

1. Abrir la ficha de un producto obtenido de Open Food Facts.
2. Seleccionar «Comparar con otro producto».
3. Escanear un código diferente.
4. Mostrar ambos productos en una matriz común.

La comparación utiliza exclusivamente `FoodLensProduct`; no consume el JSON de
Open Food Facts desde la interfaz. El flujo de comparación de productos reales
está separado de la comparativa ficticia del catálogo de demostración.

## Información mostrada

- FoodLens Score experimental y dimensiones disponibles;
- energía, azúcares, fibra, proteína, grasas saturadas y sal;
- Nutri-Score y NOVA;
- diferencias neutrales de azúcares, fibra, proteína y sal.

Un guion largo representa un valor ausente. La comparación nunca lo sustituye
por cero. Los textos describen diferencias declaradas y no eligen un ganador.

## Reglas de cálculo

- El porcentaje de reducción de azúcares se calcula respecto al valor mayor.
- Fibra, proteína y sal se expresan como diferencias absolutas por 100 g o
  100 ml.
- Solo se genera una diferencia cuando ambos productos proporcionan el dato.
- Escanear dos veces el mismo código no completa la comparación.

Las reglas están aisladas en
`src/domain/comparison/compareFoodLensProducts.ts` y se prueban sin depender de
React ni de la red.
