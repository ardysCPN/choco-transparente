# 🚀 GUÍA DE DESPLIEGUE DOKPLOY (COMPOSE STACK)
## Plataforma Departamental Chocó Transparente v1.0

> **Guía técnica de despliegue automatizado para Dokploy con PostgreSQL 15 / PostGIS y Traefik SSL.**

---

## 💡 ¿Cómo Funciona el Despliegue con Docker Compose en Dokploy?

Al desplegar como **Compose Service** en Dokploy:
1. **La Base de Datos se crea y se puebla automáticamente:** El contenedor `postgis/postgis:15-3.4` crea la base de datos `choco_transparente` y corre el script `./script-BD-demo.sql` la primera vez que inicia.
2. **El Backend se compila automáticamente:** Node.js 20 Alpine genera Prisma y compila TypeScript en el puerto `4000`.
3. **El Frontend se compila y monta en Nginx:** Vite compila los componentes SPA y Nginx sirve los archivos en el puerto `80`.
4. **Traefik gestiona los certificados SSL (HTTPS)** automáticamente para tus dominios.

---

## 📋 1. Configuración Paso a Paso en Dokploy

### Paso 1: Crear el Servicio Compose
1. Ingresa a tu panel Dokploy: 👉 **`http://tu-dominio-o-ip-dokploy:3000`**.
2. En tu Proyecto, haz clic en **Create Service** y selecciona **Compose**.
3. Asigna de nombre al servicio: **`choco-transparente`**.

---

### Paso 2: Conectar el Repositorio GitHub
- **Source Type:** `GitHub`
- **Repository:** `ardysCPN/choco-transparente`
- **Branch:** `main`
- **Compose Path:** `docker-compose.yml`
- Haz clic en **Save**.

---

### Paso 3: Configurar las Variables de Entorno
En la pestaña **Environment** de tu servicio en Dokploy, pega el siguiente bloque:

```ini
# ==============================================================================
# BASE DE DATOS POSTGRESQL + POSTGIS
# ==============================================================================
POSTGRES_DB=choco_transparente
POSTGRES_USER=postgres
POSTGRES_PASSWORD=TuPasswordSeguroPostgres2026!

# ==============================================================================
# BACKEND API REST
# ==============================================================================
JWT_SECRET=clave_secreta_jwt_choco_transparente_2026_super_segura
JWT_REFRESH_SECRET=clave_secreta_refresh_choco_transparente_2026
JWT_TIEMPO_EXPIRACION=8h
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=*

# ==============================================================================
# FRONTEND WEB (URL pública HTTPS de tu Backend API)
# ==============================================================================
VITE_API_URL=https://api.tudominio.com/api/v1
```

Haz clic en **Save**.

---

### Paso 4: Configurar los Dominios en Traefik (Pestaña Domains)

1. **Frontend (Web pública + Login):**
   - **Service Name:** `frontend`
   - **Container Port:** `80`
   - **Domain:** `chocotransparente.tudominio.com` (o `tudominio.com`)
   - **Certificate:** Activar **Let's Encrypt (SSL Automático)**.

2. **Backend (API REST):**
   - **Service Name:** `backend`
   - **Container Port:** `4000`
   - **Domain:** `api.tudominio.com` (o `api.chocotransparente.tudominio.com`)
   - **Certificate:** Activar **Let's Encrypt (SSL Automático)**.

Haz clic en **Save**.

---

### Paso 5: Desplegar (**Deploy**) 🚀
Haz clic en el botón superior **Deploy**. En la pestaña **Deployments / Logs** verás la compilación y puesta en marcha en tiempo real.

---

## 👥 2. Credenciales Listas para Iniciar Testing

Una vez desplegado:

| Acceso | URL | Credenciales |
| :--- | :--- | :--- |
| **Portal Público** | `https://tudominio.com/` | Libre acceso ciudadano (31 municipios, mapas, donaciones, solicitudes) |
| **Mapa Interactivo** | `https://tudominio.com/mapa` | Monitoreo en vivo con filtros de capas |
| **Panel Admin (Testing)** | `https://tudominio.com/admin/login` | Botón **🧪 Cargar Usuario de Pruebas** (`test@chocotransparente.gov.co` / `TestChoco2026!`) |
| **Superadministrador** | `https://tudominio.com/admin/login` | `admin@chocotransparente.gov.co` / `AdminChoco2026!` |

---

## 🏛️ 3. Cambio a Producción Oficial para la Gobernación

Cuando vayas a entregar la plataforma limpia desde cero a la Gobernación del Chocó:
1. En `docker-compose.yml`, cambia la línea:
   ```yaml
   - ./script-BD-demo.sql:/docker-entrypoint-initdb.d/01-init.sql:ro
   ```
   por:
   ```yaml
   - ./script-BD-produccion.sql:/docker-entrypoint-initdb.d/01-init.sql:ro
   ```
2. Haz `git commit` y `git push`.
3. En Dokploy, haz clic en **Deploy**.
