# Colección Postman - CHOCÓ TRANSPARENTE

## Descripción

Colección completa de Postman con todos los endpoints del backend de CHOCÓ TRANSPARENTE, organizados por fases y funcionalidades.

**Total de endpoints:** 40+  
**Fases cubiertas:** 7 (Autenticación, Territorio, Inventario, Beneficiarios, Albergues, Donaciones y Gastos, Reportes y Dashboards)

---

## ¿Cómo Importar?

### Opción 1: Desde archivo local
1. Abre Postman
2. Click en **"Import"** (o `Ctrl+O`)
3. Selecciona **"File"**
4. Navega a `c:\proyectos\choco-transparente\postman_collection.json`
5. Click en **"Import"**

### Opción 2: Copiar y pegar
1. Abre el archivo `postman_collection.json` con un editor de texto
2. Copia todo el contenido
3. En Postman: Click **"Import"** → **"Raw text"**
4. Pega el contenido
5. Click **"Import"**

---

## Configuración Inicial

### 1. Establecer variables de entorno
La colección utiliza dos variables principales:

- **`base_url`**: URL del servidor (por defecto: `http://localhost:3000`)
- **`jwt_token`**: Token JWT obtenido del login

Para modificar `base_url`:
1. Click en **"Variables"** en la esquina superior derecha
2. Busca `base_url`
3. Cambia el valor si tu servidor corre en otro puerto o host

### 2. Obtener JWT Token
Antes de hacer cualquier petición autenticada:

1. Abre la carpeta **"FASE 1 - Autenticación"**
2. Haz click en **"Login"**
3. Verifica que el body contenga credenciales válidas:
   ```json
   {
     "correo": "admin@choco.gov",
     "contrasena": "Admin123!"
   }
   ```
4. Click en **"Send"**
5. Copia el `token` del response
6. Click en **"Variables"** (esquina superior derecha)
7. Pega el token en el campo `jwt_token`
8. Click **"Save"**

Ahora todas las peticiones autenticadas usarán automáticamente este token.

---

## Estructura de la Colección

### 📌 FASE 1 - Autenticación
- **Login** → Obtener JWT token
- **Obtener Perfil** → Datos del usuario autenticado

### 📍 FASE 2 - Territorio
- **Municipios** → Listar, crear
- **Afectaciones** → Registrar zonas afectadas
- **Centros de Acopio** → Solicitar nuevos centros

### 📦 FASE 3 - Inventario
- **Inventario** → Listar, crear items
- **Entradas** → Registrar recepción de ayuda
- **Salidas** → Registrar distribución

### 👥 FASE 4 - Beneficiarios
- **Beneficiarios** → CRUD de beneficiarios
- **Solicitudes de Ayuda** → Crear solicitudes
- **Entregas de Ayuda** → Registrar entregas con evidencia

### 🏠 FASE 5 - Albergues y Denuncias
- **Albergues** → CRUD de refugios temporales
- **Denuncias** → Crear y seguimiento de denuncias

### 💰 FASE 6 - Donaciones y Gastos
- **Donaciones** → Dinero y especie
- **Gastos** → Crear y aprobar egresos

### 📊 FASE 7 - Reportes y Dashboards
- **Reportes** → Donaciones, gastos, beneficiarios, afectaciones, inventario
- **Exportar** → Descargar en JSON o CSV
- **Dashboards** → Administrativo, público, inventario, entregas

### ⚙️ Usuarios y Administración
- **CRUD de usuarios**
- **Gestión de roles y permisos**

### 💚 Health Check
- **Verificar estado del servidor**

---

## Ejemplos de Uso

### Ejemplo 1: Crear un beneficiario
1. Asegúrate de tener token JWT (ver "Obtener JWT Token")
2. Abre **FASE 4 - Beneficiarios** → **Crear Beneficiario**
3. Modifica el body con datos reales:
   ```json
   {
     "municipioId": 1,
     "nombre": "Pedro",
     "apellido": "Martínez",
     "numero_identificacion": "1234567",
     "tipo_identificacion": "CC",
     "telefono": "+5764111111",
     "correo": "pedro@email.com",
     "direccion": "Calle 5 # 10-20",
     "numero_miembros_familia": 4,
     "necesidades": ["ALIMENTOS"],
     "latitud": 5.6959,
     "longitud": -76.6419
   }
   ```
4. Click **"Send"**
5. Revisa la respuesta en la pestaña **"Body"**

### Ejemplo 2: Generar un reporte
1. Abre **FASE 7 - Reportes y Dashboards** → **Reporte de Donaciones**
2. Modifica los parámetros de query si es necesario:
   - `fechaInicio`: 2026-08-01
   - `fechaFin`: 2026-08-31
3. Click **"Send"**
4. Los datos del reporte aparecerán formateados en JSON

### Ejemplo 3: Ver dashboard público (sin token)
1. Abre **FASE 7** → **Dashboard Público**
2. **No requiere token JWT**
3. Click **"Send"**
4. Obtiene estadísticas públicas del sistema

---

## Variables Disponibles

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `base_url` | URL del servidor API | http://localhost:3000 |
| `jwt_token` | Token JWT para autenticación | (obtenido del login) |

**Cómo usarlas en requests:**
```
{{base_url}}/api/v1/usuarios     → http://localhost:3000/api/v1/usuarios
Authorization: Bearer {{jwt_token}}  → Bearer eyJhbGci...
```

---

## Solución de Problemas

### Error: "Cannot GET /health"
**Causa:** Servidor no está corriendo  
**Solución:** 
```bash
cd backend
npm run dev
```

### Error: "Unauthorized" o "Invalid token"
**Causa:** JWT token inválido o expirado  
**Solución:** Repite el proceso de login para obtener un nuevo token

### Error: "Database connection refused"
**Causa:** PostgreSQL no está accesible  
**Solución:**
```bash
psql -U postgres -h localhost -c "SELECT 1"
```

### Error: "CORS error"
**Causa:** Solicitud desde frontend bloqueada  
**Solución:** Verificar configuración CORS en `.env`

---

## Flujo Recomendado de Pruebas

1. **Verificar salud del sistema**
   - Health Check

2. **Autenticación**
   - Login → Copiar token a variables

3. **Configurar territorio**
   - Crear municipios
   - Crear afectaciones
   - Solicitar centros de acopio

4. **Gestionar inventario**
   - Crear items
   - Registrar entradas
   - Registrar salidas

5. **Registrar beneficiarios**
   - Crear beneficiarios
   - Crear solicitudes de ayuda
   - Registrar entregas

6. **Gestionar albergues y denuncias**
   - Crear albergues
   - Crear denuncias

7. **Financiero**
   - Registrar donaciones
   - Crear y aprobar gastos

8. **Análisis y reportes**
   - Ver dashboards
   - Generar reportes
   - Exportar datos

---

## Notas Importantes

- ⚠️ **Las credenciales de ejemplo** (`admin@choco.gov` / `Admin123!`) deben existir en la BD
- ⚠️ **Los IDs** en los endpoints (ej: `/municipios/1`) deben ajustarse a IDs reales en tu BD
- ⚠️ **Los cambios de estado** solo son válidos según las restricciones CHECK de cada tabla
- ⚠️ **Las fechas** deben estar en formato ISO 8601 (YYYY-MM-DD)

---

## Contacto y Soporte

Para problemas o sugerencias sobre la colección, revisar:
- [PLAN_DESARROLLO_FASES.md](PLAN_DESARROLLO_FASES.md)
- [DESPLIEGUE_Y_USO.md](DESPLIEGUE_Y_USO.md)
- Código fuente en `backend/src/`

**Última actualización:** 2026-08-15  
**Versión:** 1.0 - Todas las fases completadas
