# Центр Умного Развития «УРА» – Frontend Core

Фронтенд сайта [ypa-center.ru](https://ypa-center.ru) – публичная витрина (каталог кружков,
расписание, события, галерея, калькулятор абонемента, формы записи) и личный кабинет родителя.
Построен на Nuxt 4 / Vue 3, работает поверх DRF-бэкенда `ypa-center-backend`.

## Стек

| Категория         | Технологии                                                   |
| ----------------- | ------------------------------------------------------------ |
| Фреймворк         | Nuxt 4 (SSR), Vue 3.5, `<script setup lang="ts">`            |
| UI / стили        | Nuxt UI 4 (Reka UI), Tailwind CSS 4, Phosphor Icons          |
| Шрифты            | `@nuxt/fonts` – Nunito, self-hosted, metric-matched fallback |
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
  нужен во время работы приложения (dev/prod). Для сборки бэкенд не требуется.

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

Бэкенд на этапе сборки не нужен (все публичные роуты на `ssr`, `prerender` отключён).
Он требуется только в runtime — по адресу из `NUXT_PUBLIC_API_BASE`.

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

| Роут(ы)                                                       | Режим              | Обоснование                                                                      |
| ------------------------------------------------------------- | ------------------ | -------------------------------------------------------------------------------- |
| Публичные страницы (`/`, `/clubs`, `/about`, `/teachers`, …)  | `ssr: true`        | SEO и быстрая первая отрисовка; сборка не зависит от наличия бэкенда в CI/Docker |
| Покупка / запись (`/enroll/trial`, `/enroll/subscription`, …) | `ssr: true`        | SSR-каркас и SEO-мета                                                            |
| Личный кабинет (`/login`, `/me`)                              | `ssr: false` (SPA) | Закрытый интерактивный клиентский раздел                                         |

Для всех роутов задан CSP-заголовок `frame-src` (виджеты VK / Яндекс Карт).

## Структура

```
app/
├── assets/css/          # глобальные стили: tokens, base, utilities, animations
├── components/          # 79 компонентов, каноничный автоимпорт Nuxt 4 с префиксом папки:
│   ├── layout/          # каркас: LayoutHeader, LayoutFooter, LayoutMobileMenu
│   ├── ui/              # базовые UI-кирпичики: UiPhoto, UiVideo, UiScrollFade, UiPageSection, UiSectionLeading, UiRoundIcon, UiRadioCard
│   ├── promo/           # промо-секции: PromoFaq, PromoJoinUs, PromoSubscriptions, PromoFloatCard
│   ├── shared/          # сквозные формы: SharedCallbackForm, SharedRegistrationForm, SharedEnrollmentSummary
│   └── [domain]/        # секции страниц и флоу: home/, clubs/, about/, teachers/, gallery/, me/, event/, trial/, subscription/, payment/, feedback/, legal/
├── composables/         # реактивная логика (автоимпорт): useSchedule, useSubscriptionPlans, use*Enrollment, …
├── constants/           # навигация, маски, моки (nav, masks, mock)
├── layouts/default.vue  # LayoutHeader + <slot> + LayoutFooter + LayoutMobileMenu
├── middleware/          # гейты: auth, close-menu.global
├── pages/               # файловый роутинг Nuxt
├── plugins/             # auth-sync.client (сессия между вкладками), scroll-to-top.client
├── schemas/             # Zod-схемы валидации форм (event, registration, feedback, fields)
├── services/            # HTTP-сервисы (классы-клиенты, DTO → Domain маппинг, автоимпорт use*Service)
├── stores/              # Pinia setup-stores (auth, mobile-menu-store)
├── types/               # api.d.ts (генерация из OpenAPI) + index.ts (алиасы и доменные типы)
└── utils/               # чистые функции (автоимпорт): format-price, get-day-name, pluralize, theme, …
context/                 # база знаний проекта: архитектура, API, стандарты, трекер
public/                  # статика: favicon, логотипы, шрифты, медиа
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

Стандарт кода: strict TS без `any`, слоистая архитектура Nuxt `pages → composables / services → types / stores / utils / components` (не FSD),
производное состояние через `computed`, схемы Zod как единый источник правды для форм.
