# Preparación manual del despliegue

Este documento registra las tareas manuales necesarias para integrar FoodLens
en el VPS. La construcción de la imagen y las actualizaciones posteriores se
realizan automáticamente al publicar una GitHub Release.

No se deben guardar claves privadas, tokens ni valores secretos en este
documento o en el repositorio.

## 1. Configuración del reverse proxy

Se creó un Proxy Host en Nginx Proxy Manager con estos valores:

- Domain: `foodlens.digitalpartners.es`
- Scheme: `http`
- Forward Hostname / IP: `foodlens`
- Forward Port: `80`
- SSL: certificado Let's Encrypt
- Force SSL: activado

El contenedor de Nginx Proxy Manager debe pertenecer a la red Docker externa
`proxy-network`, compartida con FoodLens.

## 2. Creación de la clave SSH de despliegue

Se generó una clave SSH dedicada para que GitHub Actions pueda actualizar el
contenedor en el VPS:

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh

ssh-keygen -t ed25519 \
  -C "github-actions-foodlens" \
  -f ~/.ssh/gh_deploy_foodlens \
  -N ""
```

La clave pública se autorizó para el usuario de despliegue:

```bash
cat ~/.ssh/gh_deploy_foodlens.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

Los archivos resultantes tienen funciones distintas:

- `~/.ssh/gh_deploy_foodlens.pub`: clave pública autorizada en el VPS.
- `~/.ssh/gh_deploy_foodlens`: clave privada almacenada exclusivamente como
  secreto `SSH_PRIVATE_KEY` en GitHub.

## 3. Secrets de GitHub Actions

En `Settings > Secrets and variables > Actions` del repositorio se crearon los
siguientes repository secrets:

- `SSH_HOST`: dirección del VPS.
- `SSH_PORT`: puerto del servicio SSH.
- `SSH_USER`: usuario del VPS autorizado para ejecutar Docker.
- `SSH_PRIVATE_KEY`: contenido completo de la clave privada dedicada.
- `DEPLOY_PATH`: ruta absoluta de la carpeta de FoodLens en el VPS.

`GITHUB_TOKEN` no se crea manualmente; GitHub Actions lo proporciona durante
la ejecución del workflow.

## 4. Carpeta de despliegue en el VPS

La carpeta se crea con el usuario indicado en `SSH_USER`:

```bash
mkdir -p "$HOME/docker/projects/foodlens"
cd "$HOME/docker/projects/foodlens"
pwd
```

La salida de `pwd` se guarda sin modificar como valor de `DEPLOY_PATH`.

Dentro de esa carpeta se descarga el archivo Compose del repositorio:

```bash
curl -fsSL \
  https://raw.githubusercontent.com/drodri-es/FoodLens/main/docker-compose.yml \
  -o docker-compose.yml
```

Se comprueba que el archivo y la red compartida existen:

```bash
ls -l docker-compose.yml
docker network inspect proxy-network
```

No es necesario arrancar manualmente el servicio antes de la primera Release.
El workflow inicia el contenedor después de construir y publicar la imagen.

## 5. Funcionamiento después de la preparación

Al publicar una GitHub Release, el workflow:

1. construye la aplicación;
2. publica la imagen versionada y la etiqueta `latest` en
   `ghcr.io/drodri-es/foodlens`;
3. se conecta al VPS por SSH;
4. ejecuta `docker compose pull foodlens`;
5. recrea el servicio con `docker compose up -d --no-build foodlens`;
6. elimina las imágenes Docker que ya no se utilizan.

La URL pública esperada es:

```text
https://foodlens.digitalpartners.es
```

## 6. Verificación manual tras la primera Release

En el VPS:

```bash
cd "$HOME/docker/projects/foodlens"
docker compose ps
docker compose logs --tail=100 foodlens
```

Desde cualquier equipo:

```bash
curl -I https://foodlens.digitalpartners.es
```

La verificación funcional final debe hacerse abriendo la URL mediante HTTPS,
instalando la PWA si procede y comprobando el permiso de cámara en un
dispositivo compatible.
