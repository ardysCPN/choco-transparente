# Seguridad y Control de Abuso — Portal Público

## 1. Seguridad Perimetral y de Transporte

1. **HTTPS Forzado:** Todo el tráfico entre el ciudadano y el portal viaja encriptado vía TLS.
2. **Encabezados HTTP con Helmet:** Protección automática contra XSS, Clickjacking y sniffing de tipos MIME.
3. **CORS Restringido:** Solo los dominios autorizados de la plataforma pueden interactuar con los endpoints de API.

---

## 2. Validación de Entrada y Anti-Inyección

1. **Esquemas Zod:** Cada payload público es sanitizado y validado en tipos, longitud mínima y formatos de correo/URL.
2. **Consultas Parametrizadas:** Prisma ORM garantiza inmunidad contra ataques de SQL Injection.
3. **Estados Iniciales Aislados:** Todas las entradas ciudadanas (solicitudes, propuestas de centro, donaciones, denuncias) nacen en estado `PENDIENTE` o `RECIBIDA` y **no impactan el inventario ni el presupuesto de forma automática**.
