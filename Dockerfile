# syntax=docker/dockerfile:1

# ---------- build ----------
FROM oven/bun:1.3.9 AS build
WORKDIR /app

# Полный контекст: postinstall дергает `nuxt prepare`, которому нужны
# nuxt.config.ts и app/. .dockerignore держит контекст маленьким.
COPY . .

RUN bun install --frozen-lockfile
# На сборке бэкенд не нужен (prerender-роутов нет, всё ssr).
# @nuxt/fonts на этом шаге качает Nunito с Google Fonts — нужен интернет.
RUN bun run build

# ---------- runtime ----------
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000

# .output самодостаточен — Nitro бандлит зависимости внутрь
COPY --from=build /app/.output ./.output

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
