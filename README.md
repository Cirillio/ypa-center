# Центр Умного Развития «УРА» — Frontend Core

Фронтенд сайта [ypa-center.ru](https://ypa-center.ru) — публичная витрина (каталог кружков,
расписание, события, галерея, калькулятор абонемента, формы записи) и личный кабинет родителя.
Построен на Nuxt 4 / Vue 3, работает поверх DRF-бэкенда `ypa-center-backend`.

## Стек

| Категория         | Технологии                                                   |
| ----------------- | ------------------------------------------------------------ |
| Фреймворк         | Nuxt 4 (SSR), Vue 3.5, `<script setup lang="ts">`            |
| UI / стили        | Nuxt UI 4 (Reka UI), Tailwind CSS 4, Phosphor Icons          |
| Шрифты            | `@nuxt/fonts` — Nunito, self-hosted, metric-matched fallback |
| Состояние         | Pinia (глобальное), VueUse, `computed` (производное)         |
| Формы / валидация | Zod 4, maska                                                 |
| Данные            | `useAsyncData` + типы из OpenAPI-схемы бэка                  |
| Изображения       | `@nuxt/image` (IPX, WebP)                                    |
| SEO               | `@nuxtjs/sitemap`, `@nuxtjs/robots`, ручной JSON-LD          |
| Доступность       | `@nuxt/a11y`, `prefers-reduced-motion`                       |
| Дата/время        | dayjs (ru, TZ `Asia/Novosibirsk`)                            |
| Пакетный менеджер | Bun 1.3                                                      |

## Требования

- [Bun](https://bun.sh) ≥ 1.3
- Запущенный бэкенд `ypa-center-backend` (по умолчанию `http://127.0.0.1:8000`) —
  нужен для публичных API и для пре-рендера статических страниц при сборке.

## Переменные окружения

`.env` в репозиторий не коммитится. Создайте его в корне:

```bash
echo 'NUXT_PUBLIC_API_BASE=http://127.0.0.1:8000/api' > .env
```

| Переменная             | Назначение              | По умолчанию                |
| ---------------------- | ----------------------- | --------------------------- |
| `NUXT_PUBLIC_API_BASE` | Базовый URL API бэкенда | `http://localhost:8000/api` |

## Запуск

```bash
bun install            # зависимости
bun dev                # режим разработки (http://localhost:3000)
bun run build          # продакшен-сборка
bun run preview        # предпросмотр сборки
bun run typecheck      # проверка типов (vue-tsc)
bun run lint           # ESLint
```

### Типы API

Типы ответов бэкенда не пишутся руками — генерируются из живой OpenAPI-схемы в
`app/types/api.d.ts`, алиасы удобных имён — в `app/types/index.ts`.

```bash
# бэкенд должен быть запущен
bun run schema:update
```

### Docker

Бэкенд на сборку не нужен (все роуты `ssr`, `prerender` нет). Нужен только при
работе приложения — по адресу из `NUXT_PUBLIC_API_BASE`.

```bash
# бэкенд поднят на localhost:8000
docker compose up --build          # → http://localhost:3000
```

`docker-compose.yml` использует `network_mode: host` (Linux) — SSR внутри
контейнера и браузер ходят к бэкенду по одному адресу. Для Docker Desktop
(macOS / Windows) см. комментарии в `docker-compose.yml`.

Если бэкенд не на `localhost:8000`:

```bash
NUXT_PUBLIC_API_BASE=http://192.168.1.10:8000/api docker compose up --build
```

## Стратегия рендеринга

`routeRules` в `nuxt.config.ts`:

| Роут(ы)                                               | Режим                                                |
| ----------------------------------------------------- | ---------------------------------------------------- |
| `/about`, `/teachers`, `/privacy`, `/consent`         | `prerender` (статические маркетинговые/юр. страницы) |
| остальное (`/`, `/clubs`, `/gallery`, `/enroll/*`, …) | `ssr`                                                |
| личный кабинет                                        | `ssr: false` (SPA)                                   |

Для всех роутов задан CSP-заголовок `frame-src` (VK/Yandex-виджеты).

## Структура

```
app/
├── assets/css/          # глобальные стили: tokens, base, utilities, animations
├── components/
│   ├── app/             # каркас: Header, Footer, MobileMenu, Photo, Video, ScrollFade
│   ├── home/            # секции главной (hero, top-clubs, events, gallery, subscriptions, …)
│   ├── clubs/ gallery/ about/ teachers/            # секции соответствующих страниц
│   ├── event/ subscription/ trial/ payment/        # флоу записи и оплаты
│   ├── my-cabinet/ legal/                          # ЛК и юридические страницы
│   └── *.vue            # общие: SectionLeading, FaqSection, CallbackForm, FloatPromoCard, …
├── composables/         # логика (авто-импорт): useApi, useSchedule, useSubscriptionPlans, use*Enrollment, …
├── constants/           # nav, masks, mock (моки enroll-флоу — временно)
├── layouts/default.vue  # Header + <slot> + Footer
├── middleware/          # close-menu.global
├── pages/               # файловый роутинг
├── plugins/             # scroll-to-top.client
├── schemas/             # Zod-схемы форм (event, registration, fields)
├── store/               # Pinia stores (mobile-menu)
├── types/               # api.d.ts (генерится) + index.ts (алиасы) + доменные типы
└── utils/               # чистые функции (авто-импорт): format-price, pluralize, theme, …
public/
├── core/  moke/  og/    # изображения
└── ...
docs/                    # планы страниц, юр. черновики, CRO-чеклист
```

## Качество кода

**Pre-commit** (husky, `.husky/pre-commit`):

```
bunx prettier --write . && bun run lint && bun run typecheck
```

Отдельно `.github/hooks/impeccable.json` — локальный хук, форматирующий затронутые
файлы после каждого редактирования (в `.prettierignore`, CI его не проверяет).

**CI** (`.github/workflows/ci.yml`, на каждый push в любую ветку):

```
bun run prettier --check .  →  bun run lint  →  bun run typecheck  →  bun run build
```

Стандарт кода: strict TS без `any`, слоистая архитектура `pages → features → shared`,
производное состояние через `computed`, схемы Zod как единый источник правды для форм.
