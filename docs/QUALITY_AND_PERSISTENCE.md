# Persistencia, pruebas y CI

**Estado:** base implementada  
**Última revisión:** 25 de septiembre de 2026

## Persistencia local

El modo invitado utiliza almacenamiento local versionado bajo
`foodlens:app-state` (versión 2). Se guardan:

- historial de productos demo mediante identificadores;
- los últimos 50 productos reales normalizados, con fechas ISO de escaneo;
- favoritos de productos reales normalizados;
- favoritos y listas;
- cesta y cantidades;
- selección de comparación;
- objetivos y preferencias;
- estado de la cuenta simulada.

Los productos demo se reconstruyen contra el catálogo actual para no conservar
copias obsoletas. Los identificadores que ya no existen se descartan.

Una instalación nueva comienza en modo invitado, sin historial, favoritos,
cesta, comparativa ni objetivos precargados. La migración desde la versión 1
descarta la actividad ficticia anterior y conserva los escaneos y favoritos
reales procedentes de Open Food Facts.

La caché de Open Food Facts utiliza claves `foodlens:product-cache:v2:<barcode>` y
caduca a los 30 minutos. Una caché llena, corrupta o no disponible no impide
consultar el producto por red.

El Service Worker precarga la interfaz y permite abrir la aplicación sin
conexión. Los productos del historial pueden consultarse offline, conservando la
fecha original de Open Food Facts. Las respuestas de la API no se cachean en el
Service Worker para evitar aparentar que datos antiguos son una consulta nueva.

No se almacenan tokens, credenciales ni imágenes capturadas por la cámara.

## Pruebas

El comando `npm test` utiliza el runner nativo de Node y `tsx`. Cubre:

- normalización y conservación de valores ausentes;
- extracción de códigos y GS1 Digital Link;
- producto encontrado, no encontrado e indisponibilidad;
- reutilización de la caché persistente;
- persistencia y validación de favoritos reales;
- agrupación, búsqueda y formato de fechas del historial real;
- diferencias entre dos productos reales y tratamiento de valores ausentes;
- serialización, restauración, versión desconocida y datos corruptos.

Las pruebas no realizan llamadas reales a servicios externos.

## Integración continua

`.github/workflows/ci.yml` se ejecuta en pushes a `main` y pull requests. Realiza:

1. `npm ci`;
2. comprobación TypeScript;
3. pruebas unitarias;
4. build de producción;
5. auditoría de dependencias de producción con severidad alta o crítica.

## Limitaciones pendientes

- La persistencia sigue siendo local al navegador; no hay sincronización entre
  dispositivos ni backend de usuario.
- Todavía no hay pruebas de componentes, accesibilidad o navegador real.
- Cámara, instalación PWA y linterna requieren validación manual en dispositivos físicos HTTPS.
- El despliegue se valida mediante un workflow separado de GitHub Pages.
