## 1\. Autenticación y usuarios

### Casos exitosos

****AUTH-01 — Login correcto****

-   Usuario válido.
-   Contraseña válida.
-   Esperado: `200`.
-   Debe retornar JWT.

****AUTH-02 — Obtener perfil****

-   Usar JWT obtenido en login.
-   Esperado: `200`.
-   Verificar usuario, rol y ámbito/organización.

****AUTH-03 — Usuario incorrecto****

-   Correo inexistente.
-   Esperado: `401` o respuesta equivalente.

****AUTH-04 — Contraseña incorrecta****

-   Esperado: `401`.

****AUTH-05 — Sin token****

-   Consumir endpoint privado sin `Authorization`.
-   Esperado: `401/403`.

****AUTH-06 — Token inválido****

-   JWT alterado.
-   Esperado: `401`.

  

# 2\. Roles y permisos

Aquí debemos probar especialmente el aislamiento que implementamos.

### Superadministrador

****ROLE-01****  
Superadmin consulta usuarios de cualquier organización.

****ROLE-02****  
Superadmin puede crear usuario para organización A.

****ROLE-03****  
Superadmin puede crear usuario para organización B.

****ROLE-04****  
Superadmin puede crear/asociar roles de diferentes organizaciones.

****ROLE-05****  
Superadmin puede consultar información global.

### Usuario normal

****ROLE-06****  
Usuario de organización A consulta información de A → ****permitido****.

****ROLE-07****  
Usuario de organización A intenta consultar información de B → ****rechazado****.

****ROLE-08****  
Usuario sin permiso intenta ejecutar una operación → ****403****.

****ROLE-09****  
Usuario autorizado ejecuta operación → ****permitido****.

Esto es especialmente importante porque la especificación establece que el superadministrador tiene alcance total, mientras los demás usuarios están restringidos por organización/municipio/permisos.

  

# 3\. Organizaciones

****ORG-01 — Crear organización****

****ORG-02 — Consultar organización****

****ORG-03 — Actualizar organización****

****ORG-04 — Crear usuario asociado a organización****

****ORG-05 — Crear usuario con rol de otra organización como superadmin****

****ORG-06 — Usuario normal intenta acceder a otra organización****

Esperado:

Superadmin → puede ver todo  
Usuario organización A → solamente A  
Usuario organización B → solamente B

  

# 4\. Eventos / afectaciones

Este flujo es importante porque el evento contextualiza posteriormente las operaciones.

### Crear

****EVENT-01****  
Crear evento válido.

Ejemplo:

Terremoto  
Municipio: Quibdó  
Estado: ACTIVO

Esperado: `201`.

### Validaciones

****EVENT-02****  
Crear evento sin campos obligatorios → rechazo.

****EVENT-03****  
Consultar eventos → solamente los correspondientes al ámbito del usuario.

****EVENT-04****  
Usuario de municipio/organización diferente intenta modificar evento → `403`.

****EVENT-05****  
Actualizar estado del evento.

****EVENT-06****  
Cerrar evento.

  

# 5\. Centros de acopio

La especificación contempla estados:

`PENDIENTE → EN_REVISION → APROBADO / RECHAZADO`

y también `SUSPENDIDO` y `CERRADO`.

### Flujo principal

****CENTER-01****  
Registrar centro.

****CENTER-02****  
Consultar centros.

****CENTER-03****  
Enviar centro a revisión.

****CENTER-04****  
Auditor consulta centros pendientes.

****CENTER-05****  
Auditor aprueba centro.

****CENTER-06****  
Auditor rechaza centro.

****CENTER-07****  
Suspender centro.

****CENTER-08****  
Cerrar centro.

### Casos negativos

****CENTER-09****  
Usuario no auditor intenta aprobar → rechazado.

****CENTER-10****  
Aprobar centro sin auditoría → rechazado.

Esto es una regla explícita del sistema.

  

# 6\. Auditoría

Aquí atacaría directamente el error que encontraste.

****AUDIT-01 — Crear auditoría****

Validar:

centro  
auditor  
decisión  
comentario  
evidencia  
latitud  
longitud  
fecha

****AUDIT-02****  
Auditor aprueba centro con evidencia → permitido.

****AUDIT-03****  
Auditor intenta aprobar sin evidencia → rechazado.

****AUDIT-04****  
Usuario que no es auditor intenta aprobar → `403`.

****AUDIT-05****  
Auditoría queda asociada al usuario correcto.

****AUDIT-06****  
Consultar historial de auditoría.

****AUDIT-07****  
Intentar modificar/eliminar una auditoría existente.

Debe conservarse la trazabilidad.

  

# 7\. Inventario

Aquí debemos hacer pruebas ****con números reales****, porque es uno de los procesos críticos.

### Entrada

****INV-01****

Inventario = 0  
Entrada = 100  
Resultado = 100

****INV-02****

Inventario = 100  
Entrada = 50  
Resultado = 150

### Salida

****INV-03****

Inventario = 150  
Salida = 40  
Resultado = 110

****INV-04****

Inventario = 10  
Salida = 10  
Resultado = 0

****INV-05****

Inventario = 10  
Salida = 11

Debe ****rechazar la operación****.

Nunca puede existir inventario negativo.

### Lotes

****INV-06****  
Crear lote.

****INV-07****  
Asignar QR al lote.

****INV-08****  
Consultar lote.

****INV-09****  
Entrada asociada a lote.

****INV-10****  
Salida asociada a lote.

****INV-11****  
Intentar utilizar lote inexistente.

****INV-12****  
Intentar sacar más cantidad de la disponible en el lote.

  

# 8\. Solicitudes de ayuda

La especificación establece:

`PENDIENTE → VALIDADA → PRIORIZADA → ASIGNADA → ATENDIDA`

con posibilidad de rechazo/cancelación.

****HELP-01****  
Crear solicitud.

****HELP-02****  
Consultar solicitud.

****HELP-03****  
Validar solicitud.

****HELP-04****  
Priorizar solicitud.

****HELP-05****  
Asignar solicitud.

****HELP-06****  
Atender solicitud.

****HELP-07****  
Rechazar solicitud.

****HELP-08****  
Cancelar solicitud.

### Casos negativos

****HELP-09****  
Crear solicitud sin beneficiario.

****HELP-10****  
Crear solicitud sin necesidad.

****HELP-11****  
Intentar pasar directamente de `PENDIENTE` a `ATENDIDA`.

****HELP-12****  
Usuario sin permiso intenta modificar solicitud.

  

# 9\. Familias / beneficiarios

Este punto es importante porque decidimos manejar la ****familia/hogar como unidad principal****, no la persona individual.

****FAM-01****  
Crear familia.

****FAM-02****  
Consultar familia.

****FAM-03****  
Actualizar familia.

****FAM-04****  
Crear solicitud asociada a familia.

****FAM-05****  
Intentar registrar una familia duplicada.

****FAM-06****  
Verificar que documentos sensibles no sean expuestos.

  

# 10\. Entrega de ayudas

****DEL-01****  
Entregar ayuda desde una solicitud válida.

****DEL-02****  
Descontar inventario.

****DEL-03****  
Registrar responsable.

****DEL-04****  
Registrar evidencia.

****DEL-05****  
Registrar ubicación.

****DEL-06****  
Registrar lote.

### Casos críticos

****DEL-07****  
Intentar entregar sin inventario suficiente → rechazo.

****DEL-08****  
Intentar entregar dos veces la misma ayuda dentro de la regla configurada → rechazo/alerta.

****DEL-09****  
Intentar entregar una solicitud inexistente → rechazo.

****DEL-10****  
Usuario sin permiso intenta entregar → `403`.

Las entregas deben impedir duplicaciones y mantener trazabilidad.

  

# 11\. Donaciones

****DON-01****  
Registrar donación.

****DON-02****  
Consultar donaciones.

****DON-03****  
Actualizar estado.

****DON-04****  
Registrar donación monetaria.

****DON-05****  
Registrar donación en especie.

****DON-06****  
Generar consolidado por fechas.

La colección de Postman ya contempla consultas de reportes de donaciones.

  

# 12\. Gastos / caja transparente

****FIN-01****  
Registrar gasto.

****FIN-02****  
Adjuntar factura/soporte.

****FIN-03****  
Gasto que requiere aprobación.

****FIN-04****  
Usuario autorizado aprueba.

****FIN-05****  
Usuario no autorizado intenta aprobar → `403`.

****FIN-06****  
Consultar gastos.

****FIN-07****  
Generar reporte.

La especificación contempla aprobación financiera, facturas y caja transparente.

  

# 13\. Albergues

****SHELTER-01****  
Crear albergue.

****SHELTER-02****  
Consultar albergues.

****SHELTER-03****  
Actualizar capacidad/estado.

****SHELTER-04****  
Usuario sin permiso intenta modificar.

  

# 14\. Notificaciones

****NOT-01****  
Generar notificación por evento relevante.

****NOT-02****  
Notificar nueva solicitud.

****NOT-03****  
Notificar centro pendiente de auditoría.

****NOT-04****  
Notificar operación relevante.

****NOT-05****  
Consultar notificaciones.

La especificación contempla notificaciones para eventos relevantes.

  

# 15\. Reportes

****REP-01****  
Dashboard administrativo.

****REP-02****  
Reporte de donaciones.

****REP-03****  
Reporte de gastos.

****REP-04****  
Reporte de inventario.

****REP-05****  
Reporte de entradas/salidas.

****REP-06****  
Reporte por municipio.

****REP-07****  
Reporte por centro de acopio.

****REP-08****  
Exportación.

La colección actual ya tiene endpoints de reportes y dashboard administrativo.

  

# 16\. Aislamiento territorial

Esta sería una de las pruebas ****más importantes de toda la aplicación****.

Crear:

Organización A  
 └── Usuario A  
 └── Evento A  
 └── Centro A  
 └── Inventario A  
Organización B  
 └── Usuario B  
 └── Evento B  
 └── Centro B  
 └── Inventario B

Después:

| Prueba                     | Resultado |
| -------------------------- | --------- |
| Usuario A → consultar A    | ✅         |
| Usuario A → consultar B    | ❌         |
| Usuario A → modificar B    | ❌         |
| Usuario B → consultar A    | ❌         |
| Usuario B → modificar A    | ❌         |
| Superadmin → consultar A+B | ✅         |
| Superadmin → modificar A+B | ✅         |

Esto valida realmente el aislamiento que hemos venido implementando.

  

# 17\. Auditoría y trazabilidad

Para cada operación crítica comprobar:

¿Quién?  
¿Qué hizo?  
¿Cuándo?  
¿Sobre qué registro?  
¿Qué valor tenía?  
¿Qué valor quedó?

Por ejemplo:

Usuario: auditor.quibdo  
Operación: APROBAR\_CENTRO  
Centro: 15  
Fecha: 2026-08-16  
Resultado: APROBADO

Las operaciones críticas no deben perder trazabilidad.

  

# 18\. Pruebas de archivos/evidencias

Como ya tenemos el flujo de imágenes:

****FILE-01****  
Imagen válida.

****FILE-02****  
Varias imágenes.

****FILE-03****  
Imagen demasiado grande.

****FILE-04****  
Formato no permitido.

****FILE-05****  
Imagen asociada a auditoría.

****FILE-06****  
Imagen asociada a entrada.

****FILE-07****  
Imagen asociada a salida.

****FILE-08****  
Verificar que la ruta/archivo quede correctamente almacenado.

****FILE-09****  
Verificar que no se pueda acceder a archivos privados sin autorización.

  

# 19\. Pruebas de reglas de negocio

Aquí debemos probar explícitamente las reglas críticas:

-   ❌ Inventario negativo.
-   ❌ Salida sin inventario.
-   ❌ Aprobar centro sin auditoría.
-   ❌ Usuario fuera de su organización.
-   ❌ Operación sin responsable.
-   ❌ Duplicar ayuda injustificadamente.
-   ❌ Modificar evidencia silenciosamente.
-   ❌ Exponer documentos sensibles.
-   ❌ Denuncia modificando directamente inventario.

Estas reglas están definidas explícitamente en la especificación maestra.

  

## Orden en que yo las ejecutaría

No intentaría ejecutar las 100 pruebas aleatoriamente.

Haría este ****flujo integral****:

1\. Health Check  
        ↓  
2\. Login Superadmin  
        ↓  
3\. Crear organización  
        ↓  
4\. Crear rol  
        ↓  
5\. Crear usuario  
        ↓  
6\. Login usuario  
        ↓  
7\. Crear evento  
        ↓  
8\. Crear centro de acopio  
        ↓  
9\. Auditor revisa centro  
        ↓  
10\. Aprobar centro + evidencia  
        ↓  
11\. Crear lote  
        ↓  
12\. Registrar entrada  
        ↓  
13\. Verificar inventario  
        ↓  
14\. Crear familia  
        ↓  
15\. Crear solicitud  
        ↓  
16\. Validar/priorizar/asignar  
        ↓  
17\. Registrar entrega  
        ↓  
18\. Verificar descuento inventario  
        ↓  
19\. Generar reporte  
        ↓  
20\. Verificar auditoría/trazabilidad

Después repetimos el mismo escenario con ****dos organizaciones diferentes**** para demostrar que ****A no puede tocar B****, mientras que el superadmin sí puede.