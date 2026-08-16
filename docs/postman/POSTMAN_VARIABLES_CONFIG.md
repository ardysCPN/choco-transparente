# Variables y Configuración de Postman

Este documento contiene información sobre las variables de entorno y configuración recomendada para la colección Postman de CHOCÓ TRANSPARENTE.

---

## Variables de Entorno

### Variables Globales (recomendado)

Copia y usa estas variables en Postman:

```json
{
  "id": "choco-transparente-env",
  "name": "CHOCÓ TRANSPARENTE - Development",
  "values": [
    {
      "key": "base_url",
      "value": "http://localhost:3000",
      "type": "string",
      "enabled": true
    },
    {
      "key": "jwt_token",
      "value": "",
      "type": "string",
      "enabled": true
    }
  ]
}
```

### Cómo crear un Environment en Postman

1. Click en **"Environments"** (lado izquierdo)
2. Click en **"+"** (crear nuevo)
3. Name: `CHOCÓ TRANSPARENTE - Development`
4. Agregar variables:
   - `base_url` = `http://localhost:3000`
   - `jwt_token` = (dejar vacío, se completa después)
5. Click **"Save"**

---

## Configuraciones de Desarrollo

### Base URL por entorno

| Entorno | URL |
|---------|-----|
| 🏠 Local | http://localhost:3000 |
| 🧪 Testing | http://testing.choco.gov:3000 |
| 📊 Staging | http://staging.choco.gov:3000 |
| 🚀 Producción | https://api.choco.gov |

**Cómo cambiar:**
1. Click en el dropdown de variables (esquina superior derecha)
2. Selecciona el environment deseado

---

## Credenciales de Prueba

### Usuarios predefinidos (ajustar según tu BD)

| Correo | Contraseña | Rol | Municipio |
|--------|-----------|-----|-----------|
| admin@choco.gov | Admin123! | SUPERADMIN | Global |
| coord@quibdo.gov | Coord123! | COORDINADOR_MUNICIPAL | Quibdó |
| oper@choco.gov | Oper123! | OPERADOR | Global |

**Cambiar credenciales:**
1. Login POST /api/v1/autenticacion/login
2. Usar las credenciales correctas
3. Copiar el token del response

---

## Pre-request Scripts (Automatización)

### Obtener automáticamente nuevo token

Puedes configurar un **Pre-request Script** en la colección para refrescar el token automáticamente.

En Postman:
1. Click en la carpeta **"FASE 1 - Autenticación"**
2. Click en la pestaña **"Pre-request Script"**
3. Pega esto:

```javascript
// Verificar si el token existe y es válido
const token = pm.variables.get("jwt_token");

if (!token) {
    console.log("⚠️ Token no disponible. Ejecutar Login primero.");
} else {
    console.log("✅ Token presente, usando: " + token.substring(0, 20) + "...");
}
```

### Script de test para copiar token automáticamente

En la petición **Login**:
1. Click en la pestaña **"Tests"**
2. Pega esto:

```javascript
// Guardar token en variables automáticamente
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.variables.set("jwt_token", response.token);
    console.log("✅ Token guardado automáticamente");
} else {
    console.log("❌ Login fallido");
}
```

---

## Headers Recomendados

### Headers por defecto (agregar en la colección)

En Postman:
1. Click en la colección **"CHOCÓ TRANSPARENTE"**
2. Click en **"Pre-request Script"**
3. Los headers se configuran en cada request

```
Content-Type: application/json
Authorization: Bearer {{jwt_token}}  (solo para endpoints autenticados)
Accept: application/json
```

---

## Tests Automáticos

### Validar respuesta de Login

En la petición **Login**, pestaña **Tests**:

```javascript
pm.test("Login successful", function () {
    pm.response.to.have.status(200);
    pm.expect(pm.response.json()).to.have.property('token');
});

pm.test("Response has required fields", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.usuario).to.have.property('correo');
    pm.expect(jsonData.usuario).to.have.property('rol');
});
```

### Validar creación de beneficiario

En la petición **Crear Beneficiario**, pestaña **Tests**:

```javascript
pm.test("Beneficiary created", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has required fields", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
    pm.expect(jsonData.nombre).to.equal("Carlos");
    pm.expect(jsonData.apellido).to.equal("Vásquez");
});

// Guardar ID para usar en solicitudes posteriores
if (pm.response.code === 200) {
    pm.variables.set("beneficiario_id", pm.response.json().id);
}
```

---

## Flujos de Ejecución (Workflows)

### Flujo 1: Teste rápido completo (3 minutos)

```
1. Login → copiar token
2. Crear Municipio
3. Crear Beneficiario
4. Ver Dashboard Público
5. Verificar Health Check
```

**Tiempo total:** ~2-3 minutos

### Flujo 2: Teste completo de emergencia (15 minutos)

```
1. Login
2. Crear Afectación
3. Crear Centro de Acopio
4. Crear Item Inventario
5. Registrar Entrada
6. Crear Beneficiario
7. Crear Solicitud de Ayuda
8. Registrar Salida
9. Registrar Entrega
10. Ver Dashboard Administrativo
11. Generar Reporte
```

**Tiempo total:** ~10-15 minutos

### Flujo 3: Teste financiero (10 minutos)

```
1. Login
2. Crear Donación en Dinero
3. Actualizar estado Donación
4. Crear Gasto
5. Aprobar Gasto
6. Ver Reporte de Donaciones
7. Ver Dashboard Administrativo
```

**Tiempo total:** ~8-10 minutos

---

## Configuración de Proxy (Opcional)

Si necesitas usar un proxy corporativo:

1. Click en **Settings** (icono de engranaje)
2. Click en **Proxy settings**
3. Marcar **"Add a custom proxy configuration"**
4. Configurar según tu red:
   ```
   HTTP Proxy: proxy.choco.gov:8080
   HTTPS Proxy: proxy.choco.gov:8080
   ```

---

## Sincronización en la Nube (Postman Pro/Enterprise)

Para trabajar en equipo:

1. Click en **"Sync"** (esquina superior derecha)
2. Login con cuenta Postman
3. Habilitar sincronización
4. Compartir colección con equipo

**Ventajas:**
- ✅ Todos ven cambios en tiempo real
- ✅ Historial de versiones
- ✅ Comentarios en requests
- ✅ Documentación colaborativa

---

## Troubleshooting

### Error: "Cannot GET /health"

```
✗ Problema: Servidor no está corriendo
✓ Solución:
  cd backend
  npm run dev
```

### Error: "Unauthorized"

```
✗ Problema: JWT token inválido o expirado
✓ Solución: Hacer login nuevamente para obtener nuevo token
```

### Error: "CORS policy blocked"

```
✗ Problema: Headers de CORS no configurados
✓ Solución: Revisar backend/.env CORS_ORIGIN
```

### Error: "Invalid JSON in request"

```
✗ Problema: Body malformado en POST/PUT
✓ Solución: Verificar sintaxis JSON usando jsonlint.com
```

### Error: "Database connection refused"

```
✗ Problema: PostgreSQL no está corriendo
✓ Solución:
  psql -U postgres -h localhost -c "SELECT 1"
  Si no conecta, iniciar PostgreSQL
```

---

## Atajos de Teclado (Windows)

| Atajo | Acción |
|-------|--------|
| Ctrl + Shift + O | Abrir colección |
| Ctrl + Alt + L | Ver logs |
| Ctrl + \ | Sidebar toggle |
| Ctrl + Enter | Enviar petición |
| Ctrl + S | Guardar |

---

## Mejores Prácticas

### 1. Organización
- ✅ Una variable por concepto (no guardar múltiples tokens)
- ✅ Nombrar requests de forma descriptiva
- ✅ Agrupar por módulo/fase

### 2. Seguridad
- ✅ Usar variables en lugar de hardcodear valores
- ✅ No guardar contraseñas en requests
- ✅ No commitear `postman_collection.json` con datos reales

### 3. Documentación
- ✅ Agregar descripciones en cada request
- ✅ Documentar parámetros no obvios
- ✅ Incluir ejemplos de response

### 4. Testing
- ✅ Agregar tests en requests críticas
- ✅ Verificar códigos de estado HTTP
- ✅ Validar estructura de response

---

## Líneas de Comando Útiles

### Generar un nuevo token rápidamente
```bash
curl -X POST http://localhost:3000/api/v1/autenticacion/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"admin@choco.gov","contrasena":"Admin123!"}'
```

### Probar un endpoint desde CLI
```bash
curl -X GET http://localhost:3000/health

curl -X GET http://localhost:3000/api/v1/municipios \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Exportar colección Postman (CLI)
```bash
postman-cli collections export --file postman_collection.json
```

---

## Contacto y Soporte

Para dudas sobre configuración:
- 📖 Revisar [POSTMAN_README.md](POSTMAN_README.md)
- 📋 Ver [CASOS_USO_POSTMAN.md](CASOS_USO_POSTMAN.md)
- 🔧 Revisar [DESPLIEGUE_Y_USO.md](DESPLIEGUE_Y_USO.md)

---

**Última actualización:** 2026-08-15  
**Versión:** 1.0
