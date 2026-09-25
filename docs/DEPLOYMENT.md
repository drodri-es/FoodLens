# Despliegue en GitHub Pages

FoodLens se publica como sitio estático mediante
`.github/workflows/deploy-pages.yml`.

## Flujo

Cada push a `main`:

1. instala las dependencias con `npm ci`;
2. genera el build con la ruta base `/FoodLens/`;
3. sube `dist` como artefacto de GitHub Pages;
4. despliega el artefacto en el entorno `github-pages`.

También puede ejecutarse manualmente desde la pestaña Actions.

## URL

```text
https://drodri-es.github.io/FoodLens/
```

GitHub Pages proporciona HTTPS, necesario para solicitar acceso a la cámara en
navegadores móviles. El usuario debe conceder el permiso explícitamente.

FoodLens muestra su explicación de cámara antes de la primera solicitud y
guarda localmente que ya fue vista. En aperturas posteriores intenta iniciar el
lector directamente si el navegador conserva el permiso. Cuando la API de
permisos está disponible, un permiso bloqueado se distingue de uno pendiente.

## Desarrollo local

El desarrollo conserva `/` como ruta base:

```bash
npm run dev
```

La variable `VITE_BASE_PATH` solo se establece en el workflow de Pages, por lo
que el despliegue no altera las rutas locales.

## Limitaciones

- Pages publica únicamente el frontend estático.
- Las consultas a Open Food Facts se realizan desde el navegador.
- No existe todavía backend, sincronización de cuentas ni almacenamiento
  compartido.
- La cámara y la linterna deben probarse en dispositivos físicos; su soporte
  depende del navegador y del hardware.
