# 00. Тестовая инфраструктура в `preprod`

**Зачем:** TDD невозможен без раннера. Vitest, `@nuxt/test-utils`, фикстуры и
~40 тестов лежат в ветке `tests` (6 коммитов, последний `89af74d`), в `preprod` их нет.
`preprod` ушёл вперёд на 19 коммитов (оплата, бронь события, маскот).

## Шаги

1. `git merge tests` в `preprod` (решение владельца: merge, не rebase – ветка
   уже содержит его коммиты). Конфликты ожидаются в `package.json`, `bun.lock`,
   `context/progress-tracker.md`, `context/architecture.md`, `.husky/pre-commit`,
   `.github/workflows/ci.yml`, `app/schemas/fields.ts`, `app/composables/useAntiSpamCooldown.ts`.
2. `bun install`, `bun run test`.
3. Упавшие тесты разобрать **по одному**: тест устарел из-за изменений в `preprod`
   (например, `useEventCheckout`: контакты стали `parentName` + `childName`) –
   обновить тест под текущее поведение; тест поймал баг – **не чинить тестом**,
   записать в отчёт и спросить владельца (§13 п. 10).
4. `bun run check` зелёный (цепочка уже включает `test` после слияния).

## Тесты

Новых нет. Результат – зелёная база, от которой считается «red» в следующих подзадачах.

## Готово, когда

- `tests` влита, `bun run check` зелёный, список починенных тестов с причиной – в `report.md`.
- `progress-tracker.md`: строка «тесты в ветке `tests`, в `preprod` не влиты» снята.
