# 🚀 MANUAL DE DESPLIEGUE EN VPS CON DOKPLOY
## Plataforma Departamental Chocó Transparente v1.0

Este manual detalla paso a paso cómo realizar el despliegue del **Backend (API Node.js + Prisma)**, **Frontend (React + Nginx)** y la **Base de Datos PostgreSQL (con PostGIS)** utilizando **Dokploy** en tu servidor VPS.

---

## 📋 1. Requisitos Previos en el VPS

1. **VPS con Dokploy instalado** y accesible vía web (ej. `http://tu-ip:3000` o `https://dokploy.tudominio.com`).
2. **Repositorios en GitHub:**
   - Opción Monorepositorio: 1 repositorio que contiene `/backend` y `/frontend`.
   - Opción Multirepositorio: 1 repositorio para el backend y 1 para el frontend.
3. **Dominios o Subdominios DNS (A Records apuntando a la IP de tu VPS):**
   - Frontend: `chocotransparente.gov.co` o `app.tudominio.com`
   - Backend API: `api.chocotransparente.gov.co` o `api.tudominio.com`

---

## 🗄️ 2. Configuración de la Base de Datos PostgreSQL en Dokploy

Si ya tienes un servicio de PostgreSQL creado en Dokploy o en el VPS:

### 2.1. Habilitar la Extensión PostGIS
Conéctate a tu base de datos PostgreSQL y asegúrate de habilitar PostGIS:
```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

### 2.2. Cargar el Script de Base de Datos

En Dokploy, puedes acceder a la consola/terminal del contenedor PostgreSQL o usar una herramienta como DBeaver / pgAdmin / psql:

#### Opción A: Despliegue de Demostración / Testing Inicial (Recomendado para pruebas)
Ejecuta el archivo [`script-BD-demo.sql`](./script-BD-demo.sql):
- Crea el esquema DDL completo e índices espaciales GIST.
- Carga los **31 municipios oficiales del Chocó**.
- Carga los roles y permisos institucionales.
- Crea el usuario **Superadmin** (`admin@chocotransparente.gov.co` / `AdminChoco2026!`).
- Crea el usuario de **Testing** (`test@chocotransparente.gov.co` / `TestChoco2026!`).
- Carga centros de acopio, albergues, emergencias e inventario de muestra.

#### Opción B: Despliegue Oficial en Limpio para la Gobernación
Ejecuta el archivo [`script-BD-produccion.sql`](./script-BD-produccion.sql):
- Crea la estructura DDL limpia sin ningún registro de prueba.
- Carga únicamente los 31 municipios, roles, entidad oficial y el Superadministrador.

---

## ⚙️ 3. Despliegue del Backend en Dokploy

1. En el panel de Dokploy, ve a tu Proyecto y haz clic en **Create Service** > **Application**.
2. Asigna un nombre al servicio: `choco-backend`.
3. Configura el origen del código (**Source**):
   - Selecciona **GitHub**.
   - Escoge el repositorio correspondiente y la rama `main`.
   - Si es monorepositorio, define **Base Directory**: `/backend`.
4. Configura el tipo de construcción (**Build Type**):
   - Selecciona **Dockerfile**.
   - **Dockerfile Path**: `/backend/Dockerfile` (o `./Dockerfile` si es repo independiente).
5. Configura las **Variables de Entorno (Environment Variables)**:
   ```ini
   NODE_ENV=production
   PORT=4000
   DATABASE_URL=postgresql://usuario_pg:password_pg@postgres_host:5432/choco_transparente?schema=public
   JWT_SECRET=genera_una_clave_aleatoria_muy_segura_de_64_caracteres
   JWT_REFRESH_SECRET=genera_otra_clave_aleatoria_refresh_segura
   JWT_TIEMPO_EXPIRACION=8h
   JWT_REFRESH_EXPIRES_IN=7d
   CORS_ORIGIN=*
   ```
6. Configura la Red y Puertos (**Networking**):
   - **Container Port**: `4000`
   - **Domain**: `api.chocotransparente.gov.co` (o tu subdominio asignado).
   - **Certificate**: Habilita **Let's Encrypt (SSL/HTTPS)** automático.
7. Haz clic en **Deploy**.
8. **Verificación:** Accede a `https://api.tudominio.com/health` y confirma que retorne:
   ```json
   { "ok": true, "mensaje": "Servidor operativo" }
   ```

---

## 🎨 4. Despliegue del Frontend en Dokploy

1. En el panel de Dokploy, dentro del mismo Proyecto, haz clic en **Create Service** > **Application**.
2. Asigna un nombre al servicio: `choco-frontend`.
3. Configura el origen del código (**Source**):
   - Selecciona **GitHub**.
   - Escoge el repositorio y la rama `main`.
   - Si es monorepositorio, define **Base Directory**: `/frontend`.
4. Configura el tipo de construcción (**Build Type**):
   - Selecciona **Dockerfile**.
   - **Dockerfile Path**: `/frontend/Dockerfile` (o `./Dockerfile` si es repo independiente).
5. Configura los **Build Arguments (Build Args)**:
   - `VITE_API_URL=https://api.chocotransparente.gov.co/api/v1` *(Usa la URL pública HTTPS de tu Backend)*
6. Configura la Red y Puertos (**Networking**):
   - **Container Port**: `80`
   - **Domain**: `chocotransparente.gov.co` (o tu dominio asignado).
   - **Certificate**: Habilita **Let's Encrypt (SSL/HTTPS)** automático.
7. Haz clic en **Deploy**.

---

## 🐳 5. Opción Alternativa: Despliegue Todo-en-Uno vía Docker Compose

Si prefieres desplegar todo el stack junto (Base de Datos PostGIS + Backend + Frontend) desde Dokploy usando Docker Compose:

1. En Dokploy, haz clic en **Create Service** > **Compose**.
2. Asigna el nombre: `choco-transparente-stack`.
3. Selecciona tu repositorio de GitHub.
4. Vincula el archivo [`docker-compose.yml`](./docker-compose.yml).
5. Define las variables de entorno en el editor de Dokploy (copiando de [`.env.example`](./.env.example)):
   ```ini
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=tu_password_seguro_produccion_2026
   POSTGRES_DB=choco_transparente
   POSTGRES_PORT=5432
   JWT_SECRET=super_secret_jwt_key_choco_2026_prod
   JWT_REFRESH_SECRET=super_secret_refresh_key_choco_2026_prod
   CORS_ORIGIN=*
   VITE_API_URL=https://api.tudominio.com/api/v1
   ```
6. Haz clic en **Deploy**. Dokploy orquestará los 3 contenedores y configurará los reverse proxies automáticamente.

---

## 👥 6. Credenciales de Acceso para Testing y Demo

Una vez desplegada la plataforma:

| Rol | Correo Electrónico | Contraseña | Ámbito |
| :--- | :--- | :--- | :--- |
| **Superadministrador** | `admin@chocotransparente.gov.co` | `AdminChoco2026!` | Acceso Global Total (31 Municipios) |
| **Operador / Testing** | `test@chocotransparente.gov.co` | `TestChoco2026!` | Coordinación Operativa de Acopio |

### URLs de Acceso
- **Portal Público Ciudadano:** `https://tudominio.com/`
- **Mapa Georreferenciado en Vivo:** `https://tudominio.com/mapa`
- **Panel Administrativo:** `https://tudominio.com/admin/login`

---

## 🔒 7. Recomendaciones de Seguridad para Producción Oficial

1. **Cambio de Contraseñas:** Tan pronto como inicie sesión el administrador oficial, cambiar las contraseñas predeterminadas desde el módulo de usuarios.
2. **Generación de JWT Secrets:** Generar cadenas criptográficas únicas para `JWT_SECRET` y `JWT_REFRESH_SECRET` usando `openssl rand -base64 48`.
3. **Copias de Seguridad (Backups):** Configurar en Dokploy backups automáticos diarios de la base de datos PostgreSQL hacia un almacenamiento S3 / MinIO.
4. **CORS:** En producción institucional, restringir `CORS_ORIGIN` al dominio exacto del Frontend: `https://chocotransparente.gov.co`.
