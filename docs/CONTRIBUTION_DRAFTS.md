# Aportaciones de productos ausentes

**Estado:** captura y borrador local implementados; envío externo pendiente  
**Última revisión:** 25 de septiembre de 2026

Cuando Open Food Facts no encuentra un código, FoodLens permite capturar con la
cámara trasera tres fotografías: frontal, ingredientes y tabla nutricional. Se
muestra una vista previa y cada fotografía puede repetirse antes de continuar.

El nombre, la marca y las imágenes se guardan como un borrador en IndexedDB,
identificado por el código de barras. Si se vuelve a escanear el mismo código,
el borrador se recupera. Las imágenes no se envían todavía a FoodLens ni a Open
Food Facts.

## Por qué no se envían todavía

Open Food Facts exige autenticación para escribir productos y subir imágenes.
Además, las fotografías aportadas requieren consentimiento para publicarse bajo
la licencia aplicable de Open Food Facts. Una integración de producción debe
resolver autenticación, consentimiento, reintentos y estado de moderación.

Las credenciales de una cuenta común nunca deben incluirse en el frontend. Las
alternativas previstas son:

1. backend de FoodLens con cuenta de aplicación y cola de aportaciones;
2. autenticación individual del usuario con Open Food Facts.

Hasta elegir una de ellas, la interfaz dice “Guardar borrador local” y nunca
afirma que el producto haya sido publicado.
