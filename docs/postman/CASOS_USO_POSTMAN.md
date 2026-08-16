# Casos de Uso Prácticos - Guía Paso a Paso

## Caso 1: Registrar una nueva emergencia y distribuir ayuda

### Paso 1: Login y obtener token
```
POST /api/v1/autenticacion/login
Body:
{
  "correo": "admin@choco.gov",
  "contrasena": "Admin123!"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": { ... }
}

✅ Copiar el token a la variable {{jwt_token}}
```

---

### Paso 2: Registrar una zona afectada
```
POST /api/v1/afectaciones
Headers: Authorization: Bearer {{jwt_token}}
Body:
{
  "municipioId": 1,
  "descripcion": "Inundaciones en zona ribereña del río Atrato",
  "severidad": "ALTA",
  "zona_geografica": "Cuenca del río Atrato - Quibdó",
  "personas_afectadas": 5000
}

Response:
{
  "id": 1,
  "municipioId": 1,
  "descripcion": "Inundaciones en zona ribereña...",
  "severidad": "ALTA",
  "createdAt": "2026-08-15T10:00:00Z",
  "updatedAt": "2026-08-15T10:00:00Z"
}

✅ Anotar el ID para pasos posteriores
```

---

### Paso 3: Crear un centro de acopio de emergencia
```
POST /api/v1/centros-acopio
Headers: Authorization: Bearer {{jwt_token}}
Body:
{
  "municipioId": 1,
  "nombre": "Centro de Distribución Emergencia Quibdó",
  "direccion": "Estadio Campestre Quibdó",
  "telefono": "+5764999999",
  "capacidad": 2000,
  "responsable": "María González",
  "estado": "SOLICITADO"
}

Response:
{
  "id": 1,
  "municipioId": 1,
  "nombre": "Centro de Distribución Emergencia...",
  "estado": "SOLICITADO",
  "createdAt": "2026-08-15T10:00:00Z"
}
```

---

### Paso 4: Registrar entrada de ayuda al inventario
```
POST /api/v1/inventario
Headers: Authorization: Bearer {{jwt_token}}
Body:
{
  "tipo_ayuda": "ALIMENTOS",
  "descripcion": "Arroz integral 30kg - Donación ONG Internacional",
  "cantidad_total": 500,
  "unidad_medida": "BOLSA",
  "valor_unitario": 50000,
  "centro_acopio_id": 1
}

Response:
{
  "id": 1,
  "tipo_ayuda": "ALIMENTOS",
  "descripcion": "Arroz integral...",
  "cantidad_actual": 500,
  "createdAt": "2026-08-15T10:00:00Z"
}

✅ Anotar ID para registrar entrada
```

---

### Paso 5: Registrar entrada física de la ayuda
```
POST /api/v1/inventario/entrada
Headers: Authorization: Bearer {{jwt_token}}
Body:
{
  "inventario_id": 1,
  "cantidad": 500,
  "motivo": "Donación ONG Internacional",
  "referencia_externa": "DONATION-ONG-2026-001"
}

Response:
{
  "id": 1,
  "inventario_id": 1,
  "cantidad": 500,
  "tipo_movimiento": "ENTRADA",
  "motivo": "Donación ONG Internacional",
  "registrado_por": "admin@choco.gov",
  "createdAt": "2026-08-15T10:00:00Z"
}
```

---

### Paso 6: Registrar un beneficiario
```
POST /api/v1/beneficiarios
Headers: Authorization: Bearer {{jwt_token}}
Body:
{
  "municipioId": 1,
  "nombre": "Carlos",
  "apellido": "Vásquez",
  "numero_identificacion": "8765432",
  "tipo_identificacion": "CC",
  "telefono": "+5764111111",
  "correo": "carlos@email.com",
  "direccion": "Calle 10 # 5-20, Quibdó",
  "numero_miembros_familia": 5,
  "necesidades": ["ALIMENTOS", "ROPA"],
  "latitud": 5.6959,
  "longitud": -76.6419
}

Response:
{
  "id": 1,
  "nombre": "Carlos",
  "apellido": "Vásquez",
  "numero_miembros_familia": 5,
  "necesidades": ["ALIMENTOS", "ROPA"],
  "createdAt": "2026-08-15T10:00:00Z"
}

✅ Anotar ID del beneficiario
```

---

### Paso 7: Crear solicitud de ayuda
```
POST /api/v1/solicitudes-ayuda
Headers: Authorization: Bearer {{jwt_token}}
Body:
{
  "beneficiarioId": 1,
  "tipo_ayuda": "ALIMENTOS",
  "descripcion": "Familia de 5 personas necesita alimentos básicos urgentemente",
  "cantidad": 2,
  "unidad_medida": "BOLSA",
  "prioridad": "ALTA"
}

Response:
{
  "id": 1,
  "beneficiarioId": 1,
  "tipo_ayuda": "ALIMENTOS",
  "cantidad": 2,
  "prioridad": "ALTA",
  "estado": "PENDIENTE",
  "createdAt": "2026-08-15T10:00:00Z"
}

✅ Anotar ID de solicitud
```

---

### Paso 8: Registrar salida de inventario (distribución)
```
POST /api/v1/inventario/salida
Headers: Authorization: Bearer {{jwt_token}}
Body:
{
  "inventario_id": 1,
  "cantidad": 2,
  "motivo": "ENTREGA_BENEFICIARIO",
  "numero_acta": "ACTA-2026-0001",
  "observaciones": "Entrega a familia afectada por inundación - Carlos Vásquez"
}

Response:
{
  "id": 1,
  "inventario_id": 1,
  "cantidad": 2,
  "tipo_movimiento": "SALIDA",
  "motivo": "ENTREGA_BENEFICIARIO",
  "numero_acta": "ACTA-2026-0001",
  "createdAt": "2026-08-15T10:00:00Z"
}
```

---

### Paso 9: Registrar entrega de ayuda con evidencia
```
POST /api/v1/entregas-ayuda
Headers: Authorization: Bearer {{jwt_token}}
Body:
{
  "solicitudAyudaId": 1,
  "cantidad_entregada": 2,
  "unidad_medida": "BOLSA",
  "url_evidencia_fotografica": "https://storage.example.com/entrega-carlos-20260815.jpg",
  "observaciones": "Entrega completada sin novedad. Beneficiario satisfecho"
}

Response:
{
  "id": 1,
  "solicitudAyudaId": 1,
  "cantidad_entregada": 2,
  "estado": "ENTREGADA",
  "fecha_entrega": "2026-08-15T10:00:00Z",
  "url_evidencia_fotografica": "https://storage.example.com/...",
  "createdAt": "2026-08-15T10:00:00Z"
}

✅ FLUJO COMPLETADO: Emergencia → Centro → Inventario → Beneficiario → Entrega
```

---

## Caso 2: Gestionar Donaciones y Gastos

### Paso 1: Registrar donación en dinero
```
POST /api/v1/donaciones/dinero
Headers: Authorization: Bearer {{jwt_token}}
Body:
{
  "donante": "Fundación XYZ Colombia",
  "monto": 5000000,
  "cuentaDestino": "1234567890",
  "referencia": "TRANSF-FONDXYZ-2026-001",
  "estado": "PENDIENTE"
}

Response:
{
  "id": 1,
  "donante": "Fundación XYZ Colombia",
  "monto": 5000000,
  "estado": "PENDIENTE",
  "soporteArchivo": "soporte_pendiente.pdf",
  "createdAt": "2026-08-15T10:00:00Z"
}

✅ Anotar ID para actualizar estado
```

---

### Paso 2: Confirmar recepción de dinero
```
PUT /api/v1/donaciones/1
Headers: Authorization: Bearer {{jwt_token}}
Body:
{
  "estado": "RECIBIDO"
}

Response:
{
  "id": 1,
  "donante": "Fundación XYZ Colombia",
  "monto": 5000000,
  "estado": "RECIBIDO",
  "updatedAt": "2026-08-15T10:30:00Z"
}
```

---

### Paso 3: Registrar gasto operacional
```
POST /api/v1/gastos
Headers: Authorization: Bearer {{jwt_token}}
Body:
{
  "organizacionId": 1,
  "descripcion": "Transporte de ayuda a municipios afectados por inundación",
  "monto": 2500000,
  "fecha_gasto": "2026-08-15",
  "categoria": "TRANSPORTE",
  "estado": "BORRADOR"
}

Response:
{
  "id": 1,
  "organizacionId": 1,
  "descripcion": "Transporte de ayuda...",
  "monto": 2500000,
  "estado": "BORRADOR",
  "creadoPor": "admin@choco.gov",
  "createdAt": "2026-08-15T10:00:00Z"
}

✅ Anotar ID para aprobación
```

---

### Paso 4: Aprobar gasto
```
POST /api/v1/gastos/1/aprobar
Headers: Authorization: Bearer {{jwt_token}}
Body:
{
  "accion": "APROBAR",
  "observaciones": "Transporte autorizado. Presupuesto disponible"
}

Response:
{
  "id": 1,
  "monto": 2500000,
  "estado": "APROBADO",
  "aprobadoPor": "admin@choco.gov",
  "observaciones": "Transporte autorizado...",
  "updatedAt": "2026-08-15T10:30:00Z"
}
```

---

## Caso 3: Ver Reportes y Dashboards

### Paso 1: Dashboard administrativo (KPIs)
```
GET /api/v1/dashboards/administrativo
Headers: Authorization: Bearer {{jwt_token}}

Response:
{
  "total_beneficiarios": 1,
  "total_entregas": 1,
  "inventario_activo": {
    "total_items": 500,
    "en_almacen": 498
  },
  "donaciones_recibidas": {
    "dinero": 5000000,
    "cantidad_registros": 1
  },
  "resumen": {
    "albergues_disponibles": 1,
    "denuncias_pendientes": 0,
    "gastos_pendientes": 0
  }
}
```

---

### Paso 2: Reporte de donaciones por período
```
GET /api/v1/reportes/donaciones?fechaInicio=2026-08-01&fechaFin=2026-08-31
Headers: Authorization: Bearer {{jwt_token}}

Response:
{
  "periodo": {
    "inicio": "2026-08-01",
    "fin": "2026-08-31"
  },
  "resumen": {
    "total_donaciones": 1,
    "monto_total": 5000000,
    "por_estado": {
      "PENDIENTE": { "cantidad": 0, "monto": 0 },
      "RECIBIDO": { "cantidad": 1, "monto": 5000000 },
      "RECHAZADO": { "cantidad": 0, "monto": 0 }
    }
  },
  "donaciones": [
    {
      "id": 1,
      "donante": "Fundación XYZ Colombia",
      "monto": 5000000,
      "estado": "RECIBIDO",
      "fecha_creacion": "2026-08-15"
    }
  ]
}
```

---

### Paso 3: Reporte de beneficiarios
```
GET /api/v1/reportes/beneficiarios
Headers: Authorization: Bearer {{jwt_token}}

Response:
{
  "total_beneficiarios": 1,
  "por_municipio": {
    "Quibdó": 1
  },
  "resumen_entregas": {
    "total_entregas": 1,
    "familias_atendidas": 1,
    "personas_beneficiadas": 5
  },
  "beneficiarios": [
    {
      "id": 1,
      "nombre": "Carlos Vásquez",
      "numero_miembros": 5,
      "necesidades": ["ALIMENTOS", "ROPA"],
      "entregas_realizadas": 1
    }
  ]
}
```

---

### Paso 4: Estadísticas de inventario
```
GET /api/v1/dashboards/inventario
Headers: Authorization: Bearer {{jwt_token}}

Response:
{
  "resumen_general": {
    "total_items_diferentes": 1,
    "cantidad_total": 498,
    "valor_total": 24900000
  },
  "por_tipo": {
    "ALIMENTOS": {
      "cantidad": 498,
      "valor": 24900000,
      "items": 1
    },
    "ROPA": { "cantidad": 0, "valor": 0, "items": 0 },
    "AGUA": { "cantidad": 0, "valor": 0, "items": 0 }
  }
}
```

---

### Paso 5: Dashboard público (sin autenticación)
```
GET /api/v1/dashboards/publico
(NO requiere Authorization header)

Response:
{
  "impacto": {
    "personas_atendidas": 5,
    "entregas_realizadas": 1,
    "municipios_beneficiados": 1
  },
  "donaciones": {
    "total_dinero_recibido": 5000000,
    "total_items_especie": 0
  },
  "cobertura_territorial": {
    "municipios_activos": 1,
    "zonas_afectadas": 1
  }
}
```

---

## Caso 4: Registrar una Denuncia

### Paso 1: Crear denuncia de irregularidad
```
POST /api/v1/denuncias
Headers: Authorization: Bearer {{jwt_token}}
Body:
{
  "municipioId": 1,
  "tipo": "MALVERSACION_FONDOS",
  "descripcion": "Posible desviación de ayuda en centro de acopio. Se reporta falta de transparencia en registros",
  "estado": "RECIBIDA"
}

Response:
{
  "id": 1,
  "municipioId": 1,
  "tipo": "MALVERSACION_FONDOS",
  "descripcion": "Posible desviación de ayuda...",
  "estado": "RECIBIDA",
  "createdAt": "2026-08-15T10:00:00Z"
}
```

---

### Paso 2: Cambiar estado a EN_REVISION
```
PUT /api/v1/denuncias/1
Headers: Authorization: Bearer {{jwt_token}}
Body:
{
  "estado": "EN_REVISION",
  "observaciones": "Se solicitan documentos al administrador del centro"
}

Response:
{
  "id": 1,
  "estado": "EN_REVISION",
  "observaciones": "Se solicitan documentos...",
  "updatedAt": "2026-08-15T10:30:00Z"
}
```

---

### Paso 3: Cambiar estado a INVESTIGACION
```
PUT /api/v1/denuncias/1
Headers: Authorization: Bearer {{jwt_token}}
Body:
{
  "estado": "INVESTIGACION",
  "observaciones": "Documentos recibidos. Inicia investigación formal"
}

Response:
{
  "id": 1,
  "estado": "INVESTIGACION",
  "observaciones": "Documentos recibidos...",
  "updatedAt": "2026-08-15T11:00:00Z"
}
```

---

### Paso 4: Resolver denuncia
```
PUT /api/v1/denuncias/1
Headers: Authorization: Bearer {{jwt_token}}
Body:
{
  "estado": "RESUELTA",
  "observaciones": "Investigación concluida. Se encontraron discrepancias menores en registros. Se implementarán medidas correctivas"
}

Response:
{
  "id": 1,
  "estado": "RESUELTA",
  "observaciones": "Investigación concluida...",
  "updatedAt": "2026-08-15T12:00:00Z"
}
```

---

## Caso 5: Crear Albergue de Emergencia

### Paso 1: Crear albergue
```
POST /api/v1/albergues
Headers: Authorization: Bearer {{jwt_token}}
Body:
{
  "municipioId": 1,
  "nombre": "Escuela Rural El Porvenir",
  "direccion": "Vereda Las Palmas Km 5, Quibdó",
  "capacidad": 150,
  "responsable": "María Rodríguez López",
  "telefono": "+5764222222",
  "estado": "DISPONIBLE"
}

Response:
{
  "id": 1,
  "municipioId": 1,
  "nombre": "Escuela Rural El Porvenir",
  "capacidad": 150,
  "ocupacion_actual": 0,
  "estado": "DISPONIBLE",
  "createdAt": "2026-08-15T10:00:00Z"
}
```

---

### Paso 2: Actualizar estado a CASI_LLENO
```
PUT /api/v1/albergues/1
Headers: Authorization: Bearer {{jwt_token}}
Body:
{
  "estado": "CASI_LLENO",
  "observaciones": "Albergue con 120 personas (80% capacidad)"
}

Response:
{
  "id": 1,
  "estado": "CASI_LLENO",
  "ocupacion_actual": 120,
  "updatedAt": "2026-08-15T10:30:00Z"
}
```

---

## Exportar Datos

### POST /api/v1/reportes/exportar
```
POST /api/v1/reportes/exportar
Headers: Authorization: Bearer {{jwt_token}}
Body:
{
  "tipo_reporte": "DONACIONES",
  "formato": "JSON",
  "filtros": {
    "fechaInicio": "2026-08-01",
    "fechaFin": "2026-08-31"
  }
}

Response:
(Archivo JSON con datos del reporte)
```

---

## ✅ Resumen de Flujos

| Caso | Endpoint | Flujo |
|------|----------|-------|
| 1️⃣ Emergencia | POST /afectaciones → POST /beneficiarios → POST /solicitudes-ayuda → POST /entregas-ayuda | Completo |
| 2️⃣ Finanzas | POST /donaciones/dinero → PUT /donaciones/:id → POST /gastos → POST /gastos/:id/aprobar | Completo |
| 3️⃣ Reportes | GET /reportes/* → GET /dashboards/* → POST /reportes/exportar | Lectura |
| 4️⃣ Denuncias | POST /denuncias → PUT /denuncias/:id (x4 estados) | Seguimiento |
| 5️⃣ Albergues | POST /albergues → PUT /albergues/:id | CRUD |

---

**Última actualización:** 2026-08-15
