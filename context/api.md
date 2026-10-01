# API, который использует фронт

Тонкий справочник: какие эндпоинты есть, кто их вызывает на фронте и где искать
подробности. Payload, коды ошибок и примеры – в `backend/api-core-contracts.md`.
Истина в последней инстанции – живая OpenAPI-схема.

- **Схема:** `http://localhost:8000/api/schema/` (бэк должен быть поднят)
- **Типы:** `bun run schema:update` → `app/types/api.d.ts`, алиасы – `app/types/index.ts`
- **База:** `NUXT_PUBLIC_API_BASE`, по умолчанию `http://localhost:8000/api`
- **Версия:** все пути с префиксом `/v1/`
- **Сверено со схемой:** 2026-09-27, ветка бэка `mvp` (`api.d.ts` перегенерирован).
  Рабочая ветка бэка – `mvp`; `def` заморожена на 2026-09-21

---

## 1. Публичные эндпоинты

Не требуют авторизации. Основа MVP.

| Метод | Путь                                     | Сервис фронта        | Где используется                                               |
| ----- | ---------------------------------------- | -------------------- | -------------------------------------------------------------- |
| GET   | `/v1/public/activities/`                 | `activities.service` | `/clubs` – полный каталог                                      |
| GET   | `/v1/public/activities/popular/`         | `activities.service` | `/` – топ-3 кружка (урезанная форма `ActivityCard`)            |
| GET   | `/v1/public/activities/{id}/`            | –                    | **Не используется** фронтом                                    |
| GET   | `/v1/public/schedule/`                   | `schedule.service`   | `/clubs` – недельная сетка; конструкторы абонемента и пробного |
| GET   | `/v1/public/teachers/`                   | `teachers.service`   | `/teachers`                                                    |
| GET   | `/v1/public/gallery/`                    | `gallery.service`    | `/gallery`, блок галереи на главной                            |
| GET   | `/v1/public/plans/`                      | `plans.service`      | Калькулятор абонемента                                         |
| GET   | `/v1/public/events/`                     | `events.service`     | `/` – афиша; `/enroll/event`                                   |
| POST  | `/v1/public/events/{event_id}/register/` | –                    | **Не используется** – запись на событие не подключена ⚠️       |
| POST  | `/v1/public/callback/`                   | `callback.service`   | Форма «обратный звонок», шлёт `pd_consent`                     |
| POST  | `/v1/public/feedback/`                   | `feedback.service`   | Форма «обратная связь», шлёт `pd_consent`                      |

### Особенности

- **`/public/gallery/`** отдаёт две разные формы: без query-параметров – голый
  массив `GalleryImagePublic[]`, с `?limit&offset` – конверт
  `{count, next, previous, results}`. Обе поддержаны:
  `GalleryService.getAll()` и `.getPage(limit, offset)`.
- **`/public/schedule/`** возвращает сырую недельную сетку `WeekGridResponse`;
  фронт маппит её в доменный `WeeklySlot` (`useSchedule`). Один запрос – одна
  неделя (`week_start`), горизонта нет – несколько недель вперёд собираются
  несколькими вызовами.
- **Источник слотов пробного (`GET /public/activities/{id}/next-slots/`)** – отдельный
  эндпоинт бэка (PR #15). Отдаёт окно сегодня + 13 дней (2 недели), только ещё не
  начавшиеся занятия со свободным местом, с учётом переносов и отмен. Отдаёт
  `TrialSlotsResponse` с массивом `slots: TrialSlot[]` (`schedule_id`, `date`, `start_time`,
  `end_time`, `group_name`, `teacher`). Фронт вызывает напрямую в `ActivitiesService.getNextTrialSlots()`.
  Кэш на бэке 30 секунд.
- **`/public/plans/`** отдаёт копейки. Фолбэк на `appConfig.subscriptions` при
  недоступности API – см. `useSubscriptionPlans`.
- **Формы** отвечают `SubmissionAccepted`, защищены Turnstile и кулдауном
  (`useAntiSpamCooldown`). Модели и антиспам – `backend/public-forms-design.md`.
- **`pd_consent: true` обязателен** в звонке, обратной связи и регистрации на
  событие (иначе `422`). Галочка по умолчанию не отмечена – `UiConsentCheckbox`.
  Подробности – `backend/personal-data.md`.
- **`/public/activities/`**: у подгрупп (`groups[]`) больше нет мест и времени
  (`seats_free`, `day_of_week`, `start_time`, `end_time` убраны). Места считаются
  только в сетке `/public/schedule/` на конкретную дату; карточка кружка их не
  показывает.

---

## 2. Авторизация

Анкета после первого входа реализована (2026-09-24). Полные
правила – `backend/auth-flow.md`, реализация на фронте – `architecture.md` §5.

| Метод | Путь                      | Сервис         | Ответ                                         |
| ----- | ------------------------- | -------------- | --------------------------------------------- |
| POST  | `/v1/auth/otp/request/`   | `auth.service` | 202 `{status, resend_available_in, code_ttl}` |
| POST  | `/v1/auth/otp/verify/`    | `auth.service` | 200 `{access, refresh, profile_completed}`    |
| POST  | `/v1/auth/token/refresh/` | `useApi`       | 200 `{access, refresh}` – ротация обоих       |
| POST  | `/v1/auth/logout/`        | `auth.service` | 205                                           |

Refresh вызывается не сервисом, а транспортом `useApi()` – это единственное
место, где живёт single-flight-логика. Бэк ротирует refresh и блэклистит
старый, поэтому ротация идёт под замком Web Locks: вкладка, дождавшаяся его,
берёт уже обновлённую пару из `localStorage` (`architecture.md` §5.4).

**Флаг анкеты – `profile_completed`**, его считает бэк (ФИО, телефон, «откуда
узнали», согласие на ПД). Приходит в ответе `verify` (стор сразу выбирает шаг
`profile` или `accepted`) и в `GET /me/profile/` (`isProfileComplete`).
Пока `false`, все ручки ЛК, кроме профиля и детей, и оба чекаута отвечают
`403 PROFILE_INCOMPLETE` – `useApi` уводит на `/login?redirectFrom=<текущий путь>`.

---

## 3. Личный кабинет

Требуют `Authorization: Bearer`.

| Метод  | Путь                      | Сервис       | Доменная модель                                                                                         |
| ------ | ------------------------- | ------------ | ------------------------------------------------------------------------------------------------------- |
| GET    | `/v1/me/profile/`         | `me.service` | `MeProfile` (родитель + дети). Доступен до анкеты                                                       |
| PATCH  | `/v1/me/profile/`         | `me.service` | Анкета: `full_name`, `phone`, `referral_source`, `pd_consent: true`. Доступен до анкеты                 |
| POST   | `/v1/me/children/`        | `me.service` | Добавление ребёнка. Доступен до анкеты                                                                  |
| PATCH  | `/v1/me/children/{id}/`   | –            | **Не используется** – решение владельца (редактирования нет)                                            |
| DELETE | `/v1/me/children/{id}/`   | `me.service` | Мягкое удаление, `204`. `409 CHILD_HAS_ACTIVE_ENROLLMENTS` со списком в `extensions.active_enrollments` |
| GET    | `/v1/me/subscriptions/`   | `me.service` | `Page<MeSubscription>` – действующие сверху, потом история (`ACTIVE` / `EXPIRED`)                       |
| GET    | `/v1/me/bookings/`        | `me.service` | `Page<MeBooking>`, всегда `period=all`: предстоящие по близости, затем прошедшие от свежих              |
| GET    | `/v1/me/upcoming/`        | `me.service` | `MeUpcoming[]` – лента предсортирована бэком, без `limit` (горизонт ≤ 8 недель)                         |
| GET    | `/v1/me/deposit/`         | `me.service` | Баланс в рублях (`0`, если депозита нет)                                                                |
| GET    | `/v1/me/deposit/entries/` | `me.service` | `Page<MeDepositEntry>` – история движений, новые сверху                                                 |
| GET    | `/v1/me/trials/`          | –            | **Устарела** на бэке, замена – `/me/bookings/?kind=TRIAL`. Фронт не использует                          |

### Особенности

- Списка детей отдельным эндпоинтом **нет**: дети приходят внутри
  `/me/profile/` (удалённые скрыты).
- **Пагинация** (`backend/api-core-contracts.md` §0.5): без `?limit` – голый
  массив, с `?limit&offset` – конверт `Page<T>` (`{count, next, previous, results}`,
  тип в `types/index.ts`, в OpenAPI не описан). Списки ЛК грузятся композаблом
  `usePagedList` (первая страница + «Показать ещё» через `offset`), страница – 5.
- `/me/subscriptions/` отдаёт `slots[].schedule` готовой строкой вида
  `"СБ 16:00-17:00"` – форматировать на фронте не нужно. У `EXPIRED` остаток
  всегда `0` (переведён на депозит), карточка показывает, сколько было куплено.
- `/me/upcoming/` отдаёт `date` как `"31.12.2001"` и `time` как `"16:00-17:00"`.
- `/me/bookings/`: ключ карточки – `kind + id` (id уникален только в своей
  таблице); `cost` может быть `null` (нет транзакции); общий `status`
  (`PENDING` / `CONFIRMED`) плюс готовый `status_display` и `is_past`.
- Суммы в копейках → `kopecksToRubles` внутри `me.service`; в компонентах
  рублёвое поле модели выводится через `formatRubles`, не `formatRub`.

---

## 4. Оплата

Подключено на фронте 2026-09-30 (`tasks/payment-checkout/report.md`). UX – `backend/checkout-flow.md`.

| Метод | Путь                             | Примечание                                                                                                                     |
| ----- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| POST  | `/v1/checkout/subscription`      | **Без завершающего слеша** ⚠️. Требует `X-Idempotency-Key` (UUID v4). Тело: `plan_id`, `student_id`, `slot_ids`, `use_deposit` |
| POST  | `/v1/checkout/trial`             | **Без завершающего слеша** ⚠️. Требует `X-Idempotency-Key`. Тело: `student_id`, `schedule_id`, `trial_date` (календарная дата) |
| GET   | `/v1/checkout/transactions/{id}` | **Ещё нет на бэке** (`MOCK(tx-status)`). Статус транзакции для опроса на `/checkout/result?tx=`                                |
| POST  | `/v1/checkout/event`             | **Не существует.** Гостевая регистрация с оплатой на месте (`POST /v1/public/events/{id}/register/`)                           |
| POST  | `/v1/webhooks/yookassa`          | Server-to-server, фронта не касается                                                                                           |

**`X-Idempotency-Key`** – обязательный заголовок на обоих чекаутах.
Повтор с тем же ключом и тем же телом возвращает тот же `201` (не дублирует покупку);
с тем же ключом, но другим телом – `409 IDEMPOTENCY_KEY_REUSED`. Фронт выводит ключ
из отпечатка состава заказа (`architecture.md` §6).

**CORS (⚠️ бэк, на 2026-09-30):** `x-idempotency-key` не входит в `CORS_ALLOW_HEADERS`,
а `Retry-After` – в `CORS_EXPOSE_HEADERS`: из браузера чекаут не проходит preflight.
Локально проверено временным патчем, бэкендеру передано.

**Ответы без денег:** при `use_deposit: true` с полным покрытием или бесплатном
пробном бэк сразу отдаёт `{ status: "CONFIRMED", payment_url: null }` – фронт без
ЮKassa переходит на `/checkout/result?tx=`.

**`return_url` и опрос статуса (⚠️ бэк, на 2026-09-30):** сейчас `return_url`
статичный (`/checkout/result` без параметров); договорились, что бэк будет
передавать `?tx={transaction_id}`. Ручки `GET /v1/checkout/transactions/{id}` ещё нет –
фронт опрашивает `MOCK(tx-status)` 10 раз по 2 с. Контракт ответа (черновик):
`{ id, status: PENDING|SUCCEEDED|CANCELED, type: SUBSCRIPTION|TRIAL, amount (копейки),
canceled_reason, created_at, expires_at }`, доступ только владельцу (`403`/`404`).

**Конфигурация ЮKassa:** без `YOOKASSA_SHOP_ID` / `YOOKASSA_SECRET_KEY` в `.env` бэка
любой чекаут отдаёт `500` (даже депозитный) – для локальной проверки нужен тестовый магазин.

---

## 5. Ошибки

Единый формат RFC 9457 (`ProblemDetail`):

```ts
{
  type: "urn:problem-type:validationerror",  // из имени класса, НЕстабилен
  title: "Validation Error",
  status: 422,
  detail: "Человекочитаемое сообщение на русском",
  code: "VALIDATION_ERROR",                  // машинный код – switch только по нему
  extensions?: {
    request_id?: string,
    invalid_params?: Array<{ name: string; reason: string }>,  // только 422
    active_enrollments?: ActiveEnrollmentDto[]                 // 409 CHILD_HAS_ACTIVE_ENROLLMENTS
  }
}
```

Всё в `app/utils/parse-error.ts`, свои парсеры писать запрещено:

- `parseApiError(err, fallback)` – текст для пользователя;
- `getProblemCode(err)` – `ProblemCode` из каталога (`types/index.ts`) или
  `undefined`. `ProfileIncomplete` пока приходит без `code` – хелпер узнаёт его
  по `type`;
- `getActiveEnrollments(err)` – живые записи ребёнка из `409`;
- `getFetchStatus(err)` – HTTP-статус.

Тело проверяется type guard'ами, а не приводится через `as`.

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
