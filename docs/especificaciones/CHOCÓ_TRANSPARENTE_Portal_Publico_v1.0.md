# CHOCÓ TRANSPARENTE
## Especificación Técnica — Portal Público v1.0

**Estado:** Lista para desarrollo  
**Base:** API REST existente + Especificación Técnica Maestra v1.0  
**Frontend:** React + Vite + TypeScript + PWA  
**Mapa:** Leaflet + OpenStreetMap  
**Backend:** reutilizar monolito modular existente  
**BD:** PostgreSQL + PostGIS  
**Idioma:** Español

---

## 1. Objetivo

Construir el Portal Público Ciudadano de Chocó Transparente para que cualquier ciudadano pueda consultar información pública sobre la emergencia, municipios, centros de acopio, inventarios agregados, albergues, afectaciones, necesidades y transparencia; además de participar mediante solicitudes de ayuda, donaciones, voluntariado, transporte, vinculación a centros y denuncias.

**No crear otro backend ni otra base de datos.**

La arquitectura será:

```text
Ciudadano
   |
HTTPS
   |
Portal Público React/PWA
   |
REST API existente
   |
PostgreSQL + PostGIS
   |
Storage de evidencias
```

---

# 2. Principio de reutilización de API

Antes de crear cualquier endpoint:

1. Revisar la colección Postman.
2. Verificar si ya existe el servicio.
3. Verificar autenticación.
4. Verificar que la respuesta sea segura para exposición pública.
5. Reutilizarlo si cumple.
6. Si requiere JWT pero la información debe ser pública, crear una capa de lectura pública controlada en el backend, reutilizando los mismos servicios internos.
7. Nunca exponer JWT administrativo ni datos privados al navegador.

La colección actual ya contiene servicios de municipios, afectaciones, centros, inventario, beneficiarios, solicitudes, entregas, albergues, denuncias, donaciones, gastos y dashboards.

Existe específicamente:

```http
GET /api/v1/dashboards/publico
```

sin token. Este endpoint debe ser la fuente principal del dashboard público.

---

# 3. Fases

```text
FASE 0  Auditoría API y contrato público
FASE 1  Estructura y navegación
FASE 2  Dashboard público
FASE 3  Mapa público
FASE 4  Municipios
FASE 5  Centros de acopio
FASE 6  Inventario público
FASE 7  Albergues y afectaciones
FASE 8  Solicitud de ayuda
FASE 9  ¿Cómo quieres ayudar?
FASE 10 Denuncias
FASE 11 Contactos oficiales
FASE 12 Transparencia financiera
FASE 13 PWA/offline
FASE 14 Seguridad y privacidad
FASE 15 Pruebas
FASE 16 Docker, despliegue y documentación
```

---

# 4. FASE 0 — Auditoría de API

Crear:

```text
docs/portal-publico/API_PORTAL_PUBLICO.md
```

Documentar:

| Funcionalidad | Endpoint | Auth | Acción |
|---|---|---|---|
| Dashboard | `/api/v1/dashboards/publico` | No | Reutilizar |
| Municipios | `/api/v1/municipios` | Sí | Evaluar capa pública |
| Afectaciones | `/api/v1/afectaciones` | Sí | Evaluar capa pública |
| Centros | `/api/v1/centros-acopio` | Sí | Evaluar capa pública |
| Inventario | `/api/v1/inventario/centro/{id}` | Sí | Crear consulta agregada pública |
| Albergues | `/api/v1/albergues` | Sí | Evaluar capa pública |
| Denuncias | `/api/v1/denuncias` | Sí | Formulario público controlado |
| Donaciones | `/api/v1/donaciones/*` | Sí | Flujo público controlado |

No romper endpoints privados existentes.

---

# 5. FASE 1 — Estructura

Rutas:

```text
/
/mapa
/municipios
/municipios/:id
/centros-acopio
/centros-acopio/:id
/inventario
/albergues
/afectaciones
/solicitar-ayuda
/como-ayudar
/donar
/voluntariado
/transporte
/centro-acopio
/denunciar
/contactos
/transparencia
```

La consulta pública no requiere login.

---

# 6. FASE 2 — Inicio y Dashboard

La página inicial debe contener:

- logo y nombre;
- menú;
- botón Ver mapa;
- botón ¿Cómo puedo ayudar?;
- estado general;
- indicadores;
- accesos rápidos.

Indicadores:

- municipios activos;
- centros aprobados;
- ayuda recibida;
- ayuda distribuida;
- inventario disponible;
- solicitudes pendientes;
- albergues disponibles;
- donaciones;
- gastos agregados;
- alertas.

Mostrar semáforo:

```text
VERDE    ESTABLE
AMARILLO ATENCIÓN
ROJO     ALERTA
```

No depender únicamente del color.

---

# 7. FASE 3 — Mapa público

Tecnología:

```text
Leaflet + OpenStreetMap
```

No usar Google Maps en MVP.

Capas:

```text
Municipios
Centros de acopio
Albergues
Afectaciones
Necesidades
Puntos de ayuda
```

Funciones:

- zoom;
- búsqueda;
- ubicación;
- filtros;
- activar/desactivar capas;
- seleccionar municipio;
- seleccionar punto.

Al seleccionar un punto mostrar únicamente información pública.

Nunca mostrar coordenadas exactas de hogares vulnerables.

---

# 8. FASE 4 — Municipios

Mostrar los 32 municipios con:

- nombre;
- estado;
- nivel de atención;
- afectaciones;
- centros;
- inventario agregado;
- albergues;
- necesidades;
- ayuda recibida;
- ayuda distribuida.

Filtros:

- municipio;
- estado;
- nivel de atención;
- tipo de afectación.

---

# 9. FASE 5 — Centros de acopio

Listado público únicamente de centros:

```text
estado = APROBADO
```

Mostrar:

- nombre;
- municipio;
- barrio;
- dirección pública;
- estado;
- capacidad;
- ubicación;
- foto autorizada;
- tipos de ayuda;
- inventario agregado;
- última actualización.

No mostrar información interna ni datos personales innecesarios.

## Solicitud pública de centro

Formulario:

```text
Nombre
Municipio
Barrio
Dirección
GPS
Responsable
Teléfono
Correo
Foto de fachada
```

Estado inicial:

```text
PENDIENTE
```

Flujo:

```text
Ciudadano
 -> PENDIENTE
 -> EN_REVISION
 -> APROBADO / RECHAZADO
```

---

# 10. FASE 6 — Inventario público

Mostrar por departamento, municipio y centro:

```text
Tipo de ayuda
Cantidad
Unidad
Peso si aplica
Última actualización
```

Ejemplo:

```text
Alimentos   1.200 unidades
Agua        2.500 unidades
Ropa          850 unidades
Kits          320 unidades
```

No mostrar usuarios, documentos internos, proveedores ni información privada.

---

# 11. FASE 7 — Albergues y afectaciones

## Albergues

Mostrar:

- nombre;
- municipio;
- dirección;
- ubicación;
- capacidad;
- ocupación;
- servicios;
- estado.

Estados:

```text
DISPONIBLE
CASI_LLENO
LLENO
CERRADO
```

## Afectaciones

Mostrar:

- municipio;
- zona;
- tipo;
- severidad;
- estado;
- personas afectadas agregadas;
- fecha de actualización.

Estados:

```text
ACTIVA
EN_ATENCION
CONTROLADA
CERRADA
```

---

# 12. FASE 8 — Solicitar ayuda

Botón:

```text
🆘 NECESITO AYUDA
```

Formulario mínimo:

- municipio;
- barrio/zona;
- número de personas;
- tipo de necesidad;
- descripción;
- prioridad;
- evidencia;
- ubicación aproximada;
- contacto.

Flujo:

```text
PENDIENTE
VALIDADA
PRIORIZADA
ASIGNADA
ATENDIDA
RECHAZADA
CANCELADA
```

No publicar automáticamente la solicitud.

---

# 13. Control de familias

La unidad principal es:

```text
FAMILIA / HOGAR
```

No persona individual.

Detectar posibles duplicados usando reglas internas.

Una familia no debe recibir múltiples ayudas idénticas dentro de una ventana configurable sin justificación.

Nunca publicar cédula, dirección exacta ni coordenadas exactas del hogar.

---

# 14. FASE 9 — ¿Cómo quieres ayudar?

Crear:

```text
🙋 Tengo algo para donar
🙌 Quiero ser voluntario
🚗 Tengo vehículo y puedo transportar
🏠 Trabajo en un centro de acopio
💰 Quiero realizar una donación monetaria
```

## Donación en especie

Campos:

- nombre;
- municipio;
- tipo de ayuda;
- cantidad;
- unidad;
- descripción;
- disponibilidad;
- teléfono;
- correo;
- ubicación;
- requiere transporte;
- observaciones.

Estado:

```text
PENDIENTE
```

No ingresar directamente al inventario.

## Voluntariado

Campos:

- nombre;
- municipio;
- teléfono;
- correo;
- tipo de apoyo;
- disponibilidad;
- observaciones.

Tipos:

```text
Clasificación
Carga/descarga
Cocina
Atención
Transporte
Administrativo
Otro
```

## Transporte

Campos:

- nombre;
- municipio;
- teléfono;
- vehículo;
- capacidad;
- disponibilidad;
- zonas;
- observaciones.

Estados:

```text
DISPONIBLE
ASIGNADO
NO_DISPONIBLE
```

## Vinculación a centro

Permitir seleccionar centro y enviar:

```text
Nombre
Teléfono
Correo
Actividad
Mensaje
```

La aprobación se realiza desde la plataforma privada.

---

# 15. Donación monetaria

Mostrar información oficial para donar.

Nunca almacenar secretos bancarios en frontend.

Mostrar únicamente información autorizada:

- entidad receptora;
- banco;
- tipo de cuenta;
- número parcialmente ofuscado;
- instrucciones oficiales.

El registro de una donación queda pendiente de validación.

---

# 16. FASE 10 — Denuncias

Botón:

```text
🚨 REPORTAR IRREGULARIDAD
```

Campos:

- tipo;
- municipio;
- barrio/zona;
- descripción;
- ubicación aproximada;
- evidencia;
- contacto opcional.

Estados:

```text
RECIBIDA
EN_REVISION
INVESTIGACION
RESUELTA
DESCARTADA
```

Una denuncia nunca modifica directamente inventario, donaciones o gastos.

Debe pasar por revisión.

Opcionalmente generar código:

```text
CT-2026-000001
```

para consulta de estado.

---

# 17. FASE 11 — Contactos oficiales

Crear sección:

```text
CONTACTOS OFICIALES
```

Por municipio:

- alcaldía;
- gestión del riesgo;
- bomberos;
- defensa civil;
- Cruz Roja;
- salud;
- hospitales;
- policía;
- otros organismos.

Campos:

```text
Entidad
Municipio
Tipo
Teléfono institucional
Correo institucional
Sitio web
Dirección
Horario
```

Solo usuarios autorizados pueden modificarlos.

---

# 18. FASE 12 — Caja transparente

Mostrar información financiera agregada:

- total recibido;
- total gastado;
- total disponible;
- número de donaciones;
- gastos aprobados;
- gastos pendientes.

Nunca publicar:

- número completo de cuenta;
- credenciales;
- documentos bancarios privados;
- datos personales innecesarios.

---

# 19. FASE 13 — PWA y offline

La PWA debe ser instalable.

Incluir:

```text
manifest.json
service worker
iconos
cache
```

En MVP el modo offline público será básico:

- contenido estático;
- última información disponible;
- navegación básica.

Los formularios públicos pueden implementar cola IndexedDB si se requiere:

```text
Formulario
 -> IndexedDB
 -> Pendiente
 -> Conexión
 -> API
 -> Confirmado
```

No convertir el offline público en bloqueante para la primera publicación.

---

# 20. FASE 14 — Seguridad y privacidad

Obligatorio:

- HTTPS;
- CORS restringido;
- rate limiting;
- validación;
- sanitización;
- protección XSS;
- protección de inyección;
- límites de archivos;
- validación MIME;
- nombres aleatorios;
- protección de almacenamiento.

Formularios públicos deben tener protección contra abuso y, si es necesario, CAPTCHA.

Nunca publicar:

```text
Cédula
Contraseña
Teléfono personal sin autorización
Dirección exacta de beneficiarios
Coordenadas exactas de hogares
Información médica
Datos bancarios sensibles
```

Regla:

```text
API pública -> solo devuelve datos públicos
```

No:

```text
API privada -> frontend oculta campos
```

---

# 21. Evidencias

Usar el storage existente:

```text
/storage/evidencias/
```

La BD debe conservar metadatos y ruta segura.

Ejemplo:

```text
/storage/evidencias/2026/08/uuid.jpg
```

Nunca usar nombres originales como nombre físico.

---

# 22. Endpoints públicos recomendados

Solo crear los que realmente hagan falta:

```http
GET  /api/v1/publico/dashboard
GET  /api/v1/publico/municipios
GET  /api/v1/publico/municipios/:id
GET  /api/v1/publico/centros-acopio
GET  /api/v1/publico/centros-acopio/:id
GET  /api/v1/publico/inventario
GET  /api/v1/publico/albergues
GET  /api/v1/publico/afectaciones
GET  /api/v1/publico/contactos
```

Capturas controladas:

```http
POST /api/v1/publico/solicitudes-ayuda
POST /api/v1/publico/centros-acopio
POST /api/v1/publico/donaciones
POST /api/v1/publico/voluntarios
POST /api/v1/publico/transportadores
POST /api/v1/publico/denuncias
POST /api/v1/publico/vinculaciones-centro
```

Los endpoints públicos deben reutilizar los servicios de negocio existentes.

---

# 23. Frontend

Estructura:

```text
frontend/
├── src/
│   ├── componentes/
│   ├── paginas/
│   ├── servicios/
│   ├── modelos/
│   ├── mapa/
│   ├── formularios-publicos/
│   ├── almacenamiento/
│   ├── utilidades/
│   └── rutas/
├── public/
├── Dockerfile
└── README.md
```

Servicios:

```text
DashboardPublicoServicio
MunicipioServicio
MapaServicio
CentroAcopioServicio
InventarioPublicoServicio
AlbergueServicio
AfectacionServicio
SolicitudAyudaPublicaServicio
DonacionPublicaServicio
VoluntariadoServicio
TransporteServicio
DenunciaPublicaServicio
ContactoOficialServicio
```

No realizar llamadas HTTP directamente dentro de componentes.

---

# 24. Componentes reutilizables

Crear:

```text
TarjetaIndicador
TarjetaCentroAcopio
TarjetaAlbergue
TarjetaMunicipio
MarcadorMapa
FiltroMunicipio
FiltroEstado
TablaInventario
ModalDetalle
FormularioEvidencia
EstadoSemaforo
Cargando
MensajeError
Paginacion
```

---

# 25. Rendimiento

Objetivos:

- mapa público < 3 segundos en condiciones razonables;
- API común < 500 ms como objetivo;
- paginación;
- carga diferida;
- imágenes optimizadas;
- compresión HTTP;
- índices geográficos.

Nunca cargar todos los registros completos al navegador si no son necesarios.

---

# 26. Accesibilidad y responsive

Mobile First.

Debe funcionar en:

- celular;
- tablet;
- portátil;
- escritorio.

Debe incluir:

- navegación con teclado;
- etiquetas;
- contraste;
- textos alternativos;
- botones descriptivos;
- mensajes claros;
- no depender solamente del color.

---

# 27. Pruebas

Probar:

- carga;
- navegación;
- mapa;
- filtros;
- formularios;
- validaciones;
- errores API;
- responsive;
- PWA;
- privacidad;
- rate limiting;
- archivos;
- duplicados;
- solicitudes;
- donaciones;
- voluntariado;
- transporte;
- denuncias;
- recuperación de conexión.

Casos críticos:

1. solicitud duplicada;
2. archivo inválido;
3. archivo demasiado grande;
4. acceso a información privada;
5. centro rechazado;
6. centro aprobado;
7. inventario;
8. albergue;
9. denuncia;
10. donación.

---

# 28. Docker y despliegue

No crear PostgreSQL adicional.

No crear segundo backend.

Contenedor frontend:

```text
choco-transparente-web
```

Variable:

```env
VITE_API_URL=
VITE_NOMBRE_APLICACION=CHOCÓ TRANSPARENTE
VITE_MAPA_PROVEEDOR=OPENSTREETMAP
```

Nunca colocar secretos en `VITE_*`.

El portal debe integrarse con el Docker Compose existente y poder desplegarse en el VPS actual.

---

# 29. Git

Ramas sugeridas:

```text
main
develop
feature/portal-publico
feature/mapa-publico
feature/dashboard-publico
feature/formularios-publicos
fix/*
```

Cada funcionalidad importante mediante Pull Request.

---

# 30. Documentación

Agregar:

```text
docs/portal-publico/
├── README.md
├── ARQUITECTURA.md
├── API_PORTAL_PUBLICO.md
├── PRIVACIDAD.md
├── SEGURIDAD.md
├── MAPA.md
├── FORMULARIOS.md
└── DESPLIEGUE.md
```

---

# 31. Fuera de alcance v1.0

No implementar todavía:

- IA;
- OCR;
- integración bancaria automática;
- BigQuery;
- AWS;
- aplicación móvil nativa;
- firma digital;
- optimización logística avanzada;
- predicción;
- múltiples departamentos;
- integración nacional compleja;
- WebSocket si no existe necesidad real.

---

# 32. Definición de terminado

El Portal Público v1.0 estará terminado cuando:

- [ ] sea accesible sin autenticación para consultas públicas;
- [ ] reutilice la API existente;
- [ ] no tenga BD propia;
- [ ] no exponga datos sensibles;
- [ ] tenga dashboard;
- [ ] tenga mapa;
- [ ] muestre municipios;
- [ ] muestre centros aprobados;
- [ ] muestre inventario agregado;
- [ ] muestre albergues;
- [ ] muestre afectaciones;
- [ ] permita solicitar ayuda;
- [ ] permita ofrecer donaciones;
- [ ] permita voluntariado;
- [ ] permita transporte;
- [ ] permita vinculación a centros;
- [ ] permita denuncias;
- [ ] muestre contactos oficiales;
- [ ] tenga protección contra abuso;
- [ ] sea responsive;
- [ ] sea PWA;
- [ ] tenga offline básico;
- [ ] tenga pruebas;
- [ ] tenga documentación;
- [ ] esté dockerizado;
- [ ] pueda desplegarse en el VPS;
- [ ] pueda entregarse a la administración pública.

---

# 33. Principio final

El Portal Público debe ser:

**simple + rápido + seguro + transparente + territorial + accesible + mantenible.**

Prioridad:

```text
1. Reutilizar API existente
2. Proteger información privada
3. Publicar información útil
4. Facilitar participación ciudadana
5. Mantener trazabilidad
6. Evitar duplicación técnica
7. Desplegar rápidamente
8. Documentar para transferencia institucional
```

**Fin — CHOCÓ TRANSPARENTE Portal Público v1.0**
