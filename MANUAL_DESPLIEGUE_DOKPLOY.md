# 🚀 GUÍA DE DESPLIEGUE DOKPLOY (COMPOSE STACK)
## Plataforma Departamental Chocó Transparente v1.0

Esta guía utiliza la misma dinámica y estructura de **Docker Compose** que ya utilizas en tus otros proyectos en Dokploy (`rufe`, `clientealcaldia-stack`).

Al desplegar como Compose en Dokploy:
- Se levanta la base de datos PostgreSQL con PostGIS (`postgis/postgis:15-3.4`).
- **El script de base de datos se carga automáticamente** la primera vez al montar el volumen (`/docker-entrypoint-initdb.d/01-init.sql`).
- El Backend compila el código de `/backend` y se conecta internamente a `postgres:5432`.
- El Frontend compila el código de `/frontend` con Nginx y se conecta a la API.

---

## 📋 1. Configuración de Dokploy Compose

### Paso 1: Crear el Servicio en Dokploy
1. Abre tu panel de Dokploy en `http://187.77.25.231:3000`.
2. En tu Proyecto, haz clic en **Create Service** > **Compose**.
3. Asigna un nombre al servicio: **`choco-transparente`**.

---

### Paso 2: Configurar el Repositorio GitHub
- **Source:** Selecciona **GitHub**.
- **Repository:** `ardysCPN/choco-transparente` (o la URL de tu repositorio).
- **Branch:** `main`.
- **Compose Path:** `docker-compose.yml` (o `./docker-compose.yml`).

---

### Paso 3: Pegar el archivo `docker-compose.yml` (si usas modo Raw Compose)

```yaml
version: "3.9"

services:
  # 1. Base de Datos con PostGIS (Poblamiento automático)
  postgres:
    image: postgis/postgis:15-3.4
    container_name: choco-postgres
    restart: always
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./script-BD-demo.sql:/docker-entrypoint-initdb.d/01-init.sql:ro
    networks:
      - choco_network

  # 2. Backend API REST (Node.js + Prisma)
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: choco-backend
    restart: always
    depends_on:
      - postgres
    environment:
      NODE_ENV: production
      PORT: 4000
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}?schema=public
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      JWT_TIEMPO_EXPIRACION: ${JWT_TIEMPO_EXPIRACION:-8h}
      JWT_REFRESH_EXPIRES_IN: ${JWT_REFRESH_EXPIRES_IN:-7d}
      CORS_ORIGIN: ${CORS_ORIGIN:-*}
    networks:
      - choco_network

  # 3. Frontend Web (React + Nginx)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        VITE_API_URL: ${VITE_API_URL}
    container_name: choco-frontend
    restart: always
    depends_on:
      - backend
    networks:
      - choco_network

volumes:
  postgres_data:

networks:
  choco_network:
    driver: bridge
```

---

### Paso 4: Configurar las Variables de Entorno en Dokploy

En la pestaña **Environment** del servicio Compose en Dokploy, pega las siguientes variables:

```ini
# Base de Datos
POSTGRES_DB=choco_transparente
POSTGRES_USER=postgres
POSTGRES_PASSWORD=TuPasswordSeguroPostgres2026!

# Backend
JWT_SECRET=clave_secreta_jwt_choco_transparente_2026_muy_segura
JWT_REFRESH_SECRET=clave_secreta_refresh_choco_transparente_2026
JWT_TIEMPO_EXPIRACION=8h
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=*

# Frontend (URL pública HTTPS de tu Backend API)
VITE_API_URL=https://api.tudominio.com/api/v1
```

---

### Paso 5: Configurar los Dominios en Dokploy (Traefik SSL)

En la sección **Domains / Networking** de Dokploy:

1. **Dominio para el Frontend (Web Pública y Admin):**
   - **Service:** `frontend`
   - **Port:** `80`
   - **Host:** `chocotransparente.tudominio.com` (o tu dominio principal)
   - **Certificate:** Activar **Let's Encrypt (SSL Automático)**

2. **Dominio para el Backend (API REST):**
   - **Service:** `backend`
   - **Port:** `4000`
   - **Host:** `api.tudominio.com` (o `api.chocotransparente.tudominio.com`)
   - **Certificate:** Activar **Let's Encrypt (SSL Automático)**

---

### Paso 6: Desplegar (**Deploy**)

Haz clic en el botón **Deploy**.

Dokploy realizará automáticamente:
1. La descarga de la imagen `postgis/postgis:15-3.4` (que ya tienes en caché).
2. La compilación multi-stage de `backend` (TypeScript y Prisma).
3. La compilación multi-stage de `frontend` (Vite y Nginx).
4. La inicialización automática de la base de datos con [`script-BD-demo.sql`](./script-BD-demo.sql).
5. La emisión de certificados SSL gratuitos con Traefik.

---

## 👥 2. Credenciales Listas para Iniciar Testing

Una vez finalice el despliegue:

| Acceso | URL | Credenciales |
| :--- | :--- | :--- |
| **Portal Público** | `https://tudominio.com/` | Libre acceso ciudadano |
| **Mapa en Vivo** | `https://tudominio.com/mapa` | Monitoreo de los 31 municipios |
| **Panel Admin (Testing)** | `https://tudominio.com/admin/login` | Botón **🧪 Cargar Usuario de Pruebas** (`test@chocotransparente.gov.co` / `TestChoco2026!`) |
| **Superadministrador** | `https://tudominio.com/admin/login` | `admin@chocotransparente.gov.co` / `AdminChoco2026!` |

---

## 🏛️ 3. Cambio a Producción Oficial para la Gobernación

Cuando vayas a entregar la plataforma limpia desde cero a la Gobernación:
1. En `docker-compose.yml`, cambia la línea:
   ```yaml
   - ./script-BD-demo.sql:/docker-entrypoint-initdb.d/01-init.sql:ro
   ```
   por:
   ```yaml
   - ./script-BD-produccion.sql:/docker-entrypoint-initdb.d/01-init.sql:ro
   ```
2. Elimina el volumen anterior si deseas borrar los datos de prueba (`docker volume rm ...`) y haz clic en **Deploy**.
