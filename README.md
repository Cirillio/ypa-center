# Центр Умного Развития "УРА" — Frontend Core

Фронтенд-приложение сайта [ypa-center.ru](https://ypa-center.ru), построенное на Nuxt 4 и Vue 3.

## Стек

| Категория                | Технологии                    |
| --------------------------------- | --------------------------------------- |
| Фреймворк                | Nuxt 4, Vue 3                           |
| UI / стили                   | Nuxt UI, Tailwind CSS 4, Phosphor Icons |
| Состояние                | Pinia, VueUse                           |
| Утилиты                    | dayjs (ru), zod, maska                  |
| SEO                               | sitemap, robots.txt                     |
| Изображения            | @nuxt/image                             |
| Доступность            | @nuxt/a11y                              |
| Пакетный менеджер | Bun                                     |

## Требования

- [Bun](https://bun.sh) ≥ 1.3

## Запуск

```bash
# Установка зависимостей
bun install

# Режим разработки
bun dev

# Сборка для продакшена
bun build

# Предпросмотр продакшен-сборки
bun preview
```

## Структура проекта

```
app/
├── assets/
│   ├── css/            # Глобальные стили
│   └── images/         # Статические изображения
├── components/
│   └── App/            # Глобальные компоненты (AppHeader, AppFooter)
├── composables/        # Vue composables (авто-импорт)
├── layouts/
│   └── default.vue     # Базовый layout
├── middleware/         # Route middleware
├── pages/              # Страницы (файловый роутинг)
├── plugins/            # Nuxt plugins
├── stores/             # Pinia stores
├── types/              # TypeScript типы и интерфейсы
├── utils/              # Утилиты (авто-импорт)
└── app.vue             # Корневой компонент
public/                 # Статические файлы (robots, favicon)
docs/openapi/           # OpenAPI спецификации
nuxt.config.ts          # Конфигурация Nuxt
```

## Переменные окружения

Скопируйте `.env` и при необходимости измените значения:

```bash
cp .env .env.local
```

## Качество кода

Проект использует ESLint + Prettier. Husky запускает линтер перед каждым коммитом.

```bash
# Запуск линтера
bun lint
```
