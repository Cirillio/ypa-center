# 02. Подбор тарифа и `PLAN_UNAVAILABLE`

**Зачем:** `useSubscriptionCheckout` берёт первый тариф с `lessons >= total`. При
пропуске в линейке (тарифы на 1, 2, 4 слота, выбрано 3) уходит тариф на 4 → `422
slot_ids`. Правило бэка: обычный – ровно `slots_count`, безлимит – `slots_count` и
больше, корзина до 10.

## Тесты (сначала)

`tests/unit/utils/pick-plan.spec.ts` (новый, чистая функция
`pickPlan(tiers, slotsCount): PlanTier | null`), `it.each`:

| Линейка                 | Слотов   | Ожидание                   |
| ----------------------- | -------- | -------------------------- |
| 1–5 + безлимит от 6     | 0        | `null`                     |
| 1–5 + безлимит от 6     | 3        | тариф на 3                 |
| 1–5 + безлимит от 6     | 6, 7, 10 | безлимит                   |
| 1–5 + безлимит от 6     | 11       | `null` (потолок корзины)   |
| 1, 2, 4 + безлимит от 6 | 3        | `null` – **не** тариф на 4 |
| 1, 2, 4 + безлимит от 6 | 5        | `null`                     |
| 1–5, без безлимита      | 6        | `null`                     |
| пустая                  | 1        | `null`                     |

`tests/nuxt/services/public.service.nuxt.spec.ts` – `PlansService.getAll`
маппит `slots_count` в `slotsCount` и `is_unlimited` в признак безлимита.

`tests/nuxt/composables/subscription-checkout.nuxt.spec.ts` – текущий тариф
берётся через `pickPlan`; на 3 слота при линейке 1, 2, 4 – тарифа нет, `isReady` ложно.

`tests/nuxt/composables/` – `useCheckoutPayment` (новый файл, если его нет):
`409 PLAN_UNAVAILABLE` → вызван колбэк обновления тарифов, ошибка с этим `code`;
`422` с `invalid_params[slot_ids]` → свой текст; `409 STUDENT_ALREADY_ENROLLED` → свой текст.

## Код

- `PlanTier.slotsCount` (`types/index.ts`), маппинг в `plans.service.ts`.
- `app/utils/pick-plan.ts`; `useSubscriptionCheckout` переходит на него.
- `useCheckoutPayment`: тексты кодов, колбэк `onPlansStale` → `refreshNuxtData("plans")`.
- UI: «нет тарифа на N занятий» под кнопкой (через `missing` в `EnrollSummaryCta`);
  фолбэк `app.config` (`id: null`) – «Тарифы не загрузились, обновите страницу».
- Сверить тексты депозита и «экономии» с базовой ценой 1 200 ₽.

## Готово, когда

Тесты красные → зелёные; браузер: 3, 6, 8 слотов – верный тариф и цена.
