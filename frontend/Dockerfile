# ==============================================================================
# 1. BUILD STAGE: Compilación del bundle Vite + React + TypeScript
# ==============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Argumento para inyectar la URL de la API en tiempo de compilación
ARG VITE_API_URL=/api/v1
ENV VITE_API_URL=${VITE_API_URL}

# Copiar manifiestos de dependencias
COPY package*.json ./

# Instalar dependencias limpias
RUN npm ci

# Copiar código fuente
COPY . .

# Compilar bundle de producción
RUN npm run build

# ==============================================================================
# 2. RUNTIME STAGE: Servidor Nginx ultra ligero para servir estáticos SPA
# ==============================================================================
FROM nginx:alpine AS runner

# Copiar configuración optimizada de Nginx con soporte para SPA Routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar artefactos compilados desde el stage builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer puerto HTTP estándar
EXPOSE 80

# Healthcheck de contenedor
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
