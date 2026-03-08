# Stage 1: Build the static SPA.
FROM node:22-alpine AS builder

RUN corepack enable pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Stage 2: Serve the static bundle with the existing static-web-server runtime.
FROM joseluisq/static-web-server:2-alpine

COPY --from=builder /app/dist /public
COPY sws.toml /etc/sws.toml

ENV SERVER_PORT=8080 \
    SERVER_ROOT=/public \
    SERVER_CONFIG_FILE=/etc/sws.toml \
    SERVER_LOG_LEVEL=warn \
    SERVER_COMPRESSION=true \
    SERVER_HEALTH=true \
    SERVER_FALLBACK_PAGE=/public/index.html
