# API, который использует фронт

Тонкий справочник: какие эндпоинты есть, кто их вызывает на фронте и где искать
подробности. Payload, коды ошибок и примеры – в `backend/api-core-contracts.md`.
Истина в последней инстанции – живая OpenAPI-схема.

- **Схема:** `http://localhost:8000/api/schema/` (бэк должен быть поднят)
- **Типы:** `bun run schema:update` → `app/types/api.d.ts`, алиасы – `app/types/index.ts`
- **База:** `NUXT_PUBLIC_API_BASE`, по умолчанию `http://localhost:8000/api`
- **Версия:** все пути с префиксом `/v1/`
- **Сверено со схемой:** 2026-09-21, на ветке бэка `feat/frontend-integration`.
  С 2026-09-22 бэк переехал на `def` – раздел «Авторизация», «Личный кабинет» и
  «Оплата» ниже обновлены по коду ветки, но живой Swagger после пересборки
  контейнеров не переснимался, сверить перед началом работы

---

## 1. Публичные эндпоинты

Не требуют авторизации. Основа MVP.

| Метод | Путь                                     | Сервис фронта        | Где используется                                         |
| ----- | ---------------------------------------- | -------------------- | -------------------------------------------------------- |
| GET   | `/v1/public/activities/`                 | `activities.service` | `/clubs` – полный каталог                                |
| GET   | `/v1/public/activities/popular/`         | `activities.service` | `/` – топ-3 кружка (урезанная форма `ActivityCard`)      |
| GET   | `/v1/public/activities/{id}/`            | –                    | **Не используется** фронтом                              |
| GET   | `/v1/public/schedule/`                   | `schedule.service`   | `/clubs` – недельная сетка; конструктор абонемента       |
| GET   | `/v1/public/teachers/`                   | `teachers.service`   | `/teachers`                                              |
| GET   | `/v1/public/gallery/`                    | `gallery.service`    | `/gallery`, блок галереи на главной                      |
| GET   | `/v1/public/plans/`                      | `plans.service`      | Калькулятор абонемента                                   |
| GET   | `/v1/public/events/`                     | `events.service`     | `/` – афиша; `/enroll/event`                             |
| POST  | `/v1/public/events/{event_id}/register/` | –                    | **Не используется** – запись на событие не подключена ⚠️ |
| POST  | `/v1/public/callback/`                   | `callback.service`   | Форма «обратный звонок»                                  |
| POST  | `/v1/public/feedback/`                   | `feedback.service`   | Форма «обратная связь»                                   |

### Особенности

- **`/public/gallery/`** отдаёт две разные формы: без query-параметров – голый
  массив `GalleryImagePublic[]`, с `?limit&offset` – конверт
  `{count, next, previous, results}`. Обе поддержаны:
  `GalleryService.getAll()` и `.getPage(limit, offset)`.
- **`/public/schedule/`** возвращает сырую недельную сетку `WeekGridResponse`;
  фронт маппит её в доменный `WeeklySlot` (`useSchedule`).
- **`/public/plans/`** отдаёт копейки. Фолбэк на `appConfig.subscriptions` при
  недоступности API – см. `useSubscriptionPlans`.
- **Формы** отвечают `SubmissionAccepted`, защищены Turnstile и кулдауном
  (`useAntiSpamCooldown`). Модели и антиспам – `backend/public-forms-design.md`.

---

## 2. Авторизация

В активной работе – флоу переделывается (анкета после первого входа). Полные
правила – `backend/auth-flow.md`, реализация на фронте – `architecture.md` §5.

| Метод | Путь                      | Сервис         | Ответ                                         |
| ----- | ------------------------- | -------------- | --------------------------------------------- |
| POST  | `/v1/auth/otp/request/`   | `auth.service` | 202 `{status, resend_available_in, code_ttl}` |
| POST  | `/v1/auth/otp/verify/`    | `auth.service` | 200 `{access, refresh}`                       |
| POST  | `/v1/auth/token/refresh/` | `useApi`       | 200 `{access, refresh}` – ротация обоих       |
| POST  | `/v1/auth/logout/`        | `auth.service` | 205                                           |

Refresh вызывается не сервисом, а транспортом `useApi()` – это единственное
место, где живёт single-flight-логика.

⚠️ Контракт для «профиль пуст → нужна анкета» не задокументирован явно –
уточнить у автора бэка, какими полями `GET /me/profile/` сигналит пустой
профиль. См. `backend-checklist.md` (вне git, корень `ypa-center.ru/`).

---

## 3. Личный кабинет

Требуют `Authorization: Bearer`. В активной переделке.

| Метод  | Путь                                    | Сервис       | Доменная модель                                                                                                    |
| ------ | --------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------ |
| GET    | `/v1/me/profile/`                       | `me.service` | `MeProfile` (родитель + дети)                                                                                      |
| PATCH  | `/v1/me/profile/`                       | –            | **Не используется**, понадобится для анкеты регистрации ⚠️                                                         |
| POST   | `/v1/me/children/`                      | `me.service` | Добавление ребёнка                                                                                                 |
| PATCH  | `/v1/me/children/{id}/`                 | –            | **Не используется** ⚠️                                                                                             |
| DELETE | `/v1/me/children/{id}/`                 | –            | **Ещё нет на бэке**, в работе у друга – см. `backend-checklist.md`                                                 |
| GET    | `/v1/me/subscriptions/`                 | `me.service` | `MeSubscription[]`                                                                                                 |
| GET    | `/v1/me/upcoming/`                      | `me.service` | `MeUpcoming[]` – лента предсортирована бэком                                                                       |
| GET    | `/v1/me/trials/`                        | –            | **Новый на `def`**, ещё не подключён во фронте. `TrialView[]`                                                      |
| GET    | `/v1/me/bookings/` _(рабочее название)_ | –            | **Ещё не существует.** Планируется как агрегатор `TRIAL + EVENT` для блока «Наши записи», см. `architecture.md` §6 |

### Особенности

- Списка детей отдельным эндпоинтом **нет**: дети приходят внутри
  `/me/profile/`. `POST /me/children/` только создаёт.
- `/me/subscriptions/` отдаёт `slots[].schedule` готовой строкой вида
  `"СБ 16:00-17:00"` – форматировать на фронте не нужно.
- `/me/upcoming/` отдаёт `date` как `"31.12.2001"` и `time` как `"16:00-17:00"`.
- Суммы в копейках → `kopecksToRubles` внутри `me.service`.
- `/me/subscriptions/` и `/me/upcoming/` планируется запагинировать конвертом
  как у галереи – см. `progress-tracker.md`.

---

## 4. Оплата

В активной работе – подключение начинается **после** редизайна трёх страниц
записи, не раньше (`project-overview.md` §5). UX – `backend/checkout-flow.md`.

| Метод | Путь                        | Примечание                                                                                                                       |
| ----- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| POST  | `/v1/checkout/subscription` | **Без завершающего слеша** – в отличие от всех остальных путей ⚠️. Требует `X-Idempotency-Key` (UUID v4)                         |
| POST  | `/v1/checkout/trial`        | Новый на `def`. Требует `X-Idempotency-Key`. Тело: `student_id`, `schedule_id`, `trial_date` (настоящая календарная дата)        |
| POST  | `/v1/checkout/event`        | **Не существует.** Друг делает взамен текущей гостевой регистрации с оплатой на месте – не начинать интеграцию, пока не появится |
| POST  | `/v1/webhooks/yookassa`     | Server-to-server, фронта не касается                                                                                             |

**`X-Idempotency-Key`** – обязательный заголовок на обоих готовых чекаутах.
Повтор запроса с тем же ключом и тем же телом должен возвращать тот же
результат (не дублировать покупку); с тем же ключом, но другим телом – `409`.
Значит фронту нужно генерировать и хранить UUID v4 на попытку оформления,
переживающий повторные нажатия «Оплатить», но не переживающий уход со
страницы конструктора (там и так нет сохранения состояния).

---

## 5. Ошибки

Единый формат RFC 9457 (`ProblemDetail`):

```ts
{
  type: "urn:problem-type:validationerror",
  title: "Validation Error",
  status: 422,
  detail: "Человекочитаемое сообщение на русском",
  extensions?: {
    request_id?: string,
    invalid_params?: Array<{ name: string; reason: string }>  // только 422
  }
}
```

Разбор – только `parseApiError(err, fallback)`; статус – `getFetchStatus(err)`.
Оба в `app/utils/parse-error.ts`. Свои парсеры писать запрещено.

Статусы, которые фронт обрабатывает отдельно: `401` (неверный или истёкший
код / протухший токен), `429` (кулдаун и лимит попыток), `400` (формат ввода),
`422` (валидация по полям).

---

## 6. Что должно приходить с бэка, но пока захардкожено

Кандидаты на перенос в API – обсуждается вместе с `content.md`.

| Что                                                                  | Где лежит сейчас                                     |
| -------------------------------------------------------------------- | ---------------------------------------------------- |
| Тарифы абонементов (фолбэк)                                          | `app.config.ts` → `subscriptions`                    |
| FAQ                                                                  | `app.config.ts` → `faq`                              |
| Контакты, адрес, соцсети, часы работы                                | `app.config.ts` → `contactInfo`                      |
| Цена пробного (1 200 ₽)                                              | `app.config.ts` → `pricing`                          |
| Статистика центра («100+», год открытия)                             | `app.config.ts` → `stats`                            |
| Слоты расписания и каталог кружков для флоу `trial` / `subscription` | `app/constants/mock.ts` – **моки** ⚠️                |
| Фото карусели на главной                                             | Захардкожены в `components/home/hero/Section.vue` ⚠️ |

Эндпоинта `/public/settings/` на бэке нет. Решение о его появлении – за
владельцем проекта, см. `backend/admin.md`, последний раздел.
