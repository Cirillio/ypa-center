# Отчёт: Тост при переходе по ссылке на событие без мест

**Дата:** 2026-10-05  
**Статус:** Выполнена

---

## 1. Что сделано

1. В [`app/composables/useEventCheckout.ts`](file:///home/cirillio/web/ypa-center.ru/frontend-core/app/composables/useEventCheckout.ts) подключён `useToast()`.
2. В хуке `onMounted` добавлена проверка события по `parsedInitialId`:
    - Если переданный в ссылке `eventId` соответствует реальному событию из афиши, но у него `availableSeats <= 0`, пользователю показывается информационный тост:
        - Заголовок: «Все места заняты»
        - Описание: `На событие «${soldOutEvent.title}» запись закрыта. Выберите другое мероприятие из афиши.`
        - Иконка: `ph:users-three-bold`
        - Цвет: `neutral`
3. Невалидный параметр по-прежнему безопасно стирается из URL (`syncQuery(undefined)`), чтобы предотвратить расхождение стейта.
4. Попутно устранён скрытый конфликт макроса компилятора `defineEmits` в `app/components/feedback/Form.vue` (ручной импорт из vue приводил к ошибке TS2440 при typecheck).

---

## 2. Проверка

- `bun run typecheck`: успешно (0 ошибок).
- `bun run lint`: чисто (0 ошибок, 1 существующее предупреждение в `SectionLeading.vue`).
