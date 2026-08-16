# ==============================================================================
# 1. BUILD STAGE: Generación de Prisma Client y compilación TypeScript
# ==============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependencias del sistema requeridas para Prisma y node-gyp
RUN apk add --no-cache openssl libc6-compat

# Copiar manifiestos
COPY package*.json ./
COPY prisma ./prisma/

# Instalar todas las dependencias
RUN npm ci

# Generar cliente de Prisma
RUN npx prisma generate

# Copiar código fuente
COPY . .

# Compilar TypeScript a JavaScript (dist/)
RUN npm run build

# ==============================================================================
# 2. RUNTIME STAGE: Imagen ligera y segura de producción
# ==============================================================================
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat curl

ENV NODE_ENV=production
ENV PORT=4000

# Usuario no privilegiado para seguridad
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Copiar package.json y prisma
COPY package*.json ./
COPY prisma ./prisma/

# Instalar solo dependencias de producción
RUN npm ci --omit=dev && npm cache clean --force

# Copiar cliente de Prisma generado y código compilado
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/dist ./dist

# Asignar permisos al usuario nodejs
USER nodejs

EXPOSE 4000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:4000/health || exit 1

CMD ["node", "dist/app.js"]
