# 01. Каталог ошибок и причин возврата

**Зачем:** новые коды бэка сейчас неизвестны фронту – `getProblemCode` вернёт
`undefined`, и ветвление по `code` в 02–06 не сработает.

## Тесты (сначала)

`tests/unit/utils/parse-error.spec.ts` – дополнить таблицу `it.each`:

- `getProblemCode` распознаёт `EVENT_PRICE_CHANGED`, `PLAN_UNAVAILABLE`
  (и уже известные `RATE_LIMITED`, `PAYMENT_GATEWAY_UNAVAILABLE` – регрессия).
- Неизвестный код по-прежнему → `undefined`.

`tests/unit/constants/refund-reasons.spec.ts` (новый):

- `CANCELED_BY_CENTER` имеет текст «Центр отменил запись на событие.».
- Каждый член `CheckoutTransactionReason`, кроме `NOT_FULFILLED`, имеет текст –
  тест строится по списку из типа, чтобы новая причина в `api.d.ts` его роняла.

## Код

- `ProblemCode` в `app/types/index.ts`, `KNOWN_CODES` в `app/utils/parse-error.ts`.
- `app/constants/refund-reasons.ts` – строка `CANCELED_BY_CENTER`.

## Готово, когда

Тесты были красными, стали зелёными; `bun run check` зелёный. Браузер не нужен.
