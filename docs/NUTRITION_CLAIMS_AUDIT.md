# Auditoría de afirmaciones nutricionales

**Revisión:** 25 de septiembre de 2026
**Estado:** primera revisión del prototipo; no sustituye una revisión legal o
clínica previa a un lanzamiento comercial.

## Alcance

Se han revisado los textos visibles del catálogo ficticio, la ficha de producto,
la cesta, el asistente simulado y los objetivos personales. Los datos procedentes
de Open Food Facts se presentan como datos de la fuente; el FoodLens Score se
identifica como cálculo experimental.

## Criterios aplicados

- Una cantidad declarada se muestra como dato, no como efecto sobre la salud.
- «Alto contenido de fibra» solo se utiliza desde 6 g/100 g, umbral del anexo del
  Reglamento (CE) 1924/2006 para alimentos sólidos.
- No se usa «alto en proteína» a partir de gramos por 100 g: esa declaración
  depende del porcentaje de energía aportado por la proteína.
- No se califican aditivos como «seguros», «inocuos» o «peligrosos» sin enlazar
  una evaluación vigente y comprobar que corresponde al uso y condiciones del
  producto. Que un aditivo esté autorizado en la UE no permite inferir su dosis
  en un producto concreto.
- NOVA, Nutri-Score y las cantidades nutricionales se muestran por separado. No
  se convierten en diagnósticos ni recomendaciones individuales.
- Los alérgenos son información de seguridad personal y no reducen la nota
  general.
- Todo contenido ficticio aparece identificado como demostración antes de la
  puntuación y al compartir una ficha.

## Cambios realizados

Se retiraron o neutralizaron afirmaciones sobre saciedad, microbiota,
digestibilidad, biodisponibilidad, efectos cardiovasculares y seguridad de
aditivos que no tenían una fuente asociada. Las comparaciones ficticias ya no se
presentan como evaluación de la dieta real del usuario. El asistente describe
los valores del fixture y deja explícito que sus respuestas son simuladas.

## Fuentes de referencia

- Reglamento (CE) 1924/2006 sobre declaraciones nutricionales y de propiedades
  saludables: https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32006R1924
- Comisión Europea, aditivos alimentarios y proceso de autorización:
  https://food.ec.europa.eu/food-safety/food-improvement-agents/additives_en
- Organización Mundial de la Salud, principios de dieta saludable:
  https://www.who.int/news-room/fact-sheets/detail/healthy-diet
- Open Food Facts, limitaciones y procedencia de los datos de su API:
  https://openfoodfacts.github.io/documentation/docs/Product-Opener/api/

## Controles automáticos

`tests/nutritionClaimsAudit.test.ts` bloquea expresiones categóricas de alto
riesgo en los archivos auditados. Este control detecta regresiones de redacción,
pero no demuestra por sí solo que una afirmación sea legal o científicamente
válida. Cualquier nueva afirmación de salud requiere fuente, alcance, fecha y
revisión humana.
