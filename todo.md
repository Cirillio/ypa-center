# TODO — Реализация страниц «Улица Радости»

## Глобальные правки (сделать до начала страниц)

- [ ] `nuxt.config.ts` — обернуть `vite.server.allowedHosts: true` в условие `NODE_ENV === 'development'`
- [ ] `package.json` — перенести `@nuxt/a11y` и `nuxt-openapi-docs-module` в `devDependencies`
- [ ] `main.css` — переименовать `--font-mono: 'Rubik'` → `--font-display` или `--font-heading`
- [X] `ci.yml` — добавить шаг `prettier --check .` после lint
- [X] `nuxt.config.ts` — добавить `https://yandex.ru` в `frame-src` CSP (нужно для карты на /about)
- [X] `AppCallbackForm.vue` — исправить ссылку: первая ведёт на `/consent`, вторая на `/privacy`

---

## `/gallery` — Галерея

### Компоненты

- [X] `components/gallery/Section.vue` — hero-шапка страницы (заголовок + подзаголовок)
- [X] `components/gallery/Grid.vue` — сетка фото + состояние (activeIndex, open/close/prev/next)
- [X] `components/gallery/Modal.vue` — тупой презентационный компонент, только props + emits

### Логика `Grid.vue`

- [X] `photos` — загрузка через `useFetch` с бэка
- [X] `activeIndex: Ref<number | null>` — null = модал закрыт
- [X] `activePhoto` — computed из activeIndex
- [X] `prev()` / `next()` — с wrap-around (с последнего → первый)
- [X] `onKeydown` — `ArrowLeft`, `ArrowRight`, `Escape`

### Контракт `Modal.vue`

```ts
// props
photo: GalleryPhoto
hasPrev: boolean
hasNext: boolean

// emits
close
prev
next
```

### Тип данных

```ts
type GalleryPhoto = {
    id: number
    url: string // абсолютный URL (Media Root → Nginx)
    alt: string
    thumbnail: string
}
```

### Инфраструктура (задача Андрея)

- [ ] Модель `GalleryPhoto` в Django
- [ ] Медиафайлы хранятся в Docker volume, Nginx раздаёт `/media/`
- [ ] Эндпоинт `GET /gallery/photos/`

---

## `/about` — О нас

Порядок секций: `Section → Story → Stats → Owner → Map`

### Страницы

- [x] `pages/about.vue`

### Компоненты

- [x] `components/about/Section.vue` — hero-шапка (заголовок + короткий текст)
- [x] `components/about/Story.vue` — история создания центра (текст + видео)
- [x] `components/about/Stats.vue` — те же 3 стата, что и в херо в мейне, но в красивых карточках
- [x] `components/about/Owner.vue` — инфо о хозяйке (фото + текст)
- [x] `components/about/Map.vue` — iframe Яндекс.Карты с меткой

### `Map.vue`

- [x] Встроенный `<iframe>` от Яндекс.Карт (без npm-пакетов)
- [ ] Прописать корректные координаты центра (сейчас используется шаринг-ссылка)
- [x] Убедиться что CSP разрешает `frame-src https://yandex.ru`

---

## `/privacy` и `/consent` — Юридические страницы

### Компоненты

- [X] `components/legal/Section.vue` — один компонент на обе страницы, принимает контент через слот

### Страницы

- [X] `pages/privacy.vue` — Политика конфиденциальности
- [X] `pages/consent.vue` — Согласие на обработку персональных данных

### Структура `Section.vue`

```
<article>
├── Заголовок + дата обновления (prop)
├── <slot />  ← текст документа
└── Контакты для обращений
```

### Контент

- [ ] Получить финальные тексты обоих документов от юриста/хозяйки
- [ ] Вставить в соответствующие страницы

---

## `/clubs` — Каталог кружков

### Компоненты

- [X] `components/clubs/Section.vue` — hero-шапка

- ~~ `components/clubs/Filters.vue` — фильтры: возраст (число) + дни недели (мультиселект)~~

- [X] `components/clubs/Grid.vue` — сетка карточек, принимает отфильтрованный список
- [X] `components/clubs/Card.vue` — карточка кружка
- [X] `components/clubs/Empty.vue` — состояние «ничего не найдено»

### Логика фильтрации (клиентская, в `clubs.vue` или composable)

- [ ] `selectedDays: Ref<string[]>` — мультиселект дней
- [ ] `selectedAge: Ref<number | null>` — возраст ребёнка
- [ ] `filtered` — computed, фильтрует по обоим параметрам одновременно
- [ ] Сброс фильтров

### Карточка `Card.vue`

- [X] Фото кружка
- [X] Название + описание
- [X] Педагог (фото + имя)
- [X] Расписание (дни)
- [X] Возраст (мин–макс)

- ~~ Цена (форматируется через `Intl.NumberFormat`, значение с бэка в копейках)~~

- [X] Доступность мест — три состояния:
  - 🟢 Есть места (`spots_available > 3`)
  - 🟡 Мало мест (`spots_available` от 1 до 3)
  - 🔴 Мест нет — кнопка «Записаться» задизейблена

### Тип данных

```ts
type Club = {
    id: number
    name: string
    description: string
    photo: string
    teacher: {
        name: string
        photo: string
    }
    schedule: {
        days: string[]
        time: string
    }
    age: {
        min: number
        max: number
    }
    price: number // копейки
    spots_total: number
    spots_available: number // бэк считает, фронт только отображает
}
```

### Инфраструктура (для бэка)

- [ ] Модель `Club` + `Teacher` в Django
- [ ] Эндпоинт `GET /clubs/` — возвращает все кружки (фильтрация на клиенте)

---

---

## `/teachers` — Команда

Данные грузит `teachers.vue` через `useFetch`, передаёт пропсом в `Grid.vue`.

### Страницы

- [ ] `pages/teachers.vue`

### Компоненты

- [ ] `components/teachers/Section.vue` — «Наша небольшая но дружная команда» + подзаголовок
- [ ] `components/teachers/Grid.vue` — сетка карточек, принимает `teachers` пропсом
- [ ] `components/teachers/Card.vue` — фото + ФИО + роль + описание

### Тип данных

```ts
type Teacher = {
    id: number
    name: string
    description: string
    photo: string  // абсолютный URL
}
```

### Инфраструктура (для бэка)

- [ ] Модель `Teacher` в Django
- [ ] Эндпоинт `GET /teachers/`

---

## Следующий этап (не сейчас)

- [ ] `/enroll` — запись на пробное занятие + флоу ЮKassa
- [ ] `/subscribe` — оформление абонемента + флоу ЮKassa

- ~~ `/clubs/[id]` — страница отдельного кружка (если понадобится)~~
- ~~ `/events` — События и каникулярные программы~~
