# 06. Бесплатное пробное и предпроверка лимита

**Зачем:** при цене кружка 0 сводка показывает «К оплате 0 ₽»; лимит пробного
проверяется только чекаутом (`409`), а `checkout-flow.md` требует предпроверку
при выборе ребёнка.

## Тесты (сначала)

`tests/unit/utils/has-used-trial.spec.ts` (новый, чистая функция по списку
записей `MeBooking`), `it.each`:

- есть пробное того же ребёнка по тому же кружку → `true`;
- тот же кружок, другой ребёнок → `false`; тот же ребёнок, другой кружок → `false`;
- отменённая запись не считается (если статус отдаётся – сверить с `api.d.ts`);
- пустой список → `false`.

`tests/nuxt/services/me.service.nuxt.spec.ts` – запрос
`/me/bookings/?kind=TRIAL&period=all` (параметры именно эти).

`tests/nuxt/composables/trial-checkout.nuxt.spec.ts`:

- цена 0 → признак бесплатного; итог «Бесплатно»;
- выбран ребёнок с использованным пробным → `isReady` ложно, причина в `missing`;
- `409 TRIAL_LIMIT_EXCEEDED` и `STUDENT_ALREADY_ENROLLED` → свои тексты.

`tests/nuxt/components/enroll.nuxt.spec.ts` – `EnrollTrialSummary` при цене 0:
«Бесплатно», кнопка «Записаться», нет упоминания ЮKassa.

## Код

- `app/utils/has-used-trial.ts`, метод бронирований с фильтром в `me.service`.
- `useTrialCheckout`, `enroll/trial/Summary.vue`.

## Готово, когда

Тесты красные → зелёные; браузер: кружок с ценой 0 (в админке «Да, пробное
бесплатное») – оформление без ЮKassa → экран успеха; повторное пробное заблокировано.
