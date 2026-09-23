# Metodología de puntuación de FoodLens

**Versión del documento:** 0.1  
**Estado:** prototipo; no validado para producción  
**Última revisión:** 23 de septiembre de 2026

## Alcance actual

FoodLens muestra una puntuación global de 0 a 100, cuatro puntuaciones por
dimensión y, cuando el usuario selecciona objetivos, una puntuación
personalizada de «Encaje contigo».

En el prototipo actual:

- las puntuaciones globales y las cuatro puntuaciones por dimensión son datos
  de demostración definidos manualmente en `src/data/mockProducts.ts`;
- no existe todavía un algoritmo que derive esas puntuaciones de la tabla
  nutricional, los ingredientes, NOVA o los aditivos;
- los pesos 45/25/15/15 que aparecen en el diseño son una propuesta de producto,
  no una fórmula ejecutada por la aplicación;
- las fuentes y fechas asociadas a los productos son también datos del fixture:
  el repositorio no contiene aún una integración que permita verificar su
  procedencia.

Por tanto, las notas actuales no deben presentarse como evaluaciones calculadas,
validadas o independientes.

## Modelo propuesto, pendiente de implementación y validación

La propuesta actual divide la evaluación en cuatro dimensiones:

| Dimensión | Peso propuesto | Información considerada |
| --- | ---: | --- |
| Calidad nutricional | 45 % | Energía, azúcares, grasas saturadas, sal, fibra y proteína por 100 g o 100 ml |
| Ingredientes | 25 % | Composición declarada, orden, proporciones disponibles y alérgenos |
| Procesamiento | 15 % | Clasificación NOVA y procesos declarados o inferibles con evidencia |
| Aditivos | 15 % | Aditivos declarados y evaluación vinculada a una fuente identificable |

Antes de convertir esta propuesta en una fórmula deben definirse, revisarse y
probarse como mínimo:

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
