# 🌐 Chocó Transparente — Frontend Web & Portal Público

Aplicación web moderna y responsiva que integra el **Portal Público Ciudadano** y la **Plataforma Administrativa de Gestión de la Emergencia** para el Departamento del Chocó.

---

## 🎨 Identidad Visual y Experiencia de Usuario

- **Identidad Territorial:** Inspirada en los colores institucionales del Chocó:
  - 🌿 **Verde Esmeralda:** Naturaleza, selva y biodiversidad.
  - ☀️ **Oro / Ámbar:** Riqueza minera y calidez humana.
  - 🌊 **Azul Río / Mar:** Riqueza hídrica del Atrato, San Juan y los dos océanos.
- **Tema Claro Institucional:** Alta legibilidad ciudadana, estética sobria y profesional.
- **Mapas en Tiempo Real:** Visualización interactiva con Leaflet de los 31 municipios, centros de acopio autorizados, albergues y afectaciones.

---

## 🛠️ Tecnologías

- **Framework:** React 18 & TypeScript
- **Empaquetador:** Vite (v5.4)
- **Estilos:** TailwindCSS (v3.4) & Vanilla CSS
- **Enrutamiento:** React Router DOM (v6)
- **Mapas:** Leaflet & React-Leaflet
- **Iconografía:** Lucide React
- **Servidor de Producción:** Nginx Alpine (Multi-stage Docker)

---

## 🚀 Inicio Rápido en Desarrollo Local

### 1. Requisitos
- Node.js >= 20.0.0

### 2. Instalación de dependencias
```bash
npm install
```

### 3. Configuración de Variables de Entorno
Copia el archivo de ejemplo:
```bash
cp .env.example .env
```
Define la URL base de tu backend:
```env
VITE_API_URL=http://localhost:4000/api/v1
```

### 4. Iniciar Servidor de Desarrollo
```bash
npm run dev
```
Accede a la aplicación en `http://localhost:5173`.

### 5. Compilar para Producción
```bash
npm run build
```
Los archivos optimizados se generarán en la carpeta `dist/`.

---

## 🐳 Contenedor Docker

### Construir la imagen de producción:
```bash
docker build --build-arg VITE_API_URL=https://api.tudominio.com/api/v1 -t choco-frontend:latest .
```

### Ejecutar el contenedor con Nginx:
```bash
docker run -d -p 80:80 --name choco-frontend-app choco-frontend:latest
```

---

## 🗺️ Estructura de Páginas y Vistas

### Portal Público (Ciudadanos, Donantes y Veedores)
- `/`: Inicio institucional con KPIs, mapa en vivo, accesos directos y semáforo departamental.
- `/mapa`: Mapa interactivo en pantalla completa con filtros reactivos de capas.
- `/municipios`: Directorio de los 31 municipios oficiales con fichas detalladas.
- `/centros-acopio`: Centros de acopio autorizados, existencias y postulación comunitaria.
- `/inventario-publico`: Existencias de kits y alimentos en custodia.
- `/albergues-publico`: Albergues habilitados y porcentaje de ocupación.
- `/afectaciones-publico`: Monitoreo de emergencias en tiempo real.
- `/como-ayudar`: Centro de solidaridad con 5 vías de participación.
- `/donar`: Donaciones en dinero y en especie con cuentas bancarias oficiales.
- `/voluntariado`: Formulario de inscripción ciudadana para brigadas y logística.
- `/transporte`: Registro de botes, lanchas y 4x4 para transporte de ayudas.
- `/solicitar-ayuda`: Canal oficial para familias damnificadas con radicado único.
- `/denunciar`: Canal de veeduría y denuncias 100% anónimo.
- `/transparencia`: Caja Abierta con balance de ingresos, egresos y saldo.
- `/contactos`: Directorio de emergencias y las 31 alcaldías municipales.

### Plataforma Administrativa (Gobernación, Alcaldías y Organismos)
- `/admin/login`: Inicio de sesión seguro con JWT.
- `/admin/dashboard`: Tablero de control y métricas territoriales.
- `/admin/inventario`: Gestión operativa de entradas, salidas y lotes con QR.
- `/admin/afectaciones`: Registro y actualización de eventos de riesgo.
- `/admin/centros-acopio`: Aprobación y auditoría técnica con geolocalización.
- `/admin/beneficiarios`: Censo de familias y registro de entregas con acta.
- `/admin/gastos`: Registro contable de compras con control de doble firma.
- `/admin/donaciones`: Conciliación de aportes en dinero y especie.
- `/admin/reportes`: Generación de reportes ejecutivos.
