# PWA y funcionamiento sin conexión

**Estado:** implementado  
**Última revisión:** 25 de septiembre de 2026

FoodLens se publica como una Progressive Web App instalable. El build genera un
Web App Manifest, un Service Worker y los iconos necesarios a partir del SVG de
marca. La ruta de inicio y el ámbito son relativos para funcionar tanto en
desarrollo como bajo `/FoodLens/` en GitHub Pages.

## Qué funciona sin conexión

- La interfaz y sus recursos principales se precargan durante la primera visita.
- El historial, favoritos y productos ya guardados siguen disponibles desde el
  almacenamiento local.
- Si se escanea sin conexión un código presente en el historial, se abre la
  copia guardada y se informa de ello.
- Si la consulta remota falla pero existe una copia en el historial, FoodLens
  muestra esa copia sin cambiar la fecha original de obtención de datos.
- Si el producto no está guardado, se indica que hace falta conexión.
- La interfaz muestra un aviso mientras el navegador declara estar sin red.

Las respuestas de la API de Open Food Facts no se almacenan en el Service
Worker. Así se evita presentar una respuesta antigua como si acabara de ser
consultada. La caché de producto versionada de FoodLens conserva su caducidad de
30 minutos y el historial conserva `source.fetchedAt` para mantener visible la
antigüedad de la fuente.

Las imágenes de producto y las fuentes web sí usan una caché limitada, porque
son recursos visuales y no alteran el contenido nutricional guardado.

## Instalación

En navegadores compatibles, FoodLens puede instalarse desde la opción
“Instalar aplicación” o “Añadir a pantalla de inicio” del navegador. La cámara
requiere HTTPS y permiso explícito incluso cuando la PWA está instalada.

## Actualizaciones

El Service Worker comprueba nuevas versiones y las activa automáticamente. Las
cachés de builds anteriores se eliminan durante la actualización.
