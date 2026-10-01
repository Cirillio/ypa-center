# Задача: подключение оплаты (абонемент + пробное + опрос результата)

**Статус:** фронт выполнен 2026-09-30, живая оплата ждёт бэк. Итог, отступления и хвосты – `report.md` (рядом).

Шаг 5 плана («Флоу оплаты», `project-overview.md`). Перед началом прочитай
`CLAUDE.md` проекта, `code-standards.md` и «Порядок чтения» – протокол (контекст
→ план → апрув владельца → исполнение порциями, без коммита) уже там.

## Цель

`POST /checkout/subscription` и `POST /checkout/trial` подключены к готовым
страницам `/enroll/subscription` и `/enroll/trial`. При клике «Продолжить»:

1. Если платёж требует оплаты деньгами (`amount > 0`) → создаётся транзакция с
   детерминированным `X-Idempotency-Key`, пользователь уходит на страницу оплаты
   ЮКассы (`payment_url`), а после оплаты возвращается на единый экран
   `/checkout/result?tx={transaction_id}`.
2. Если платёж покрыт на 100% депозитом (`use_deposit: true`) или пробное бесплатное →
   бэк сразу возвращает `status: "CONFIRMED"`, `payment_url: null`. Фронт без ухода
   на внешний шлюз переходит на тот же `/checkout/result?tx={transaction_id}`.
3. На `/checkout/result?tx={tx}` изолированный композабл `useTransactionStatus`
   опрашивает статус транзакции и отображает реактивные экраны ожидания, успеха,
   отмены или таймаута. До релиза ручки бэкендером опрос работает на
   конвенционном `MOCK(tx-status)`.

`POST /checkout/event` на бэке не существует (гостевая регистрация с оплатой
на месте через `POST /public/events/{id}/register/`) – события в этой задаче не трогать.

---

## Архитектурные решения и устранение рисков

1. **Генерация типов из схемы – первый шаг:**
   Перед написанием кода запускается `bun run schema:update`. Бэк на `mvp` уже запущен
   на порту 8000, в `app/types/api.d.ts` появятся сгенерированные `TrialSlotsResponse`,
   `TrialSlot` и типы чекаута. Ручное описание DTO запрещено (`code-standards.md §5`).
2. **Слоты пробного – живой API (`GET /public/activities/{id}/next-slots/`):**
   Бэк уже реализовал этот эндпоинт (PR #15). Он отдаёт окно сегодня + 13 дней со
   свободными местами. Метод `ActivitiesService.getNextTrialSlots` переключается с
   мока на реальный запрос `this.fetch("/v1/public/activities/${activityId}/next-slots/")`.
3. **Статус транзакции и `MOCK(tx-status)` со сценариями:**
   Ручка `GET /api/v1/checkout/transactions/{id}` и динамический `return_url`
   переданы бэкендеру в разработку. До их выкатки фронтенд строит транспортный метод
   `BillingService.getTransactionStatus` поверх `MOCK(tx-status)`
   (`app/services/mocks/tx-status.mock.ts`). Мок хранит счётчик вызовов в `Map<string, number>`
   по `txId` и поддерживает сценарии проверки:
    - `tx` содержит `canceled` → статус `CANCELED`, `canceled_reason: "bank_declined"`;
    - `tx` содержит `slow` → вечный `PENDING` (проверка таймаута);
    - `tx` содержит `missing` → бросает ошибку формы `FetchError` (`statusCode: 404`, `response.status: 404`, `data.code: "NOT_FOUND"`), чтобы `getFetchStatus` и `getProblemCode` распознавали её штатно;
    - любой другой `tx` → 2 вызова `PENDING`, далее `SUCCEEDED`.
4. **Конфигурация роута и рендеринга `/checkout/result`:**
   В Nuxt ключ `ssr` у `definePageMeta` не существует (режим рендеринга задаётся
   только через `routeRules` в `nuxt.config.ts`, как у `/login` и `/me`).
    - В `nuxt.config.ts` в `routeRules` добавляется `"/checkout/**": { ssr: false }`.
    - В `nuxt.config.ts` в `robots.disallow` добавляется `"/checkout"`.
    - В `app/pages/checkout/result.vue` в `definePageMeta` задаётся только `{ middleware: "auth" }`.
5. **Гейты авторизации и `architecture.md §5.2`:**
   Контекстный файл `architecture.md §5.2` уже синхронизирован с решением владельца:
   выбор кружков/слотов открыт гостю, но выбор ребёнка и чекаут требуют авторизации
   (кнопка неактивна). В `useCheckoutPayment` остаётся страховочный guard: если
   `!authStore.isAuthed`, перенаправлять на `/login?redirectFrom=<текущий_роут>`.
6. **Кнопка «Попробовать снова» на статусе `canceled`:**
   Ведёт на исходный конструктор по типу транзакции: при `type === "SUBSCRIPTION"` →
   `/enroll/subscription`, при `type === "TRIAL"` → `/enroll/trial`. Выбор собирается заново.
7. **Ключ идемпотентности – производное от отпечатка заказа (без watch-сайдэффектов):**
   Ключ вычисляется чистой функцией отпечатка заказа
   (`plan_id/schedule_id`, `student_id`, отсортированные `slot_ids/trial_date`, `use_deposit`).
   Если отпечаток совпадает с предыдущей отправкой – отдаётся сохранённый UUID, если
   состав изменился – генерируется новый `crypto.randomUUID()`. Никаких `watch`, пишущих в `ref`.
8. **Поведение при `IDEMPOTENCY_KEY_REUSED`:**
   Никакого молчаливого автоповтора. Показываем понятное сообщение об ошибке и
   сбрасываем отпечаток, чтобы следующее осознанное нажатие сформировало новый ключ.
9. **Хелпер `getRetryAfter` и блокировка кнопки:**
   В `app/utils/parse-error.ts` добавить утилиту `getRetryAfter(err: unknown): number | null`,
   извлекающую секунды из заголовка `Retry-After` ответа бэка.
   При `409 PAYMENT_IN_PROGRESS` (5 с) и `503 PAYMENT_GATEWAY_UNAVAILABLE` (30 с) кнопка
   блокируется таймером обратного отсчёта.
10. **Polling статуса – изолированный `useTransactionStatus`:**
    - Состояние интерфейса: `viewState: Ref<'pending' | 'success' | 'canceled' | 'timeout' | 'error'>`.
    - Запуск polling раз в 2 с (до 10 попыток).
    - Обязателен `onScopeDispose` для отмены таймера при уходе со страницы.
    - Ошибки 403 и 404 – терминальные (`viewState.value = 'error'`, опрос прекращается).
    - Временные ошибки сети / 5xx списывают 1 попытку и опрос продолжается.
    - Учитывается заголовок `Retry-After`, если бэк прислал задержку.
11. **Безопасность возврата (`resolveRedirect`):**
    Добавить `"/checkout/result"` в `ALLOWED_PATHS` (`app/utils/resolve-redirect.ts`),
    чтобы при протухании сессии во время оплаты возврат не сбрасывался на `/me`.
12. **Частичный депозит в сводке:**
    Если `balance > 0`, чекбокс «Оплатить с депозита» рассчитывает честное списание:
    `deposit_applied = Math.min(balance, planPrice)`.
    В сводке выводятся две строки: «Списать с депозита: X ₽», «К оплате деньгами: Y ₽»
    (или «0 ₽», если покрыто полностью).
13. **Префикс эндпоинтов в коде сервиса:**
    `useApi()` уже настроен на baseURL с `/api`. В коде сервисов вызывать
    `this.fetch("/v1/checkout/subscription")` (без префикса `/api` и без завершающего слэша!).
    В JSDoc над методом указывать полный каноничный URL: `/** POST /api/v1/checkout/subscription */`.

---

## Контракты API

### 1. Чекаут абонемента

```http
POST /api/v1/checkout/subscription
Authorization: Bearer <access_token>
X-Idempotency-Key: <uuid4>
Content-Type: application/json

{
  "plan_id": 3,
  "student_id": 101,
  "slot_ids": [106, 210],
  "use_deposit": false
}
```

_Внимание:_ URL строго без завершающего слэша!

### 2. Чекаут пробного занятия

```http
POST /api/v1/checkout/trial
Authorization: Bearer <access_token>
X-Idempotency-Key: <uuid4>
Content-Type: application/json

{
  "student_id": 101,
  "schedule_id": 11,
  "trial_date": "2026-10-05"
}
```

_Внимание:_ URL строго без завершающего слэша! `trial_date` – дата в формате `YYYY-MM-DD`.

### 3. Единый ответ создания заказа (`201 Created`)

```json
{
  "transaction_id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
  "status": "PENDING_PAYMENT" | "CONFIRMED",
  "payment_url": "https://yookassa.ru/checkout/payments/..." | null,
  "expires_at": "2026-06-13T16:15:00+07:00" | null
}
```

### 4. Контракт проверки статуса транзакции (`MOCK(tx-status)`)

```http
GET /api/v1/checkout/transactions/{transaction_id}
Authorization: Bearer <access_token>
```

Ответ `200 OK`:

```json
{
  "id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
  "status": "PENDING" | "SUCCEEDED" | "CANCELED",
  "type": "SUBSCRIPTION" | "TRIAL",
  "amount": 700000,
  "canceled_reason": "expired_on_confirmation" | "bank_declined" | null,
  "created_at": "2026-09-30T18:40:00+07:00",
  "expires_at": "2026-09-30T19:10:00+07:00"
}
```

---

## План реализации по слоям

### Этап 1. Конфигурация, типы, транспорт и мок

1. Выполнить `bun run schema:update` при поднятом бэке для актуализации `app/types/api.d.ts`.
2. В `nuxt.config.ts`:
    - В `routeRules` добавить `"/checkout/**": { ssr: false }`.
    - В `robots.disallow` добавить `"/checkout"`.
3. Добавить `"/checkout/result"` в `ALLOWED_PATHS` (`app/utils/resolve-redirect.ts`).
4. Добавить `PAYMENT_GATEWAY_UNAVAILABLE` в `ProblemCode` (`app/types/index.ts`) и `PROBLEM_CODES` (`app/utils/parse-error.ts`).
5. Реализовать утилиту `getRetryAfter(err: unknown): number | null` в `app/utils/parse-error.ts`.
6. Снять мок со слотов пробного:
    - В `app/services/activities.service.ts` переписать `getNextTrialSlots` на реальный вызов `this.fetch("/v1/public/activities/${activityId}/next-slots/")`.
7. Создать `app/services/mocks/tx-status.mock.ts`:
    - Реализация `MOCK(tx-status)` со сценариями (`canceled`, `slow`, `missing` с `FetchError(404)`, default).
8. Создать `app/services/billing.service.ts`:
    - `checkoutSubscription(payload, idempotencyKey)` → `this.fetch("/v1/checkout/subscription", { method: "POST", headers: { "X-Idempotency-Key": idempotencyKey }, body: payload })`.
    - `checkoutTrial(payload, idempotencyKey)` → `this.fetch("/v1/checkout/trial", { method: "POST", headers: { "X-Idempotency-Key": idempotencyKey }, body: payload })`.
    - `getTransactionStatus(txId)` → вызов `MOCK(tx-status)` с комментарием о снятии после бэка.
    - Экспортировать `useBillingService()`.

### Этап 2. Композаблы логики

1. Реализовать утилиту `createOrderFingerprint(payload)`:
    - Детерминированная строка отпечатка заказа для контроля идемпотентности.
2. Реализовать `app/composables/useCheckoutPayment.ts`:
    - Состояния: `isSubmitting: Ref<boolean>`, `error: Ref<ProblemDetail | null>`, `cooldownSeconds: Ref<number>`.
    - Страховочная проверка `authStore.isAuthed` перед отправкой (редирект на `/login?redirectFrom=...`).
    - Использование сохранённого UUID при совпадении отпечатка или генерация нового `crypto.randomUUID()`.
    - Парсинг `Retry-After` через `getRetryAfter` и включение обратного отсчёта.
    - Навигация: при наличии `payment_url` → `window.location.href = payment_url`, при `CONFIRMED` без url → `navigateTo({ path: '/checkout/result', query: { tx: transaction_id } })`.
3. Реализовать `app/composables/useTransactionStatus.ts`:
    - Принимает `txId: MaybeRef<string | undefined>`.
    - Состояния: `viewState: Ref<'pending' | 'success' | 'canceled' | 'timeout' | 'error'>`, `transaction: Ref<TransactionStatus | null>`, `error: Ref<ProblemDetail | null>`.
    - Polling каждые 2 с (до 10 попыток), остановка при терминальных статусах или 403/404.
    - `onScopeDispose` для отмены таймера при уходе.

### Этап 3. UI страниц покупки

1. **Абонемент ([`/enroll/subscription`](file:///home/cirillio/web/ypa-center.ru/frontend-core/app/pages/enroll/subscription.vue)):**
    - В сводку `EnrollSubscriptionSummary.vue`:
        - Добавить чекбокс «Оплатить с депозита» (показывать только при `depositBalance > 0` из `useMeDeposit`).
        - Расчёт частичного списания: `depositApplied = Math.min(depositBalance, tierPrice)`.
        - Вывод сумм: «Списать с депозита: X ₽», «К оплате деньгами: Y ₽».
        - Блокировка кнопки «Продолжить», если `currentTier.id === null` или не выбран ребёнок, или идёт `cooldownSeconds > 0`.
        - Подключение `@continue` к `submitSubscription`.
        - Блок отображения ошибки под кнопкой.
2. **Пробное ([`/enroll/trial`](file:///home/cirillio/web/ypa-center.ru/frontend-core/app/pages/enroll/trial.vue)):**
    - Подключение `@continue` к `submitTrial` с выбранными `schedule_id` и `date`.
    - Блок отображения ошибки под кнопкой (с акцентом на `TRIAL_LIMIT_EXCEEDED`).

### Этап 4. Страница результата `/checkout/result`

1. Создать `app/pages/checkout/result.vue`:
    - Настройки: `definePageMeta({ middleware: "auth" })`.
    - Получение `tx` из `route.query.tx`. Если нет – редирект на `/me`.
    - Подключение `useTransactionStatus(tx)`.
    - Отображение 5 состояний по `viewState`:
        1. **`pending`:** спиннер, заголовок «Подтверждаем оплату в банке...», текст «Обычно это занимает несколько секунд».
        2. **`success`:** зелёная иконка успеха, заголовок «Заказ успешно оформлен!», сумма, кнопки «В личный кабинет» и «К расписанию».
        3. **`canceled`:** иконка отмены, «Оплата не прошла или была отменена», текст `canceled_reason`, кнопка «Попробовать снова» (переход на `/enroll/subscription` или `/enroll/trial` по `transaction.type`).
        4. **`timeout`:** «Банк обрабатывает платёж чуть дольше обычного», ссылка на `/me`.
        5. **`error` (404/403):** «Транзакция не найдена», кнопка «В личный кабинет».

---

## Приёмка

1. **Типы:**
    - `app/types/api.d.ts` содержит актуальные типы бэка из OpenAPI без ручных DTO.
2. **Частичный и полный депозит:**
    - Баланс депозита > 0 → чекбокс виден, суммы пересчитываются наглядно.
    - Полное покрытие депозитом → `201 Created` с `payment_url: null` → мгновенный переход на `/checkout/result?tx=...` → экран успеха без посещения внешнего шлюза.
3. **Оплата через ЮКассу:**
    - `amount > 0` → редирект на ЮКассу; в сетевом запросе заголовок `X-Idempotency-Key` (валидный UUID).
4. **Идемпотентность:**
    - Повторный клик с тем же составом заказа шлёт тот же `X-Idempotency-Key`. Смена слота/тарифа меняет ключ.
5. **Пробное занятие:**
    - Слоты приходят из живого эндпоинта `next-slots`. Заказ отправляет корректный `trial_date` и `schedule_id`.
6. **Экран результата и мок:**
    - `/checkout/result?tx=test-uuid` → 2 тика `pending` → `success`.
    - `/checkout/result?tx=mock-canceled` → `canceled` → клик «Попробовать снова» уводит на соответствующий конструктор.
    - `/checkout/result?tx=mock-slow` → через 20 с `timeout`.
    - `/checkout/result?tx=mock-missing` → `error` (валидная ошибка формы `FetchError(404)`).
    - Таймер polling не утекает при переходе на другую страницу (проверить в консоли).
7. **Безопасность:**
    - Гость при попытке открыть `/checkout/result` уходит на `/login` по `middleware: "auth"`.
    - Возврат после логина с `redirectFrom=/checkout/result?tx=...` разрешён белым списком.
8. **Стандарты качества:**
    - `bun run check` чистый: 0 ошибок TypeScript, 0 ошибок ESLint.
    - Мок помечен тегом `MOCK(tx-status)` и зафиксирован в техдолге.
