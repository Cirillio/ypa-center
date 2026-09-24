# Стандарты кода

Правила написания кода. Архитектурные границы – в `architecture.md`, там же
инварианты. Здесь – как выглядит сам код внутри этих границ.

---

## 1. Общее

- Одна функция, один композабл, один компонент – одна ответственность.
- Над каждой новой функцией, композаблом, компонентом или хелпером – **ровно
  одна строка комментария о назначении**. Комментарий объясняет **зачем**, а не
  пересказывает код.
- Чинить причину, а не симптом. Обходной путь вместо исправления – повод
  остановиться и переформулировать задачу.
- Закомментированный код и мёртвые файлы не коммитятся. Найден мёртвый код –
  удаляется.
- Русский язык в комментариях и UI-текстах, английский – в идентификаторах.

---

## 2. TypeScript

- `strict: true`. Нет типа – напиши `interface`.
- **Запрещено:** `any`; `as Type` без предварительной проверки; `!`
  (non-null assertion) без гарантии из соседней строки.
- Внешние данные валидируются на границе: ответы API – через сгенерированные
  типы, пользовательский ввод – через Zod.
- Типы импортируются как `import type { … }`, всегда из `~/types`, не из
  `~/types/api.d.ts` напрямую.
- `enum` – только для замкнутых наборов UI-значений (пример: `SchoolClasses`).
  Для значений из API используются сгенерированные union-типы.

---

## 3. Vue и Nuxt

- Только `<script setup lang="ts">`. Options API запрещён.
- Порядок блоков в SFC: `<script setup>`, `<template>`, `<style>` (если он
  вообще нужен – стили пишутся утилитами Tailwind).
- Пропсы – `defineProps<T>()` с типом, значения по умолчанию через
  `withDefaults`. Двусторонняя связь – `defineModel()`.
- События – `defineEmits<{ … }>()`. Имя события описывает факт (`confirm`,
  `select`), без префикса `on`. Function-props вместо `emit` не используем.

    > ⚠️ Нарушается в `me/GuestGate.vue`, `gallery/ModalControls.vue`
    > (function-props) и в `me/LeaveConfirm.vue`, `me/Section.vue`
    > (`on`-префикс). См. `tasks/component-audit-2026-09.md`.

- `useEffect`-паттерны запрещены: никакого фетчинга в `watch`, никакого
  `watch` без остановки там, где он переживает компонент.
- Индекс массива как `:key` запрещён. Ключ – стабильный `id`.
- `v-if` и `v-for` на одном элементе не совмещаем.
- Композабл называется `useXxx`, возвращает объект с `ref`/`computed` и
  функциями. Никакой разметки внутри.
- Prop drilling глубже двух уровней запрещён – поднимаем в композабл или стор.
- Автоимпорты включены для `composables/`, `utils/`, `services/`, компонентов и
  API Vue. Ручные импорты этих сущностей не пишем.

---

## 4. Состояние

- Pinia, только setup-stores (`defineStore("name", () => { … })`).
- В стор попадает только состояние, переживающее смену роута: авторизация,
  мобильное меню. Состояние одной страницы живёт в её композабле.
- Redux, MobX, Vuex, старый Provider – запрещены.
- Производное состояние – `computed`. `watch`, пишущий в `ref`, – признак
  ошибки проектирования.
- Копировать `data` из `useAsyncData` в локальный `ref` запрещено: копия
  расходится с источником после `refresh()`.

---

## 5. Работа с API

Инварианты – в `architecture.md` §8. Здесь их практическая форма.

```ts
// ✅ чтение
const svc = useGalleryService()
const { data, refresh } = await useAsyncData("gallery", () => svc.getAll())

// ✅ мутация – в композабле фичи
const svc = useCallbackService()
async function submit(payload: CallbackRequestPayload) {
    try {
        await svc.create(payload)
    } catch (e) {
        error.value = parseApiError(e, "Не удалось отправить заявку")
    }
}

// ❌ вызов фабрики вне setup
function onClick() {
    const svc = useGalleryService()
}
```

- Ключ `useAsyncData` – стабильная строка, уникальная в пределах приложения.
- Обработка статусов – через `getFetchStatus(err)`, а не по тексту сообщения.
- Каждый метод сервиса снабжается комментарием с эндпоинтом:
  `/** GET /api/v1/public/gallery/ */`.
- После изменения контрактов бэка: поднять бэк и выполнить
  `bun run schema:update`, затем обновить алиасы в `app/types/index.ts`.

---

## 6. Формы

- Источник правды – Zod-схема в `app/schemas/*.schema.ts`.
- Переиспользуемые поля берутся из `app/schemas/fields.ts`
  (`fullName`, `phone`, `email`, `comments`, `consent`, `birthDate`).
  Новое общее правило добавляется туда, а не копируется в схему.
- Тип формы выводится из схемы (`z.infer`), руками не дублируется.
- Маски ввода – `maska`, паттерны в `app/constants/masks.ts`.
- Публичные формы защищены Turnstile и кулдауном
  (`useAntiSpamCooldown`). Свой кулдаун не писать.
- Ошибки сабмита показываются пользователю: тост или поле формы. Молчаливый
  `catch` запрещён, кроме best-effort случаев с явным комментарием (пример –
  `logout`).

---

## 7. Стили

- Tailwind CSS 4, CSS-first. Конфиг живёт в CSS, не в `tailwind.config.js`.
- Захардкоженные hex-значения в компонентах запрещены. Цвета – токены `--ui-*`
  и семантические классы Nuxt UI (`text-default`, `text-muted`, `bg-default`,
  `text-error`). Подробности – `ui-context.md`.
- Глобальные правки внешнего вида компонентов Nuxt UI – в `app/app.config.ts`
  (`ui.button.slots` и т. п.), не в разметке каждой страницы.
- Кастомные утилиты – в `app/assets/css/utilities.css`, внутри `@layer utilities`.
- `!important` (`class!`) – только там, где нужно перебить стиль библиотеки, и с
  комментарием.
- CSS-in-JS и styled-components запрещены.
- Порядок классов выравнивает `prettier-plugin-tailwindcss` – вручную не сортируем.

---

## 8. Файлы и именование

| Сущность     | Именование                    | Пример                    |
| ------------ | ----------------------------- | ------------------------- |
| Компонент    | PascalCase                    | `SectionLeading.vue`      |
| Композабл    | camelCase, префикс `use`      | `useSubscriptionPlans.ts` |
| Сервис       | kebab-case + `.service.ts`    | `me.service.ts`           |
| Zod-схема    | kebab-case + `.schema.ts`     | `registration.schema.ts`  |
| Утилита      | kebab-case                    | `format-price.ts`         |
| Стор         | kebab-case                    | `mobile-menu-store.ts`    |
| Доменный тип | PascalCase, без суффикса `VM` | `MeSubscription`          |

Компонент страницы кладётся в подпапку с её именем
(`app/components/clubs/Card.vue` → `<ClubsCard />`). Общий компонент – в корень
`app/components/`.

> ⚠️ Стор `mobile-menu-store.ts` содержит избыточный суффикс `-store` – второй
> стор называется просто `auth.ts`. Именование надо выровнять.

---

## 9. Доступность

- Иконочные кнопки без текста обязаны иметь `aria-label`.
- Интерактивный элемент – `<button>` или `<a>`, не `<div>` с `@click`.
- Модальные оверлеи: `role="dialog"`, `aria-modal`, закрытие по Escape,
  ловушка фокуса, возврат фокуса на триггер.
- Самодельные табы – полный набор ролей (`tablist`/`tab`/`tabpanel`),
  `aria-selected`, `aria-controls`, навигация стрелками. Либо `UTabs` из Nuxt UI.
- Анимации уважают `prefers-reduced-motion` (глобальное правило есть в
  `base.css`); JS-анимации проверяют его через `useMediaQuery`, а не
  однократным чтением `matchMedia`.
- Линтер `@nuxt/a11y` подключён – его замечания не глушим.

---

## 10. Проверки перед завершением

```bash
bun run check   # format:check → lint → typecheck → build
```

Отдельно, когда нужна только часть:

```bash
bun run typecheck
bun run lint
bun run format:check
bun run build
```

UI- или фича-правка считается готовой только после запуска приложения и
проверки в браузере. Типы и линт этого не заменяют.
