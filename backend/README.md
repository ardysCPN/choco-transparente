# ⚙️ Chocó Transparente — Backend API REST

API REST modular y de alto rendimiento para la gestión territorial, inventarios humanitarios, emergencias y rendición de cuentas del Departamento del Chocó.

---

## 🛠️ Tecnologías

- **Lenguaje:** Node.js (v20+) & TypeScript (v5.7)
- **Framework Web:** Express.js (v4.21)
- **ORM & Modelado:** Prisma ORM (v5.18) con PostgreSQL & PostGIS
- **Seguridad:** JWT (JSON Web Tokens), Bcrypt.js, Helmet, CORS
- **Validación de Esquemas:** Zod (v3.23)
- **Testing:** Vitest (v2.1)

---

## 🚀 Inicio Rápido en Desarrollo Local

### 1. Requisitos
- Node.js >= 20.0.0
- PostgreSQL >= 15 con extensión PostGIS instalada

### 2. Instalación de dependencias
```bash
npm install
```

### 3. Configuración de Variables de Entorno
Copia el archivo de ejemplo:
```bash
cp .env.example .env
```
Asegúrate de configurar `DATABASE_URL` con tus credenciales de PostgreSQL:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/choco_transparente?schema=public"
JWT_SECRET="clave_secreta_jwt_desarrollo_2026"
PORT=4000
```

### 4. Generar Cliente Prisma
```bash
npx prisma generate
```

### 5. Iniciar Servidor en Modo Desarrollo (Hot-Reload)
```bash
npm run dev
```
El servidor quedará escuchando en `http://localhost:4000`.

### 6. Ejecutar Pruebas
```bash
npm test
```

### 7. Compilar para Producción
```bash
npm run build
npm start
```

---

## 🐳 Contenedor Docker

### Construir la imagen:
```bash
docker build -t choco-backend:latest .
```

### Ejecutar el contenedor:
```bash
docker run -d -p 4000:4000 \
  -e DATABASE_URL="postgresql://usuario:password@host_postgres:5432/choco_transparente?schema=public" \
  -e JWT_SECRET="clave_secreta_prod" \
  --name choco-backend-app \
  choco-backend:latest
```

---

## 📑 Principales Módulos y Rutas de la API

| Módulo | Prefijo de Ruta | Descripción |
| :--- | :--- | :--- |
| **Salud** | `GET /health` | Healthcheck del contenedor y servicio |
| **Público** | `/api/v1/publico/*` | Consultas y formularios ciudadanos sin token |
| **Autenticación** | `/api/v1/autenticacion/*` | Inicio de sesión, perfil y refresh token |
| **Municipios** | `/api/v1/municipios/*` | Directorio de los 31 municipios oficiales |
| **Afectaciones** | `/api/v1/afectaciones/*` | Gestión de emergencias territoriales |
| **Centros de Acopio** | `/api/v1/centros-acopio/*` | Puntos de recepción y custodia de ayudas |
| **Inventario** | `/api/v1/inventario/*` | Entradas, salidas, lotes y stock |
| **Beneficiarios** | `/api/v1/beneficiarios/*` | Censo familiar de damnificados |
| **Solicitudes** | `/api/v1/solicitudes-ayuda/*` | Radicación y aprobación de auxilios |
| **Entregas** | `/api/v1/entregas-ayuda/*` | Actas de entrega y trazabilidad en terreno |
| **Donaciones** | `/api/v1/donaciones/*` | Aportes en dinero y especie |
| **Gastos** | `/api/v1/gastos/*` | Rendición de cuentas y pagos autorizados |
| **Albergues** | `/api/v1/albergues/*` | Centros de estancia temporal y capacidad |
| **Denuncias** | `/api/v1/denuncias/*` | Canal de veeduría y control social |
| **Dashboards** | `/api/v1/dashboards/*` | Consolidado departamental y KPIs |
| **Reportes** | `/api/v1/reportes/*` | Descarga de informes en PDF/Excel |
