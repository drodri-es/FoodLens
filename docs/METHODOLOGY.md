# Metodología de puntuación de FoodLens

**Versión del documento:** 0.3
**Estado:** algoritmo experimental; no validado para producción
**Última revisión:** 24 de septiembre de 2026

## Alcance actual

FoodLens muestra una puntuación global de 0 a 100, cuatro puntuaciones por
dimensión y, cuando el usuario selecciona objetivos, una puntuación
personalizada de «Encaje contigo».

El catálogo de demostración conserva puntuaciones manuales. Los productos
consultados por código de barras utilizan, de forma separada, el algoritmo
experimental `0.2.0`.

Este algoritmo no vuelve a calcular Nutri-Score, NOVA ni la valoración de
aditivos. Consume los atributos normalizados que Open Food Facts publica con
estado `known` y un valor `match` entre 0 y 100. De este modo la entrada conserva
una procedencia identificable y FoodLens se limita a ponderarla.

Cuando esos atributos detallados no están incluidos pero Open Food Facts sí
publica una clasificación Nutri-Score o NOVA válida, la versión 0.2 aplica una
conversión ordinal explícita como respaldo. Se identifica como conversión en el
desglose y nunca sustituye un atributo detallado disponible:

| Clasificación | Conversión |
| --- | ---: |
| Nutri-Score A / B / C / D / E | 100 / 75 / 50 / 25 / 0 |
| NOVA 1 / 2 / 3 / 4 | 100 / 100 / 50 / 0 |

No se deduce una nota de aditivos a partir de una lista vacía, porque una lista
vacía también puede significar que el registro está incompleto.

## Modelo experimental implementado

La propuesta actual divide la evaluación en cuatro dimensiones:

| Dimensión | Peso propuesto | Información considerada |
| --- | ---: | --- |
| Calidad nutricional | 45 % | Energía, azúcares, grasas saturadas, sal, fibra y proteína por 100 g o 100 ml |
| Ingredientes | 25 % | Sin evaluar hasta disponer de reglas y fuentes validadas; los alérgenos nunca penalizan |
| Procesamiento | 15 % | Clasificación NOVA y procesos declarados o inferibles con evidencia |
| Aditivos | 15 % | Aditivos declarados y evaluación vinculada a una fuente identificable |

La puntuación global es la media ponderada de las dimensiones conocidas. Los
pesos ausentes se excluyen del denominador; no se sustituyen por cero. Para
mostrar el resultado son obligatorios nutrición y al menos otra dimensión, con
un mínimo de 60 puntos de peso disponibles.

La confianza se calcula así:

```text
confianza = completitud_del_registro × peso_disponible / 100
```

Por tanto, mientras ingredientes siga sin evaluar, la confianza máxima es 75 %.
El resultado siempre se marca como cálculo experimental y muestra el desglose,
la versión y las dimensiones ausentes.

Antes de considerar el algoritmo apto para producción deben completarse:

1. umbrales diferentes por categoría de alimento y para sólidos frente a
   bebidas;
2. tratamiento de valores ausentes y nivel de confianza del resultado;
3. reglas reproducibles para ingredientes, procesamiento y aditivos;
4. procedencia, fecha y versión de cada fuente;
5. casos de prueba y revisión por una persona cualificada en nutrición;
6. análisis de sesgos y de resultados contradictorios o potencialmente
   engañosos.

## Etiquetas de la puntuación global

La interfaz aplica actualmente estos intervalos visuales:

| Puntuación | Etiqueta |
| ---: | --- |
| 80–100 | Excelente |
| 60–79 | Buena opción |
| 40–59 | Mejorable |
| 0–39 | Ocasional |

Estas etiquetas son orientativas. No representan un diagnóstico ni determinan
por sí solas si un alimento es saludable para una persona concreta.

## Encaje personalizado implementado

La puntuación «Encaje contigo» sí se calcula en el cliente. Parte de la
puntuación global de demostración y suma o resta ajustes según los objetivos
seleccionados. El resultado se limita al intervalo 10–99.

| Objetivo | Condición | Ajuste |
| --- | --- | ---: |
| Reducir azúcar | azúcares <= 5 g/100 g | +14 |
| Reducir azúcar | azúcares > 15 g/100 g | -16 |
| Aumentar fibra | fibra >= 6 g/100 g | +14 |
| Aumentar fibra | fibra < 2 g/100 g | -8 |
| Aumentar proteína | proteína >= 10 g/100 g | +12 |
| Aumentar proteína | proteína < 3 g/100 g | -6 |
| Reducir sal | sal <= 0,4 g/100 g | +10 |
| Reducir sal | sal >= 1,2 g/100 g | -14 |
| Evitar ultraprocesados | NOVA 1 o 2 | +15 |
| Evitar ultraprocesados | NOVA 4 | -18 |
| Reducir grasas saturadas | saturadas <= 1,5 g/100 g | +10 |
| Reducir grasas saturadas | saturadas >= 5 g/100 g | -12 |

Los objetivos «Reducir densidad calórica» y «Preferir alimentos simples» se
pueden seleccionar en la interfaz, pero todavía no modifican esta puntuación.
Los ajustes no han sido validados clínicamente.

## Información que debe acompañar a una puntuación de producción

Una puntuación calculada deberá conservar y mostrar:

- datos de entrada y unidad de medida;
- origen y fecha de consulta;
- versión exacta del algoritmo;
- reglas aplicadas y desglose del cálculo;
- campos ausentes, inferencias y nivel de confianza;
- fecha de la última revisión del producto.

## Limitaciones

FoodLens debe tratarse como una ayuda para interpretar información alimentaria,
no como consejo médico. Las necesidades cambian según la persona, la cantidad,
la frecuencia y el conjunto de la dieta. La etiqueta física del producto debe
prevalecer cuando difiera de los datos almacenados.
