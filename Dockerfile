# syntax=docker/dockerfile:1
#
# Nuxt 4 SSR. Сборка — только в CI или на ноутбуке, НЕ на сервере (2 ГБ RAM = OOM).
#   docker build -t ypa-frontend:$(git rev-parse --short HEAD) .

# ---------- deps: слой живёт, пока не меняются package.json и bun.lock ----------
FROM oven/bun:1.3.9 AS deps
WORKDIR /app
COPY package.json bun.lock ./
# ПОЧЕМУ --ignore-scripts: postinstall зовёт `nuxt prepare`, которому нужен весь проект,
# а husky — .git. Здесь только зависимости; prepare выполнит `nuxt build` ниже
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile --ignore-scripts

# ---------- build ----------
FROM deps AS build
COPY . .
# @nuxt/fonts на этом шаге качает Nunito с Google Fonts — нужен интернет
RUN bun run build

# ---------- runtime: только .output, без node_modules и исходников ----------
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000 \
    NODE_OPTIONS=--max-old-space-size=192

# .output самодостаточен: Nitro бандлит зависимости (включая sharp для linuxmusl)
COPY --from=build --chown=node:node /app/.output ./.output

USER node
EXPOSE 3000

# ПОЧЕМУ wget: busybox есть в alpine, а curl — лишний пакет
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
    CMD wget -qO- http://127.0.0.1:3000/healthz >/dev/null || exit 1

CMD ["node", ".output/server/index.mjs"]
