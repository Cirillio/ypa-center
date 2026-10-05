# 05. Экран результата для события

**Зачем:** ЮKassa вернёт гостя на `/checkout/result?tx=<id>&kind=event`, а страница
под `middleware: "auth"` и опрашивает ручку только для вошедших.

## Тесты (сначала)

`tests/nuxt/services/` – метод `getEventPaymentStatus(id)`:

- путь `/v1/public/events/payments/{id}/`, без токена не падает;
- маппинг в `CheckoutTransaction`, `order` – вариант события (`title`, `startsAt`,
  `attendeesCount`); `amount` в копейках без изменений.

`tests/nuxt/composables/useTransactionStatus.nuxt.spec.ts` (фейковые таймеры):

- источник статуса – параметр; для события зовётся публичный метод, для покупок – прежний;
- `PENDING` → опрос раз в 2 с; `SUCCEEDED` / `CANCELED` / `REFUND` → остановка и экран;
- `404` → `error`, опрос остановлен;
- дедлайн `expires_at` + 5 мин → `timeout`.

`tests/nuxt/components/` – `CheckoutResultWidget` с событием:

- успех: «Вы записаны на „{title}“», дата в поясе Новосибирска, «мест: N»;
- отмена: «Попробовать снова» ведёт на `/enroll/event?eventId=…`; есть «К афише»,
  нет «Выбрать другую группу»;
- возврат с `CANCELED_BY_CENTER` → текст из 01.

`tests/unit/utils/` – чистая функция разбора `?kind=` (`event` | по умолчанию покупка).

## Код

- Метод сервиса, доменный тип `order`, параметр источника в `useTransactionStatus`.
- Гейт входа на странице только без `kind=event` – решение сначала в `architecture.md` §5.
- Убрать устаревший комментарий про `?tx=` в `pages/checkout/result.vue`.

## Готово, когда

Тесты красные → зелёные; браузер **в окне без входа**: успех, отмена, возврат
(тестовый магазин ЮKassa); с входом экран покупки не сломан.
