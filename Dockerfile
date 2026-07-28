# Multi-stage production image: build public + admin SPAs, run Express + Postgres client.
# Usage: docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build

FROM node:20-bookworm-slim AS client-build
WORKDIR /app/client
# Chromium for post-build prerender (SEO HTML snapshots)
RUN apt-get update \
  && apt-get install -y --no-install-recommends chromium fonts-liberation ca-certificates \
  && rm -rf /var/lib/apt/lists/*
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client/ ./
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build

FROM node:20-alpine AS admin-build
WORKDIR /app/admin
COPY admin/package.json admin/package-lock.json ./
RUN npm ci
COPY admin/ ./
ARG VITE_API_URL=/api
ARG VITE_BASE=/
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_BASE=${VITE_BASE}
RUN npm run build

FROM node:20-alpine AS server
WORKDIR /app/server
RUN apk add --no-cache wget
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev
COPY server/ ./
COPY --from=client-build /app/client/dist /app/client/dist
COPY --from=admin-build /app/admin/dist /app/admin/dist

ENV NODE_ENV=production
ENV SERVE_CLIENT=true
ENV CLIENT_DIST_PATH=/app/client/dist
ENV ADMIN_DIST_PATH=/app/admin/dist
ENV PORT=3001

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3001/api/health || exit 1

CMD ["node", "src/index.js"]
