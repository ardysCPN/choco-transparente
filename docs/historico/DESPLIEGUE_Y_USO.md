# CHOCÓ TRANSPARENTE — Documentación Técnica de Despliegue

Fecha de finalización: **2026-08-15**  
Estado: **✅ PROYECTO COMPLETADO - LISTO PARA PRODUCCIÓN**

---

## 1. Requisitos del Sistema

### Mínimo recomendado
- **Node.js**: 18.x o superior
- **PostgreSQL**: 14 o superior con extensión PostGIS
- **npm**: 9.x o superior
- **RAM**: 2 GB mínimo
- **Disco**: 5 GB para base de datos + aplicación

### Variables de entorno (.env)

```bash
# Base de datos
DATABASE_URL="postgresql://postgres:Sa123456@localhost:5432/chocotransparente"

# Servidor
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET="clave_super_secreta_cambiar_en_produccion"
JWT_EXPIRATION=7d

# CORS
CORS_ORIGIN="http://localhost:3000,https://tunominio.com"
```

---

## 2. Instalación y Configuración

### 2.1 Clonar y preparar el proyecto

```bash
cd c:\proyectos\choco-transparente\backend
npm install
```

### 2.2 Configurar base de datos

```bash
# Ejecutar script de inicialización (si es nueva instalación)
psql -U postgres -h localhost -d chocotransparente -f ../script-BD.sql

# Generar cliente Prisma
npx prisma generate

# Crear migraciones si es necesario
npx prisma migrate dev
```

### 2.3 Compilar TypeScript

```bash
npx tsc -p tsconfig.json
```

---

## 3. Ejecución

### Desarrollo
```bash
npm run dev
# O si prefieres:
npm run start
```

### Producción
```bash
npm run build
npm run start
```

### Pruebas
```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar fase específica
npx vitest run pruebas/fase1.autenticacion.test.ts
npx vitest run pruebas/fase2.territorio.test.ts
# ... etc
```

---

## 4. Endpoints Principales

### 4.1 Autenticación (Fase 1)
```
POST   /api/v1/autenticacion/login
GET    /api/v1/autenticacion/perfil
```

### 4.2 Gestión Territorial (Fase 2)
```
GET    /api/v1/municipios
POST   /api/v1/municipios
GET    /api/v1/afectaciones
POST   /api/v1/afectaciones
GET    /api/v1/centros-acopio
POST   /api/v1/centros-acopio
```

### 4.3 Inventario (Fase 3)
```
GET    /api/v1/inventario
POST   /api/v1/inventario
POST   /api/v1/inventario/entrada
POST   /api/v1/inventario/salida
```

### 4.4 Beneficiarios (Fase 4)
```
GET    /api/v1/beneficiarios
POST   /api/v1/beneficiarios
GET    /api/v1/solicitudes-ayuda
POST   /api/v1/solicitudes-ayuda
GET    /api/v1/entregas-ayuda
POST   /api/v1/entregas-ayuda
```

### 4.5 Albergues y Denuncias (Fase 5)
```
GET    /api/v1/albergues
POST   /api/v1/albergues
GET    /api/v1/denuncias
POST   /api/v1/denuncias
```

### 4.6 Donaciones y Gastos (Fase 6)
```
GET    /api/v1/donaciones
POST   /api/v1/donaciones/dinero
POST   /api/v1/donaciones/especie
GET    /api/v1/gastos
POST   /api/v1/gastos
POST   /api/v1/gastos/:id/aprobar
```

### 4.7 Reportes y Dashboards (Fase 7)
```
GET    /api/v1/reportes/donaciones
GET    /api/v1/reportes/gastos
GET    /api/v1/reportes/beneficiarios
GET    /api/v1/reportes/afectaciones
GET    /api/v1/reportes/inventario
POST   /api/v1/reportes/exportar

GET    /api/v1/dashboards/administrativo
GET    /api/v1/dashboards/publico
GET    /api/v1/dashboards/inventario
GET    /api/v1/dashboards/entregas
```

---

## 5. Seguridad

### 5.1 Autenticación
- Todos los endpoints excepto `/dashboards/publico` requieren JWT válido
- Login retorna token JWT con expiración de 7 días
- Contraseñas se encriptan con bcrypt (10 rondas)

### 5.2 Autorización
- Roles: SUPERADMIN, ADMINISTRADOR, COORDINADOR_MUNICIPAL, OPERADOR
- Permisos granulares por módulo (SISTEMA_GLOBAL por defecto)
- Usuarios territoriales tienen acceso limitado a su municipio

### 5.3 Recomendaciones para producción
```bash
# 1. Cambiar JWT_SECRET a valor fuerte
export JWT_SECRET=$(openssl rand -base64 32)

# 2. Usar HTTPS obligatoriamente
# 3. Configurar CORS según dominios reales
# 4. Implementar rate limiting en nginx/reverse proxy
# 5. Habilitar HTTPS/TLS en PostgreSQL
# 6. Usar variables de entorno para credenciales (no hardcodear)
# 7. Configurar backups automáticos de BD
```

---

## 6. Base de Datos

### 6.1 Tablas principales
- `usuario` — usuarios del sistema
- `rol`, `permiso`, `rol_permiso` — control de acceso
- `municipio`, `departamento` — estructura territorial
- `afectacion` — zonas afectadas
- `centro_acopio` — centros de distribución
- `inventario`, `lote`, `entrada_inventario`, `salida_inventario` — control de stock
- `beneficiario` — familias asistidas
- `solicitud_ayuda`, `entrega_ayuda` — flujo de asistencia
- `albergue` — refugios temporales
- `denuncia` — reportes de irregularidades
- `donacion`, `donacion_dinero`, `donacion_especie` — recepción de ayuda
- `gasto` — registro de egresos
- `auditoria` — trazabilidad de cambios

### 6.2 Backup y Restauración

```bash
# Backup completo
pg_dump -U postgres -h localhost chocotransparente > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar desde backup
psql -U postgres -h localhost chocotransparente < backup_20260815_120000.sql

# Backup con estructura y datos
pg_dump -U postgres --format=custom chocotransparente > backup.dump
pg_restore -U postgres -d chocotransparente backup.dump
```

---

## 7. Monitoreo y Logs

### 7.1 Health Check
```bash
curl http://localhost:3000/health
# Response: {"ok":true,"mensaje":"Servidor operativo"}
```

### 7.2 Logs de auditoría
Todos los cambios de datos se registran en tabla `auditoria`:
- usuario_id, modulo, accion, entidad, datos_anteriores, datos_nuevos
- Útil para trazabilidad y debugging

### 7.3 Logs de aplicación
Revisar consola de Node.js para errores en tiempo de ejecución

---

## 8. Extensiones Futuras

### PWA Offline
```typescript
// Usar SincronizacionServicio para sincronizar cambios cuando haya conectividad
const sincronizacion = new SincronizacionServicio();
await sincronizacion.registrarCambio('CREATE', 'beneficiario', id, datos);
await sincronizacion.sincronizar(); // Cuando reconecta
```

### Exportación a PDF/Excel
```bash
npm install pdf-lib exceljs
# Extender ReportesServicio con métodos de generación
```

### Mapas
```bash
npm install leaflet mapbox-gl
# Integrar en frontend usando coordenadas (latitud, longitud) disponibles en:
# municipio, afectacion, centro_acopio, beneficiario, albergue, etc.
```

### Notificaciones
```typescript
// Tabla 'notificacion' ya existe, agregar servicio de:
// - Email (sendgrid, mailgun)
// - SMS (twilio)
// - Push (Firebase Cloud Messaging)
```

---

## 9. Troubleshooting

### Error: "no se puede conectar a la base de datos"
```bash
# Verificar PostgreSQL está corriendo
pg_isready -h localhost -p 5432

# Probar conexión
psql -U postgres -h localhost -c "SELECT 1"

# Revisar DATABASE_URL en .env
```

### Error: "JWT signature invalid"
```bash
# Asegurar JWT_SECRET es igual en .env
# Limpiar tokens anteriores (cliente debe login nuevamente)
```

### Error: "Constraint violation"
```bash
# Revisar validaciones en DTOs (Zod schemas)
# Algunas restricciones CHECK importantes:
# - donor.estado IN ('PENDIENTE', 'RECIBIDO', 'RECHAZADO')
# - denuncia.estado IN ('RECIBIDA', 'EN_REVISION', 'INVESTIGACION', 'RESUELTA', 'DESCARTADA')
# - gasto.estado IN ('BORRADOR', 'PENDIENTE_APROBACION', 'APROBADO', 'RECHAZADO', 'PAGADO', 'ANULADO')
```

---

## 10. Contacto y Soporte

**Proyecto**: CHOCÓ TRANSPARENTE  
**Versión**: 1.0 (Todas las Fases Completadas)  
**Última actualización**: 2026-08-15  

Para preguntas técnicas, revisar:
- [PLAN_DESARROLLO_FASES.md](./PLAN_DESARROLLO_FASES.md)
- Comentarios en código fuente
- Tests en `pruebas/` como referencia de uso
