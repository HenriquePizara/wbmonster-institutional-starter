# Multi-stage Dockerfile para Deploy Estático Ultra-Rápido no Dokku
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Runtime Nginx Minimalista e Seguro
FROM nginx:alpine

# Remove configuração padrão
RUN rm -rf /etc/nginx/conf.d/*

# Copia configuração customizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia build estático do Astro
COPY --from=builder /app/dist/client /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
