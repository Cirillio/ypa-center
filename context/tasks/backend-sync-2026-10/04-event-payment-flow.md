# 04. Поток оплаты события на `/enroll/event`

**Зачем:** платное событие должно уводить на ЮKassa; тексты про «оплату на месте»
устарели.

## Тесты (сначала)

`tests/nuxt/composables/useEventRegistration.nuxt.spec.ts` (новый; шов – фейковый
`ApiFetch` через сервис, `navigateTo` – `mockNuxtImport`):

- бесплатное событие → `result` заполнен, `navigateTo` не вызван, ключа нет;
- платное → `navigateTo(paymentUrl, { external: true })`;
- **повтор после сетевой ошибки с той же формой → тот же ключ**; форма изменилась → новый;
- `it.each` по ошибкам → `error.code` и действия:
    - `409 EVENT_PRICE_CHANGED` → вызван `onEventsStale`;
    - `409 PAYMENT_IN_PROGRESS`, `503 PAYMENT_GATEWAY_UNAVAILABLE`, `429 RATE_LIMITED`
      с `Retry-After` → кулдаун = заголовку (фейковые таймеры), ключ сохранён;
    - `409 IDEMPOTENCY_KEY_REUSED` → следующий запрос с новым ключом;
    - `422 phone`, `attendees_count`, `event`, `email` → тексты; `attendees_count` и `event` → `onEventsStale`;
    - `404` → `onEventsStale`;
- двойной вызов `submit` во время запроса → один запрос.

`tests/nuxt/components/enroll.nuxt.spec.ts` – `EnrollEventSummary`:

- платное: подпись «К оплате», кнопка «Перейти к оплате», текст про ЮKassa и 15 минут;
- бесплатное: «Записаться», «оплата не нужна»;
- нигде нет «на месте» и «позвонит».

## Код

- `useEventRegistration`: ключ, ветвление по исходу, новые коды.
- `Summary.vue`, `ContactsForm.vue` (help email), `Accepted.vue` – тексты.
- Токен: проверить вживую, что протухший access не ломает запись гостя (`useApi`).

## Готово, когда

Тесты красные → зелёные; браузер: бесплатное – экран «Заявка принята»; платное –
уход на ЮKassa (тестовый магазин).
