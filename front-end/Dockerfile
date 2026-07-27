# syntax=docker/dockerfile:1

# -----------------------------
# Stage 1: Build React project
# -----------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# প্রথমে dependency files copy করা হচ্ছে
COPY package.json package-lock.json ./

# Exact dependency versions install করবে
RUN npm ci

# সমস্ত frontend source code copy
COPY . .

# Build-time API URL
ARG VITE_API_BASE_URL=http://localhost:8000
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Production build তৈরি করবে
RUN npm run build


# -----------------------------
# Stage 2: Serve using Nginx
# -----------------------------
FROM nginx:1.27-alpine AS production

# Default Nginx configuration remove
RUN rm /etc/nginx/conf.d/default.conf

# Custom Nginx configuration copy
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Builder stage থেকে dist folder copy
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Container health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]