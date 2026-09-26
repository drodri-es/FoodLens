# Despliegue en producción

FoodLens se publica como una imagen Docker en GHCR y se sirve desde el mismo
VPS que el resto de aplicaciones, detrás de Nginx Proxy Manager.

La aplicación es una SPA estática. La imagen usa Node únicamente para generar
el build y Nginx para servir el contenido final por el puerto interno 80.

## Archivos de despliegue

- `Dockerfile`: genera el build y crea la imagen final con Nginx.
- `nginx.conf`: sirve la SPA y evita cachear los archivos de actualización de
  la PWA.
- `docker-compose.yml`: conecta el contenedor `foodlens` a la red externa
  `proxy-network`.
- `.github/workflows/release.yml`: publica la imagen y actualiza el VPS al
  publicar una GitHub Release.

## Preparación inicial del VPS

En la carpeta elegida para FoodLens, copia `docker-compose.yml` y ejecuta:

```bash
docker compose up -d
```

La red externa debe existir previamente:

```bash
docker network inspect proxy-network
```

## Nginx Proxy Manager

Configura el Proxy Host con estos valores:

- Domain: `foodlens.digitalpartners.es`
- Scheme: `http`
- Forward Hostname / IP: `foodlens`
- Forward Port: `80`
- SSL: certificado Let's Encrypt y Force SSL

Nginx Proxy Manager también debe estar conectado a `proxy-network`.

## Secrets de GitHub Actions

El repositorio necesita estos secretos:

- `SSH_HOST`
- `SSH_PORT`
- `SSH_USER`
- `SSH_PRIVATE_KEY`
- `DEPLOY_PATH`: carpeta del VPS que contiene `docker-compose.yml`

## Publicar

El workflow se activa al publicar una GitHub Release. Construye dos etiquetas
de la imagen, la versión de la release y `latest`, y después ejecuta en el VPS:

```bash
docker compose pull foodlens
docker compose up -d --no-build foodlens
```

La imagen publicada es:

```text
ghcr.io/drodri-es/foodlens
```

El frontend se construye con ruta base `/`, apropiada para el dominio propio.
