# ===========================================
# 1. Build Stage (with Turbopack)
# ===========================================
FROM node:20-alpine AS builder
WORKDIR /app

# Copiamos solo archivos que afectan una instalación
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiamos todo el proyecto
COPY . .

# ⚡ Compilación usando Turbopack (Next.js 14+)
RUN NEXT_TELEMETRY_DISABLED=1 npm run build


# ===========================================
# 2. Runner Stage (standalone + muy liviano)
# ===========================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copiamos el output standalone optimizado
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

# Ejecuta el servidor standalone
CMD ["node", "server.js"]