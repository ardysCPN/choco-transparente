# CHOCÓ TRANSPARENTE
## Especificación Técnica Maestra — Versión 1.0

**Proyecto:** Plataforma departamental de transparencia, coordinación y trazabilidad de ayuda humanitaria  
**Versión:** 1.0  
**Estado:** Especificación base para inicio de desarrollo  
**Arquitectura:** Monolito modular dockerizado  
**Base de datos:** PostgreSQL + PostGIS  
**Frontend:** PWA  
**Idioma del código/documentación:** Español  
**Repositorio:** GitHub  
**Despliegue:** Docker Compose sobre VPS

---

# 1. Propósito

CHOCÓ TRANSPARENTE es una plataforma tecnológica para centralizar, coordinar, auditar y visualizar la gestión de ayuda humanitaria en el departamento del Chocó.

La plataforma debe permitir conocer:

- dónde existen afectaciones;
- qué municipios requieren atención;
- dónde existen centros de acopio;
- qué ayuda ha ingresado;
- qué ayuda ha salido;
- qué inventario existe;
- quién recibió o entregó ayuda;
- qué donaciones se recibieron;
- qué gastos se realizaron;
- qué centros fueron auditados;
- qué denuncias ciudadanas existen;
- dónde están los albergues;
- y qué información puede hacerse pública sin exponer datos sensibles.

El sistema debe priorizar transparencia, trazabilidad, seguridad, evidencia y facilidad de transferencia a la administración pública.

---

# 2. Principios del proyecto

1. Código abierto/documentado para facilitar transferencia.
2. Arquitectura sencilla de operar.
3. Monolito modular antes que microservicios.
4. Todo debe funcionar mediante Docker.
5. PostgreSQL como base principal.
6. PostGIS para geolocalización.
7. PWA para acceso multiplataforma.
8. Separación estricta entre información pública y privada.
9. Toda operación crítica debe quedar auditada.
10. No se deben publicar datos personales sensibles.
11. Los usuarios solamente podrán operar sobre las organizaciones/ámbitos que tengan autorizados.
12. La información financiera crítica requiere trazabilidad y aprobación.
13. Las evidencias fotográficas deben conservarse asociadas a la operación.
14. El sistema debe poder desplegarse en otro VPS sin depender de infraestructura propietaria.

---

# 3. Arquitectura general

Se utilizará un **monolito modular**.

No se utilizarán microservicios en el MVP porque aumentarían innecesariamente la complejidad operacional.

## Componentes

```text
                    INTERNET
                       |
                    HTTPS
                       |
                 Reverse Proxy
                       |
              +------------------+
              |   PWA Frontend   |
              | React + Vite     |
              +------------------+
                       |
                    REST API
                       |
              +------------------+
              | Backend Monolito |
              | Node.js + Express|
              +------------------+
                  |           |
                  |           |
          +-------+--+    +---+----------+
          | PostgreSQL|    | Storage      |
          | + PostGIS |    | Evidencias   |
          +-----------+    +--------------+
```

## Contenedores iniciales

- `choco-transparente-web`
- `choco-transparente-api`
- `choco-transparente-db`
- `choco-transparente-proxy`

El almacenamiento de archivos se manejará mediante volumen persistente.

---

# 4. Tecnologías

## Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- PWA
- Leaflet
- OpenStreetMap
- Axios o cliente HTTP equivalente
- IndexedDB para operaciones offline

## Backend

- Node.js 20+
- Express
- TypeScript
- Prisma ORM
- JWT
- bcrypt/Argon2 para contraseñas
- Zod o mecanismo equivalente de validación

## Base de datos

- PostgreSQL
- PostGIS

## Infraestructura

- Docker
- Docker Compose
- VPS Linux
- Reverse proxy
- HTTPS
- GitHub

---

# 5. Convención obligatoria de idioma

El código funcional debe utilizar nombres en español.

Ejemplos:

```text
Usuario
Rol
Permiso
Municipio
CentroAcopio
Inventario
EntradaInventario
SalidaInventario
Beneficiario
SolicitudAyuda
EntregaAyuda
Donacion
Gasto
Factura
Albergue
Afectacion
Denuncia
Notificacion
Auditoria
```

Los endpoints también utilizarán español:

```text
/api/v1/usuarios
/api/v1/municipios
/api/v1/centros-acopio
/api/v1/inventarios
/api/v1/entradas-inventario
/api/v1/salidas-inventario
/api/v1/solicitudes-ayuda
/api/v1/entregas-ayuda
/api/v1/donaciones
/api/v1/gastos
/api/v1/albergues
/api/v1/afectaciones
/api/v1/denuncias
```

Las variables, clases, interfaces, DTO, servicios, controladores y comentarios deberán estar en español.

Las librerías externas y términos propios de framework conservan su nombre original.

---

# 6. Estructura del backend

```text
backend/
├── src/
│   ├── configuracion/
│   ├── comun/
│   ├── autenticacion/
│   ├── usuarios/
│   ├── roles/
│   ├── permisos/
│   ├── municipios/
│   ├── afectaciones/
│   ├── centros-acopio/
│   ├── auditorias/
│   ├── inventarios/
│   ├── lotes/
│   ├── beneficiarios/
│   ├── solicitudes-ayuda/
│   ├── entregas-ayuda/
│   ├── donaciones/
│   ├── gastos/
│   ├── facturas/
│   ├── albergues/
│   ├── denuncias/
│   ├── notificaciones/
│   ├── reportes/
│   ├── archivos/
│   └── app.ts
├── prisma/
│   ├── schema.prisma
│   └── migraciones/
├── pruebas/
├── Dockerfile
├── package.json
└── README.md
```

Cada módulo deberá seguir:

```text
modulo/
├── controlador/
├── servicio/
├── repositorio/
├── dto/
├── validaciones/
├── rutas/
└── tipos/
```

---

# 7. Estructura del frontend

```text
frontend/
├── src/
│   ├── autenticacion/
│   ├── componentes/
│   ├── paginas/
│   ├── modulos/
│   ├── servicios/
│   ├── modelos/
│   ├── almacenamiento/
│   ├── mapa/
│   ├── notificaciones/
│   ├── utilidades/
│   └── rutas/
├── public/
├── Dockerfile
└── README.md
```

---

# 8. Actores

## 8.1 Público

Puede:

- consultar información pública;
- visualizar mapa;
- consultar municipios;
- consultar centros de acopio aprobados;
- consultar albergues;
- consultar indicadores;
- registrar solicitudes públicas;
- registrar solicitudes de centros;
- realizar denuncias.

No puede consultar datos personales sensibles.

## 8.2 Coordinador

Puede gestionar:

- centros de acopio autorizados;
- inventario;
- entradas;
- salidas;
- lotes;
- entregas;
- solicitudes;
- evidencias.

## 8.3 Auditor

Puede:

- revisar centros;
- aprobar/rechazar centros;
- revisar evidencias;
- revisar operaciones;
- generar hallazgos;
- consultar trazabilidad.

## 8.4 Veedor

Puede:

- consultar información pública;
- revisar movimientos públicos;
- registrar denuncias;
- adjuntar evidencia;
- hacer seguimiento de denuncias.

## 8.5 Organización / ONG

Puede:

- registrar organización;
- solicitar vinculación;
- registrar donaciones;
- registrar operaciones autorizadas;
- consultar sus operaciones;
- adjuntar soportes.

## 8.6 Administrador

Administra su ámbito autorizado.

## 8.7 Superadministrador

Tiene acceso global.

Puede:

- crear usuarios;
- crear roles;
- asignar organizaciones;
- configurar permisos;
- consultar todo el sistema;
- administrar municipios;
- administrar catálogos;
- administrar configuraciones;
- consultar auditoría global.

---

# 9. Aislamiento de información

Regla fundamental:

> Un usuario solamente puede consultar y modificar información correspondiente a su ámbito autorizado.

Ejemplo:

Un usuario asociado al municipio A no puede consultar operaciones privadas del municipio B.

El Superadministrador constituye la excepción y tiene alcance global.

Este aislamiento debe implementarse en backend, no solamente ocultando elementos de la interfaz.

---

# 10. Modelo de datos principal

## Municipio

Campos principales:

- id
- nombre
- codigo
- latitud
- longitud
- estado
- fecha_creacion
- fecha_actualizacion

## Usuario

- id
- nombre
- apellido
- correo
- telefono
- documento
- contrasena_hash
- activo
- rol_id
- municipio_id
- organizacion_id
- fecha_creacion
- fecha_actualizacion

## Rol

- id
- nombre
- descripcion
- activo

## Permiso

- id
- codigo
- nombre
- descripcion

## RolPermiso

- rol_id
- permiso_id

## Organizacion

- id
- nombre
- tipo
- identificacion
- responsable
- telefono
- correo
- estado
- fecha_creacion

---

# 11. Afectaciones

Representa una situación que requiere atención.

Campos:

- id
- municipio_id
- nombre
- descripcion
- tipo
- severidad
- estado
- latitud
- longitud
- direccion
- fecha_inicio
- fecha_registro
- creado_por

Estados:

- ACTIVA
- EN_ATENCION
- CONTROLADA
- CERRADA

Tipos configurables:

- terremoto
- inundacion
- deslizamiento
- incendio
- desplazamiento
- otro

---

# 12. Centros de acopio

Campos:

- id
- municipio_id
- organizacion_id
- nombre
- direccion
- barrio
- responsable
- telefono
- latitud
- longitud
- foto_fachada
- estado
- fecha_solicitud
- fecha_aprobacion
- aprobado_por

Estados:

- PENDIENTE
- EN_REVISION
- APROBADO
- RECHAZADO
- SUSPENDIDO
- CERRADO

---

# 13. Auditoría de centros

Toda aprobación/rechazo debe registrar:

- centro_id
- auditor_id
- decision
- comentario
- foto_evidencia
- latitud
- longitud
- fecha

Una aprobación debe quedar asociada a evidencia.

---

# 14. Inventario

## Inventario

- id
- centro_acopio_id
- municipio_id
- tipo_ayuda
- unidad_medida
- cantidad_actual
- peso_actual
- fecha_actualizacion

## Lote

- id
- codigo_qr
- inventario_id
- tipo_ayuda
- cantidad_inicial
- cantidad_actual
- peso
- fecha_ingreso
- origen
- estado

---

# 15. Entrada de inventario

Campos:

- id
- centro_acopio_id
- lote_id
- tipo_ayuda
- cantidad
- peso
- origen
- numero_documento
- foto_camion
- fecha
- usuario_id

Una entrada incrementa el inventario.

---

# 16. Salida de inventario

Campos:

- id
- centro_acopio_id
- lote_id
- cantidad
- peso
- beneficiario_id
- municipio_id
- barrio
- foto_entrega
- fecha
- usuario_id

Una salida disminuye el inventario.

Nunca se permitirá inventario negativo.

---

# 17. Beneficiario / familia

La unidad principal será la **familia/hogar**, no la persona individual.

Campos:

- id
- codigo_familia
- municipio_id
- barrio
- direccion
- latitud
- longitud
- cantidad_personas
- contacto
- estado
- fecha_registro

Los documentos sensibles deben permanecer privados.

El código de familia permitirá controlar solicitudes duplicadas sin exponer públicamente la identidad.

---

# 18. Solicitud de ayuda

Campos:

- id
- beneficiario_id
- afectacion_id
- tipo_necesidad
- prioridad
- descripcion
- cantidad_solicitada
- evidencia
- estado
- fecha_solicitud
- atendida_por

Estados:

- PENDIENTE
- VALIDADA
- PRIORIZADA
- ASIGNADA
- ATENDIDA
- RECHAZADA
- CANCELADA

---

# 19. Entrega de ayuda

Debe registrar:

- solicitud_id
- beneficiario_id
- lote_id
- cantidad
- responsable_entrega
- evidencia
- fecha
- ubicacion
- observaciones

Debe impedir duplicaciones mediante reglas de negocio.

---

# 20. Donaciones

## Donacion

- id
- organizacion_id
- tipo
- donante
- monto
- descripcion
- municipio_id
- fecha
- estado

Tipos:

- DINERO
- ESPECIE

## DonacionDinero

- donacion_id
- cuenta_destino
- referencia
- monto
- soporte_archivo

## DonacionEspecie

- donacion_id
- tipo_ayuda
- cantidad
- peso
- unidad_medida

---

# 21. Caja transparente

La plataforma debe permitir publicar información financiera agregada:

- total recibido;
- total gastado;
- total disponible;
- cantidad de donaciones;
- gastos aprobados;
- gastos pendientes.

Nunca se publicarán:

- números completos de cuenta;
- credenciales;
- datos bancarios sensibles;
- información personal innecesaria.

---

# 22. Gastos

Campos:

- id
- organizacion_id
- concepto
- monto
- proveedor
- numero_factura
- fecha
- soporte
- estado
- creado_por
- aprobado_por

Estados:

- BORRADOR
- PENDIENTE_APROBACION
- APROBADO
- RECHAZADO
- PAGADO
- ANULADO

---

# 23. Aprobación financiera

Para montos configurables se podrá exigir doble aprobación.

Ejemplo:

```text
Monto < límite:
    aprobación normal

Monto >= límite:
    aprobación de responsable + auditor
```

El límite debe ser configurable.

---

# 24. Albergues

Campos:

- id
- municipio_id
- nombre
- direccion
- latitud
- longitud
- capacidad
- ocupacion
- responsable
- telefono
- servicios
- estado
- fecha_actualizacion

Estados:

- DISPONIBLE
- CASI_LLENO
- LLENO
- CERRADO

---

# 25. Denuncias ciudadanas

Campos:

- id
- tipo
- descripcion
- municipio_id
- barrio
- latitud
- longitud
- evidencia
- fecha
- estado
- respuesta
- atendido_por

Estados:

- RECIBIDA
- EN_REVISION
- INVESTIGACION
- RESUELTA
- DESCARTADA

---

# 26. Notificaciones

Eventos mínimos:

- centro pendiente de auditoría;
- centro aprobado;
- centro rechazado;
- nueva solicitud;
- nueva denuncia;
- inventario bajo;
- nueva donación;
- gasto pendiente;
- gasto aprobado;
- gasto rechazado;
- nueva entrada;
- nueva salida.

---

# 27. Mapa

Se utilizará:

**Leaflet + OpenStreetMap**

No se dependerá inicialmente de Google Maps.

Capas:

- municipios;
- afectaciones;
- centros de acopio;
- albergues;
- necesidades;
- solicitudes;
- puntos de ayuda.

La información privada nunca debe aparecer en el mapa público.

---

# 28. Dashboard público

Debe mostrar:

- municipios activos;
- centros de acopio aprobados;
- total de ayuda recibida;
- total de ayuda distribuida;
- inventario disponible;
- solicitudes pendientes;
- albergues disponibles;
- donaciones;
- gastos;
- alertas.

Los indicadores deben estar agregados.

---

# 29. Dashboard administrativo

Debe mostrar:

- inventario;
- entradas;
- salidas;
- solicitudes;
- entregas;
- centros;
- auditorías;
- donaciones;
- gastos;
- denuncias;
- usuarios;
- alertas.

---

# 30. Requisitos funcionales

## RF-001 Autenticación

El sistema debe permitir iniciar sesión mediante correo y contraseña.

## RF-002 Autorización

El backend debe validar rol y permisos.

## RF-003 Gestión de usuarios

Debe permitir crear, editar, activar, desactivar y consultar usuarios según permisos.

## RF-004 Gestión de roles

Debe permitir administrar roles y permisos.

## RF-005 Gestión de municipios

Debe permitir administrar los 32 municipios.

## RF-006 Mapa departamental

Debe mostrar información geográfica pública.

## RF-007 Gestión de afectaciones

Debe permitir registrar y actualizar afectaciones.

## RF-008 Solicitud pública de centro

El ciudadano podrá solicitar registrar un centro.

## RF-009 Auditoría de centros

El auditor podrá aprobar o rechazar centros.

## RF-010 Evidencias

Las operaciones podrán almacenar fotografías.

## RF-011 Inventario

El sistema deberá mantener inventario por centro.

## RF-012 Entrada de inventario

Debe incrementar existencias.

## RF-013 Salida de inventario

Debe disminuir existencias.

## RF-014 Lotes

Debe existir trazabilidad por lote.

## RF-015 QR

Debe poder identificarse un lote mediante QR.

## RF-016 Solicitudes de ayuda

Debe permitir registrar necesidades.

## RF-017 Priorización

Debe permitir priorizar solicitudes.

## RF-018 Entregas

Debe permitir registrar entregas.

## RF-019 Control de duplicados

Debe detectar solicitudes potencialmente duplicadas de una misma familia.

## RF-020 Donaciones

Debe permitir registrar donaciones.

## RF-021 Gastos

Debe permitir registrar gastos.

## RF-022 Aprobación financiera

Debe controlar gastos que requieran aprobación.

## RF-023 Facturas

Debe permitir adjuntar soportes.

## RF-024 Caja transparente

Debe mostrar información financiera pública agregada.

## RF-025 ONG

Debe permitir registrar organizaciones.

## RF-026 Albergues

Debe permitir registrar y consultar albergues.

## RF-027 Veeduría

Debe permitir registrar denuncias.

## RF-028 Notificaciones

Debe generar notificaciones de eventos relevantes.

## RF-029 Auditoría

Debe registrar operaciones críticas.

## RF-030 Reportes

Debe generar reportes administrativos.

## RF-031 Exportación

Debe permitir exportar información autorizada a CSV/PDF.

## RF-032 Operación offline

La PWA debe permitir registrar operaciones previamente habilitadas sin internet.

## RF-033 Sincronización

Los registros offline deben sincronizarse posteriormente.

## RF-034 Resolución de conflictos

El backend debe detectar conflictos de sincronización.

## RF-035 Gestión documental

Debe permitir almacenar evidencias y documentos.

## RF-036 Control de archivos

Solo se permitirán formatos y tamaños autorizados.

## RF-037 Geolocalización

Debe permitir capturar coordenadas cuando el dispositivo lo permita.

## RF-038 Indicadores

Debe calcular indicadores departamentales y municipales.

## RF-039 Filtros

Las listas deben permitir búsqueda y filtrado.

## RF-040 Paginación

Las consultas grandes deben utilizar paginación.

## RF-041 Trazabilidad

Las operaciones críticas no deben eliminarse físicamente sin conservar trazabilidad.

## RF-042 Administración global

El superadministrador tendrá alcance total.

## RF-043 Control territorial

Los usuarios deberán estar asociados a un ámbito autorizado.

## RF-044 Catálogos

Los tipos de ayuda, necesidades y estados deben ser configurables.

## RF-045 Configuración

Los parámetros de negocio deberán ser configurables por administración autorizada.

---

# 31. Reglas de negocio críticas

### RN-001
No se puede realizar una salida si no existe inventario suficiente.

### RN-002
No se puede aprobar un centro sin auditoría.

### RN-003
Toda entrada debe tener responsable.

### RN-004
Toda salida debe tener responsable.

### RN-005
Toda operación crítica debe registrar fecha y usuario.

### RN-006
Una familia no debe recibir múltiples ayudas idénticas dentro de una ventana configurable sin justificación.

### RN-007
El inventario nunca puede ser negativo.

### RN-008
Los documentos sensibles no se muestran públicamente.

### RN-009
El superadministrador puede consultar todo.

### RN-010
Los demás usuarios están limitados por organización/municipio/permisos.

### RN-011
Una denuncia no modifica inventario directamente.

### RN-012
La denuncia debe pasar por revisión.

### RN-013
Una salida debe estar relacionada con un lote cuando corresponda.

### RN-014
Los cambios financieros críticos deben quedar auditados.

### RN-015
Las evidencias no deben poder reemplazarse silenciosamente.

---

# 32. Seguridad

Obligatorio:

- HTTPS.
- JWT.
- Hash seguro.
- expiración de tokens.
- renovación controlada.
- autorización backend.
- validación de entradas.
- sanitización.
- rate limiting.
- CORS restringido.
- protección contra subida de archivos maliciosos.
- límite de tamaño.
- nombres aleatorios para archivos.
- no ejecutar archivos subidos.
- backups cifrados cuando sea posible.
- secretos mediante variables de entorno.
- no almacenar contraseñas en código.
- no almacenar API keys en frontend.
- logs sin datos sensibles.

---

# 33. Privacidad

Los datos públicos deben ser mínimos.

Nunca publicar:

- cédula;
- contraseña;
- teléfono personal sin autorización;
- dirección exacta de beneficiarios;
- coordenadas exactas de hogares vulnerables;
- información médica;
- datos bancarios sensibles.

Para el público:

```text
Municipio
Barrio/zona
Cantidad de personas
Necesidad
Estado
```

---

# 34. Evidencias

Las imágenes deben almacenarse en:

```text
/storage/evidencias/
```

La base de datos conserva únicamente metadatos y ruta segura.

Ejemplo:

```text
/storage/evidencias/2026/08/uuid.jpg
```

Nunca utilizar nombres originales como nombre físico del archivo.

---

# 35. API

Formato:

```text
/api/v1/
```

Respuesta estándar:

```json
{
  "exito": true,
  "mensaje": "Operación realizada correctamente",
  "datos": {}
}
```

Error:

```json
{
  "exito": false,
  "mensaje": "No tiene permisos para realizar esta operación",
  "codigo": "SIN_PERMISO"
}
```

---

# 36. DTO

Ejemplo:

```text
CrearCentroAcopioDto
ActualizarCentroAcopioDto
CrearEntradaInventarioDto
CrearSalidaInventarioDto
CrearSolicitudAyudaDto
CrearEntregaAyudaDto
CrearDonacionDto
CrearGastoDto
CrearUsuarioDto
ActualizarUsuarioDto
CrearDenunciaDto
CrearAlbergueDto
```

Los DTO deben validar obligatorios, tipos, rangos y archivos.

---

# 37. Auditoría técnica

Tabla:

```text
auditoria
```

Campos:

- id
- usuario_id
- modulo
- accion
- entidad
- entidad_id
- datos_anteriores
- datos_nuevos
- ip
- fecha

Acciones:

- CREAR
- ACTUALIZAR
- ELIMINAR
- APROBAR
- RECHAZAR
- LOGIN
- LOGOUT
- EXPORTAR

---

# 38. Offline

Se utilizará IndexedDB.

Flujo:

```text
Usuario
   |
Sin internet
   |
Guardar operación local
   |
Cola de sincronización
   |
Detectar conexión
   |
Enviar al backend
   |
Confirmar
   |
Marcar sincronizado
```

Cada operación tendrá:

- identificador local;
- fecha;
- estado;
- intentos;
- datos;
- hash/idempotencia.

---

# 39. Idempotencia

Las operaciones sincronizadas deben evitar duplicaciones.

Cada operación offline debe incluir un identificador único.

El backend rechazará una segunda operación con el mismo identificador.

---

# 40. Rendimiento

Objetivos iniciales:

- mapa público: < 3 segundos en condiciones razonables;
- API común: < 500 ms objetivo;
- consultas paginadas;
- índices geográficos;
- imágenes optimizadas;
- carga diferida;
- compresión HTTP.

---

# 41. Escalabilidad

Objetivo inicial:

- 500 usuarios concurrentes.

La arquitectura debe permitir aumentar recursos del VPS sin modificar el sistema.

---

# 42. Backups

Debe existir:

- backup PostgreSQL diario;
- backup de archivos;
- retención configurable;
- prueba periódica de restauración.

Nunca considerar backup exitoso solamente porque el archivo fue generado.

Debe probarse la restauración.

---

# 43. Docker

Debe existir:

```text
docker-compose.yml
.env.example
README.md
```

El despliegue debe poder realizarse mediante:

```bash
docker compose up -d --build
```

Los datos deben persistir mediante volúmenes.

---

# 44. Variables de entorno

Nunca incluir secretos en Git.

Ejemplo:

```env
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_DB=choco_transparente
POSTGRES_USER=...
POSTGRES_PASSWORD=...

JWT_SECRETO=...

STORAGE_RUTA=/storage/evidencias
```

---

# 45. Git

Ramas:

```text
main
develop
feature/*
fix/*
hotfix/*
```

Todo cambio debe pasar por pull request cuando exista equipo.

Los commits deben ser descriptivos.

---

# 46. Documentación obligatoria

El repositorio deberá incluir:

```text
README.md
ARQUITECTURA.md
INSTALACION.md
DESPLIEGUE.md
BASE_DATOS.md
API.md
SEGURIDAD.md
BACKUPS.md
CONTRIBUIR.md
LICENCIA.md
```

También:

```text
docs/
├── arquitectura/
├── base-datos/
├── api/
├── seguridad/
├── despliegue/
└── manuales/
```

---

# 47. Código documentado

Los componentes importantes deberán incluir comentarios explicando:

- propósito;
- reglas de negocio;
- decisiones técnicas;
- restricciones;
- operaciones críticas.

No llenar el código de comentarios obvios.

Documentar especialmente las decisiones que otro equipo necesitará comprender para mantener el sistema.

---

# 48. Pruebas

Debe existir:

- pruebas unitarias;
- pruebas de servicios;
- pruebas de API;
- pruebas de autorización;
- pruebas de inventario;
- pruebas de duplicados;
- pruebas de sincronización;
- pruebas de archivos;
- pruebas de seguridad básicas.

Casos críticos:

1. inventario insuficiente;
2. usuario sin permiso;
3. usuario de otro municipio;
4. superadministrador;
5. duplicación de solicitud;
6. salida duplicada;
7. sincronización repetida;
8. archivo inválido;
9. gasto sin aprobación;
10. centro rechazado.

---

# 49. MVP — Primera entrega

El MVP debe priorizar:

### Fase 1

- autenticación;
- usuarios;
- roles;
- permisos;
- municipios;
- mapa;
- afectaciones;
- centros de acopio;
- auditoría;
- inventario;
- entradas;
- salidas;
- lotes;
- dashboard básico.

### Fase 2

- solicitudes de ayuda;
- familias;
- entregas;
- evidencias;
- albergues;
- denuncias;
- notificaciones.

### Fase 3

- donaciones;
- caja transparente;
- gastos;
- facturas;
- aprobaciones;
- ONG.

### Fase 4

- offline completo;
- sincronización;
- reportes avanzados;
- indicadores;
- optimización;
- endurecimiento de seguridad.

---

# 50. Criterios de aceptación del MVP

El MVP será considerado funcional cuando:

1. Un usuario pueda iniciar sesión.
2. Los permisos sean respetados.
3. El superadministrador tenga acceso global.
4. Un usuario territorial no pueda acceder a información ajena.
5. Se puedan registrar municipios.
6. Se puedan registrar afectaciones.
7. Se puedan registrar centros.
8. Un auditor pueda aprobar/rechazar centros.
9. Se pueda registrar inventario.
10. Las entradas incrementen inventario.
11. Las salidas disminuyan inventario.
12. Nunca exista inventario negativo.
13. Las operaciones tengan trazabilidad.
14. El mapa muestre información autorizada.
15. Las evidencias se almacenen correctamente.
16. Exista dashboard.
17. Exista Docker Compose.
18. Exista backup.
19. Exista documentación.
20. Otro desarrollador pueda desplegar el sistema siguiendo el README.

---

# 51. Entrega institucional

El producto debe poder entregarse con:

```text
Código fuente
Documentación
Docker Compose
Esquema PostgreSQL
Migraciones
Variables de entorno de ejemplo
Manual de instalación
Manual de administración
Manual de usuario
Manual de backup/restauración
Documentación API
Arquitectura
Pruebas
Licencia
```

La administración pública no debe quedar técnicamente dependiente de una sola persona.

---

# 52. Evolución futura

Posibles extensiones:

- aplicación móvil nativa;
- integración con sistemas gubernamentales;
- firma digital;
- integración bancaria;
- OCR de facturas;
- analítica avanzada;
- inteligencia artificial;
- predicción de necesidades;
- optimización logística;
- trazabilidad avanzada;
- integración con organismos nacionales;
- múltiples departamentos;
- soporte multiemergencia.

Estas funciones quedan fuera del MVP 1.0.

---

# 53. Regla final de arquitectura

No introducir tecnología solamente porque sea moderna.

La pregunta obligatoria antes de añadir una tecnología será:

> ¿Reduce complejidad, mejora seguridad, mejora mantenibilidad o aporta una capacidad realmente necesaria?

Si la respuesta es no, no se incorpora.

---

# 54. Definición final

CHOCÓ TRANSPARENTE debe construirse como una plataforma:

**segura + auditable + territorial + transparente + trazable + documentada + portable + mantenible.**

El MVP debe ser suficientemente pequeño para desarrollarse rápidamente, pero la arquitectura debe evitar decisiones que impidan convertirlo posteriormente en una plataforma departamental completa.

**Fin de la Especificación Técnica Maestra v1.0**
