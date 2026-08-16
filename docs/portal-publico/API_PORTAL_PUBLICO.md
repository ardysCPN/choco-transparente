# CHOCÓ TRANSPARENTE — PORTAL PÚBLICO
## Documento de Auditoría y Contrato de API Pública v1.0

**Fecha de Auditoría:** 16 de Agosto de 2026  
**Objetivo:** Definir la capa de acceso público `/api/v1/publico/*` garantizando **cero exposición de datos sensibles** y reutilizando al 100% los servicios de la arquitectura modular existente.

---

## 1. Matriz de Auditoría de Endpoints Existentes

| Funcionalidad | Endpoint Existente | Auth Requerida | Estrategia Capa Pública |
|---|---|---|---|
| **Dashboard Público** | `GET /api/v1/dashboards/publico` | No | Reutilizar directamente en `/api/v1/publico/dashboard` |
| **Municipios** | `GET /api/v1/municipios` | Sí (JWT) | Capa pública `GET /api/v1/publico/municipios` con estadísticas agregadas |
| **Detalle Municipio** | `GET /api/v1/municipios/:id` | Sí (JWT) | Capa pública `GET /api/v1/publico/municipios/:id` con afectaciones y centros |
| **Centros de Acopio** | `GET /api/v1/centros-acopio` | Sí (JWT) | Capa pública filtrando **únicamente centros con `estado = 'APROBADO'`** |
| **Inventario Agregado** | `GET /api/v1/inventario/centro/:id` | Sí (JWT) | Consulta pública agregada por tipo de ayuda y municipio (sin proveedores ni documentos internos) |
| **Albergues** | `GET /api/v1/albergues` | Sí (JWT) | Capa pública con capacidad, ocupación y servicios (semáforo de disponibilidad) |
| **Afectaciones** | `GET /api/v1/afectaciones` | Sí (JWT) | Capa pública con tipo, severidad y estado (sin nombres de familias) |
| **Solicitud de Ayuda** | `POST /api/v1/solicitudes-ayuda` | Sí (JWT) | Formulario público controlado (`POST /api/v1/publico/solicitudes-ayuda`) en estado `PENDIENTE` |
| **Registro de Donación**| `POST /api/v1/donaciones/*` | Sí (JWT) | Formulario público de intención de donación en dinero o especie en estado `PENDIENTE` |
| **Denuncias** | `POST /api/v1/denuncias` | Sí (JWT) | Formulario ciudadano público con generación de código de radicado `CT-2026-XXXXXX` |
| **Contactos Oficiales** | `GET /api/v1/publico/contactos` | No (Nuevo) | Directorio institucional público por municipio |

---

## 2. Contrato de la API Pública (`/api/v1/publico/*`)

### A. Consultas Públicas (Lectura sin Token)

#### 1. `GET /api/v1/publico/dashboard`
Retorna el estado general del departamento, KPIs consolidados, semáforo departamental y cobertura territorial de los 31 municipios.
```json
{
  "exito": true,
  "mensaje": "Dashboard público consultado correctamente",
  "datos": {
    "resumen": {
      "total_afectaciones_activas": 12,
      "total_centros_aprobados": 8,
      "total_familias_registradas": 350,
      "total_solicitudes_atendidas": 280,
      "total_donaciones_dinero": 150000000,
      "total_gastos_aprobados": 45000000
    },
    "cobertura_territorial": [ ... ]
  }
}
```

#### 2. `GET /api/v1/publico/municipios`
Listado de los 31 municipios oficiales con indicadores de alerta, afectaciones activas y centros de acopio aprobados.

#### 3. `GET /api/v1/publico/municipios/:id`
Ficha territorial del municipio con afectaciones, albergues y centros habilitados.

#### 4. `GET /api/v1/publico/centros-acopio`
Listado georreferenciado de centros de acopio autorizados y aprobados.
- **Seguridad:** No expone datos de auditorías internas ni notas confidenciales.

#### 5. `GET /api/v1/publico/inventario`
Existencias consolidadas por categoría de ayuda humanitaria (Alimentos, Agua, Kits de Aseo, Colchonetas, etc.) a nivel departamental y municipal.

#### 6. `GET /api/v1/publico/albergues`
Directorio de albergues temporales con semáforo de capacidad (`DISPONIBLE`, `CASI_LLENO`, `LLENO`, `CERRADO`).

#### 7. `GET /api/v1/publico/afectaciones`
Mapa de eventos activos (Inundaciones, Deslizamientos, Vendavales) geolocalizados.

#### 8. `GET /api/v1/publico/contactos`
Directorio telefónico y correos de organismos de socorro (Alcaldías, Bomberos, Defensa Civil, Cruz Roja, Policía, Hospitales) por municipio.

---

### B. Formularios de Participación Ciudadana (Captura Controlada)

#### 1. `POST /api/v1/publico/solicitudes-ayuda`
Registro de solicitud de ayuda humanitaria por parte de una familia o líder comunitario.
- **Entrada:** `municipioId`, `barrio`, `direccionAproximada`, `cantidadPersonas`, `tipoNecesidad`, `descripcion`, `contacto`, `evidencia` (opcional).
- **Estado Inicial:** `PENDIENTE`.

#### 2. `POST /api/v1/publico/centros-acopio`
Propuesta de habilitación de nuevo centro de acopio comunitario.
- **Estado Inicial:** `PENDIENTE` (requiere auditoría técnica antes de ser visible en el portal).

#### 3. `POST /api/v1/publico/donaciones`
Registro de intención de donación (monetaria o en especie).
- **Estado Inicial:** `PENDIENTE`.

#### 4. `POST /api/v1/publico/voluntarios`
Inscripción en la red de voluntariado departamental (Clasificación, Carga, Cocina, Atención, Transporte).

#### 5. `POST /api/v1/publico/transportadores`
Ofrecimiento de vehículos y capacidad de transporte (Lanchas, Camiones, Camionetas).

#### 6. `POST /api/v1/publico/denuncias`
Reporte ciudadano anónimo o identificado de presuntas irregularidades.
- **Respuesta:** Retorna código único de seguimiento (ej. `CT-2026-000123`).

#### 7. `POST /api/v1/publico/vinculaciones-centro`
Postulación de apoyo a un centro de acopio específico.

---

## 3. Principio de No Fuga de Información Sensible (Zero-Leakage)

1. **Protección en Backend:** La API pública filtra los campos sensibles en la consulta a la base de datos con `select` específicos.
2. **Campos Prohibidos en API Pública:**
   - Cédulas / Números de documento de identidad.
   - Direcciones exactas de hogares y familias.
   - Coordenadas geográficas micrométricas de viviendas particulares.
   - Datos bancarios completos (números de cuenta completos o claves).
   - Notas internas de auditoría y nombres de auditores personales.
