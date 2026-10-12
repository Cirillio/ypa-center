# Задача: перенести переключатель недели с абонемента на каталог кружков

## Проблема

В `EnrollSubscriptionSlotsWidget` (`/enroll/subscription`) есть переключатель
недели (`EnrollSubscriptionWeekSwitcher`), который управляет тем, какая неделя
запрашивается у `GET /public/schedule/?week_start=` для показа `available`.
Но сам виджет прямо пишет пользователю: «Свободные места показаны на неделю
... и на состав абонемента не влияют. Абонемент действует месяц с первого
занятия». Подтверждено архитектурой (`architecture.md` §6): в корзину падает
`schedule_id` (паттерн «ПН 16:00»), не календарная дата.

То есть переключатель недели в конструкторе абонемента — это не выбор
недели абонемента (абонемент вне недель), а прогноз занятости мест на
горизонт вперёд. Эта функция по смыслу принадлежит каталогу кружков
(`/clubs`, `ClubsSchedule.vue`), где человек ещё выбирает, что записывать —
а не виджету оформления, где выбор уже сделан. Сейчас `clubs.vue` фетчит
расписание без `week_start` (только текущая неделя, без листалки) —
`schedule.getWeek()` без аргумента в `pages/clubs.vue:14`.

## Блокер: открытый вопрос 22

`progress-tracker.md` уже содержит вопрос 22 — верхняя граница горизонта
переключения (`week_start`) не зафиксирована ни в `checkout-flow.md`, ни в
`api-core-contracts.md`, сейчас `MAX_WEEK_OFFSET = 3` (текущая + 3 недели)
взято из макета `/enroll/subscription`. **Перенос на `/clubs` не закрывает
этот вопрос** — он просто меняет место, где горизонт нужен. Владелец должен
решить: тот же лимит (4 недели) или другой для каталога, прежде чем задача
берётся в работу.

## Что сделать (после ответа на вопрос 22)

Правка пересекает UI и слой данных на двух разных страницах — по
`ai-workflow-rules.md` §3 такой шаг дробится. План ниже — для одной сессии
на весь перенос; при исполнении агент вправе разбить на два коммита/ревью
(сначала `useSchedule` + `clubs.vue`, отдельно — чистка `/enroll/subscription`),
но не смешивать с другой задачей.

1. **`app/composables/useSchedule.ts`** — добавить week-offset. Перенести из
   `useSubscriptionCheckout.ts`: `TIMEZONE`, `getNovosibirskDate`,
   `MAX_WEEK_OFFSET`, `getMondayByOffset`, `formatIsoDate`,
   `formatWeekRangeLabel`, `weekOffset`, `currentMonday`, `weekStart`,
   `weekRangeLabel`, `canPrevWeek`, `canNextWeek`, `prevWeek`, `nextWeek`.
   `buildWeekDays()` параметризовать датой понедельника (сейчас всегда строит
   от сегодня) — иначе `isToday` будет подсвечиваться и на чужих неделях.

2. **`app/components/clubs/Schedule.vue`** — забрать фетч на себя:
   `useAsyncData(() => \`clubs-schedule:${weekStart.value}\`, () => schedule.getWeek(weekStart.value), { watch: [weekStart] })`вместо прокинутого пропа`slots`. Добавить переключатель в шапку секции
рядом с «Расписание на неделю». `pages/clubs.vue`перестаёт фетчить
расписание и пробрасывать`scheduleData`/`scheduleError`— просто`<ClubsSchedule />` без пропов.

3. **Компонент переключателя** — перенести
   `components/enroll/subscription/WeekSwitcher.vue` →
   `components/clubs/ScheduleWeekSwitcher.vue` (единственный потребитель
   после переноса). Поправить `aria-label` группы (сейчас «Неделя показа
   мест» — привязано к формулировке абонемента).

4. **`app/composables/useSubscriptionCheckout.ts`** — упростить. Удалить всё,
   что переехало в п.1: `MAX_WEEK_OFFSET`, `getMondayByOffset`,
   `formatIsoDate`, `formatWeekRangeLabel`, `weekOffset`, `currentMonday`,
   `weekStart`, `weekRangeLabel`, `canPrevWeek`, `canNextWeek`, `prevWeek`,
   `nextWeek`, `getNovosibirskDate`, `TIMEZONE` (если больше нигде в файле не
   используются). `useAsyncData` — статичный ключ,
   `scheduleService.getWeek()` без аргумента (бэк сам отдаёт текущую
   неделю), `watch` не нужен. Из возвращаемого объекта убрать
   `weekRangeLabel`, `canPrevWeek`, `canNextWeek`, `prevWeek`, `nextWeek`.

5. **`components/enroll/subscription/SlotsWidget.vue`** — убрать пропы
   `weekRangeLabel`, `canPrevWeek`, `canNextWeek`, эмиты `prevWeek`/`nextWeek`,
   блок `<EnrollSubscriptionWeekSwitcher>`. Текст-подсказку упростить — убрать
   упоминание конкретной недели, оставить «абонемент действует месяц с
   первого занятия, каждый кружок развернётся в 4 занятия».

6. **`pages/enroll/subscription.vue`** — убрать из деструктуризации
   `useSubscriptionCheckout()` и из пропов/хендлеров
   `EnrollSubscriptionSlotsWidget`: `weekRangeLabel`, `canPrevWeek`,
   `canNextWeek`, `prevWeek`, `nextWeek`.

## Документация (правится вместе с кодом, не после)

- `architecture.md` §6 — не требует правки по сути (инвариант «schedule_id,
  не дата» не меняется), но стоит явно зафиксировать, что горизонт недель
  теперь на `/clubs`, если вопрос 22 решится в пользу переноса лимита.
- `progress-tracker.md` — закрыть вопрос 22 записью решения владельца;
  добавить строку в «Сделано» после реализации.

## Проверка (критерий приёмки)

- `bun run check` проходит.
- На `/clubs`: переключение недель двигает грид расписания (мобильный и
  десктопный вид), `isToday`-подсветка корректна только на текущей неделе,
  нет потери реактивности при `watch: [weekStart]`.
- На `/enroll/subscription`: переключателя недели и текста про конкретную
  неделю больше нет; выбор кружков и подбор тарифа работают как раньше
  (`bun run check` + ручная проверка сборки абонемента из нескольких
  кружков).
- Нет регресса SSR (`routeRules: ssr: true` на обеих страницах) — проверить
  `curl` на `/clubs`, как это делалось 2026-09-25 для страниц покупки.
