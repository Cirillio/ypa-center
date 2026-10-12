# 03. Сервис брони события и ключ идемпотентности

**Зачем:** `EventsService.register` возвращает `void`, не шлёт ключ и не знает об
ответе с оплатой.

## Тесты (сначала)

`tests/unit/utils/order-fingerprint.spec.ts` – отпечаток брони события:

- одинаковая форма → одинаковая строка;
- телефон в разной записи (`+7 (913) 123-45-67` и `+79131234567`) → одинаково;
- пробелы по краям имён и email не влияют;
- смена мест, email, имени, события → другая строка.

`tests/nuxt/services/events.service.nuxt.spec.ts` (новый, фейковый `ApiFetch`):

- бесплатное: путь `/v1/public/events/5/register/`, `POST`, тело как в форме,
  **без** `X-Idempotency-Key`; ответ `{status: "accepted"}` → `{ kind: "accepted" }`;
- платное: заголовок `X-Idempotency-Key` – переданный ключ; ответ чекаута →
  `{ kind: "payment", transactionId, paymentUrl, expiresAt }`;
- ошибка `fetch` пробрасывается, не глотается.

## Код

- Доменный `EventRegistrationOutcome` (размеченное объединение) в `types/index.ts`,
  типы DTO – из `api.d.ts`.
- `register(eventId, payload, idempotencyKey?)`; различение ответа – внутри сервиса.
- `createOrderFingerprint` расширить вариантом события (или отдельная функция в том же файле).
- Решение «ключ из отпечатка формы» – сначала в `architecture.md` §6.

## Готово, когда

Тесты красные → зелёные. Браузер не нужен.
