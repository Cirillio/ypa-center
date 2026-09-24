# Аудит компонентов фронта – находки и хвосты

Дата: 2026-09-14. Ветка: `preprod`. Охват: 75 компонентов `app/components/**`, сторы, страницы `me`/`login`/`gallery`/`clubs`/`teachers`.

Критерии: самодостаточность (coupling), SRP / god-component, контракты props/emits, реактивность, слои (`pages → features → shared`), a11y, мёртвый код.

Статусы: ✅ исправлено · ⬜ открыто · ❓ нужно решение.

> **2026-09-23:** часть открытых находок вычеркнута – либо продублирована в
> `progress-tracker.md` (техдолг), либо будет поглощена активным редизайном
> покупок и кабинета (`project-overview.md` §5–6), отдельно их решать не
> нужно.

---

## 1. Код-ревью диффа `origin/preprod...HEAD`

| #   | Статус | Файл                                         | Суть                                                                                                                                                              | Коммит    |
| --- | ------ | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| 1   | ✅     | `assets/css/tokens.css` + 7 потребителей     | `--header-height` переименован в `--ui-header-height`, потребители остались на старом имени → ломалась вёрстка на `/404`, `/about`, `/enroll/*`, в мобильном меню | `84e571d` |
| 2   | ✅     | `components/me/GuestGate.vue`                | `onReset` объявлен, но не вызывался – на шаге кода нельзя исправить email                                                                                         | `06924e1` |
| 3   | ✅     | `composables/useCallbackForm.ts`             | `as PreferredTimeWindow` без проверки; `ContactTimeOption.value` был `string`                                                                                     | `00ce61a` |
| 4   | ✅     | `pages/gallery.vue`                          | `photos` – копия `data`, расходится после `refresh()`                                                                                                             | `6a7346c` |
| 5   | ✅     | `services/me.service.ts`, `plans.service.ts` | конвертация копеек→рубли продублирована → `kopecksToRubles` в `utils/format-price.ts`                                                                             | `ad608a1` |
| 6   | ✅     | `utils/date.ts`                              | весь файл мёртв (0 вызовов)                                                                                                                                       | `84e571d` |
| 7   | ✅     | `useCallbackForm.ts` / `useFeedbackForm.ts`  | anti-spam кулдаун продублирован → `useAntiSpamCooldown`                                                                                                           | `4f360da` |
| 8   | ✅     | `services/me.service.ts`                     | `getUpcoming({weeks: 0})` терял параметр (truthy-проверка)                                                                                                        | `69ee162` |

## 2. Аудит компонентов – исправлено

| Статус | Файл                                                                       | Суть                                                                                                                                    | Коммит    |
| ------ | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| ✅     | `components/event/Summary.vue`, `components/trial/SelectionSummary.vue`    | 0 вызовов, заменены общим `EnrollmentSummary`                                                                                           | `1ed5060` |
| ✅     | `middleware/auth.ts`, `stores/auth.ts`                                     | `hydrate()` не имел вызывающих: плагин `app/plugins/auth.client.ts` из Задачи 1 так и не попал в коммиты. Вызов восстановлен в мидлваре | `427855d` |
| ✅     | `components/gallery/Modal.vue`                                             | мёртвый emit `close`                                                                                                                    | `71b00ef` |
| ✅     | `components/gallery/ModalControls.vue`                                     | icon-only кнопки prev/next/close без `aria-label`                                                                                       | `71b00ef` |
| ✅     | `components/RegistrationForm.vue`, `components/event/RegistrationForm.vue` | `schema: unknown` → `FormSchema<T>`                                                                                                     | `e022d8f` |
| ✅     | `components/clubs/Schedule.vue`                                            | `slotsForDay` пересчитывал filter+sort до 16 раз за рендер → `computed`-Map                                                             | `1f79dbf` |
| ✅     | `pages/me.vue`                                                             | сбой `addChild` – необработанный reject без фидбэка → toast                                                                             | `2c01829` |

## 3. Открытые находки – нужны решения

### 3.1 Дублирование (консолидация)

- ⬜ **`CallbackForm.vue` ↔ `feedback/Form.vue`** – одинаковые consent-футер и связка `UTooltip` + submit-кнопка (в `feedback/Form.vue:39` комментарий «как в CallbackForm»). Кандидат: `FormConsentFooter`, `FormSubmitButton`.
- ⬜ **`about/Stats.vue` ↔ `about/Section.vue`** – побайтово одинаковый вывод `CENTER_STATS` из `useAppConfig()`. Кандидат: `useCenterStats()`. Пересекается с редизайном мини-статов (`ui-context.md` §10) – решать вместе, не раньше.

Вычеркнуто 2026-09-23, поглощено редизайном покупок: `clubs/Schedule.vue` ↔
`subscription/SlotDayPicker.vue`, `RegistrationForm.vue` ↔
`event/RegistrationForm.vue` – оба компонента переписываются заново в рамках
шага 2 плана, консолидировать старую версию нет смысла.

### 3.2 Доступность (a11y)

- ⬜ **`layout/MobileMenu.vue`** – оверлей без `role="dialog"`/`aria-modal`, без Escape-to-close, без focus trap и возврата фокуса на триггер. Блокируется только скролл body.
- ⬜ **`clubs/Card.vue`** (строки ~81–96) – самодельные табы «Особенности»/«Подгруппы» без `role="tablist"`/`tab`/`tabpanel`, `aria-selected`, `aria-controls`, стрелочной навигации.
- ⬜ **`home/events/Card.vue`** – карточка завершённого события рендерится как `<div>` без `aria-disabled`; состояние передано только прозрачностью и текстом.

### 3.3 Контракты компонентов

- ❓ **Function-props вместо `defineEmits`**: `me/GuestGate.vue` (`onHandleOtp`, `onResendCode`, `onReset`), `gallery/ModalControls.vue` (`prev`, `next`, `close`). Остальные компоненты фичи используют `defineEmits`. Работает (Vue мапит `@event` на `onEvent`-проп), но неочевидно и непоследовательно. Решить: единый стандарт.
- ❓ **`on`-префикс в именах emit**: `me/LeaveConfirm.vue` (`onConfirm`), `me/Section.vue` (`onConfirmLogout`). Конвенция Vue: имя события описывает факт (`confirm`, `confirm-logout`), `on*` – сторона слушателя. Рефакторинг требует правки вызывающих.

### 3.4 Мелкое / хвосты

- ⬜ **`home/hero/Section.vue`** – массив фото карусели захардкожен в компоненте (остальные секции берут данные из `useAppConfig()`); `isReducedMotion` читает `matchMedia` один раз внутри `computed`, не реагирует на смену системной настройки → `useMediaQuery` из VueUse.
- ⬜ **`home/gallery/Section.vue`** – секция скрывается целиком, если фото ровно не 5 (`v-if="photos.length === HOME_GALLERY_LIMIT"`); нет пустого состояния, в отличие от `home/events/Empty.vue`, `home/top-clubs/Empty.vue`.
- ⬜ **`home/top-clubs/Section.vue`** – fetch + конечный автомат раскладки (`empty|duo|trio|quad`) + таблица классов в одном `<script setup>`; кандидат: `useTopClubsLayout`.
- ⬜ **`composables/useCabinetChildren.ts`** – `error` ref выставляется и экспортируется, но не читается ни одним шаблоном (ошибка теперь показывается тостом в `me.vue`). Оставить как задел или убрать.

Вычеркнуто 2026-09-23, поглощено редизайном покупок/кабинета:
`subscription/Cart.vue` (transition), `home/subscriptions/Section.vue`
(selectedLessons sync) – оба компонента переписываются в шаге 2 плана;
`ChildrenInfo.vue` submit-баг и TODO про `DELETE /me/children/{id}/` – уже в
`project-overview.md` §6 и `backend-checklist.md`.

## 4. Прочие наблюдения (вне аудита компонентов)

- ⬜ **`services/*`** – `auth.service.ts` документирует, что refresh обходит `apiFetch`; альтернатива – единый `$fetch.create({ onRequest, onResponseError })` в плагине вместо ручного 401-retry в `useApi.ts` (дублирование вызова `$fetch` в основном и повторном пути).

Вычеркнуто 2026-09-23: `--header-height-full` и отсутствие кросс-табной
синхронизации токенов – уже в `progress-tracker.md` (техдолг), незачем в
двух местах; `useEventEnrollment.onSubmit`/`register не подключён` – там же;
`types/status.ts`, `constants/mock.ts` – снесутся сами при редизайне покупок
(шаг 2 плана), отдельно следить не нужно.

## 5. Проверено и чисто

Слои `pages → features → shared` не нарушены нигде (ни один компонент не импортирует из `pages/`). Прямых `apiFetch`/`$fetch` в презентационных компонентах нет. Деструктуризации Pinia-сторов без `storeToRefs` нет. `any` в проверенных файлах не найден. Чисты: `me/ActivityItem`, `ActivityTypeBadge`, `ErrorState`, `ParentInfo`, `SubscribitionCard`, `SubscriptionsList`, `UpcomingActivityCard`, `payment/*`, `feedback/Modal`, `Header`, `Footer`, `PageSection`, `RoundIcon`, `home/*/Card`.

## 6. Рекомендуемый порядок

1. a11y `MobileMenu.vue` (реальный дефект для пользователей клавиатуры и скринридеров).
2. Консолидация `CallbackForm.vue` ↔ `feedback/Form.vue` (3.1) – единственная оставшаяся дублирующая пара форм.
3. Единый стандарт prop/emit (3.3) – решить один раз, применить механически.
4. Остальное – по мере касания файлов.
