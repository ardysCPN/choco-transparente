# Guía de Despliegue y Docker — Portal Público v1.0

## 1. Variables de Entorno de Frontend

En el contenedor del portal público:

```env
VITE_API_URL=https://api.chocotransparente.gov.co/api/v1
VITE_NOMBRE_APLICACION=CHOCÓ TRANSPARENTE
VITE_MAPA_PROVEEDOR=OPENSTREETMAP
```

---

## 2. Dockerfile para Frontend Web

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Nginx Servidor Web
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 3. Integración con Docker Compose

El servicio web se suma a la infraestructura existente:

```yaml
services:
  choco-transparente-web:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: choco-transparente-web
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=http://backend:4000/api/v1
    depends_on:
      - backend
    restart: unless-stopped
```
