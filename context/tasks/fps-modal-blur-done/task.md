# Задача: убрать backdrop-blur с оверлеев модалок (просадка FPS в Brave)

## Проблема

При открытии модалок (`UModal` из Nuxt UI) в Brave жёстко падает FPS.

Причина: `backdrop-filter: blur()` на оверлее — дорогая операция, которую браузер
пересчитывает каждый кадр композитинга, особенно пока идёт open/close transition
оверлея (`DialogOverlay` из Reka UI анимируется через `opacity`/`data-state`).
Усугубляется тем, что под оверлеем часто уже есть свой отдельный `backdrop-blur`
слой (шапка сайта) — получаются два стекированных blur-слоя одновременно.
Chromium-браузеры (Brave в их числе) не ускоряют `backdrop-filter` так же дёшево,
как статичный `filter` на маленьком элементе, особенно с большим радиусом поверх
сложного фона.

## Что сделать

Убрать `backdrop-blur-*` из пропа `overlay` во всех модалках, оставить только
затемнение (`bg-black/NN`).

1. `app/components/gallery/Modal.vue:56`
   было: `overlay: 'bg-black/60 backdrop-blur-sm'`
   стало: `overlay: 'bg-black/60'`

2. `app/components/feedback/Modal.vue:24`
   было: `overlay: 'bg-black/25 backdrop-blur-xs'`
   стало: `overlay: 'bg-black/25'`

3. `app/components/callback/Modal.vue:19`
   было: `overlay: 'bg-black/25 backdrop-blur-xs'`
   стало: `overlay: 'bg-black/25'`

4. `app/components/me/parent/LeaveConfirm.vue:21`
   было: `overlay: 'bg-black/25 backdrop-blur-xs'`
   стало: `overlay: 'bg-black/25'`

5. `app/components/me/parent/ChildDeleteConfirm.vue:25`
   было: `overlay: 'bg-black/25 backdrop-blur-xs'`
   стало: `overlay: 'bg-black/25'`

Дополнительно: проверить `grep -rn "overlay:.*backdrop-blur" app` — если найдутся
ещё модалки/slideover'ы с тем же паттерном, применить тот же фикс.

## Что НЕ трогать

`backdrop-blur` вне оверлеев модалок — это статичные декоративные элементы на
небольшой площади, не источник проблемы:

- `app/components/layout/Header.vue:21`
- `app/components/layout/MobileMenu.vue:29`
- `app/components/clubs/Card.vue:57`
- `app/components/home/hero/Section.vue:49,51`
- `app/components/about/Section.vue:49`
- `app/components/enroll/MobileBar.vue:28`

## Проверка (критерий приёмки)

- В классах `overlay` всех модалок не осталось `backdrop-blur-*`, `bg-black/NN`
  сохранён как был.
- `bun run typecheck` (или соответствующий скрипт из `package.json`) проходит
  без новых ошибок.
- Вручную: открыть галерею/фидбек/коллбэк модалки в Brave, DevTools → Performance,
  записать открытие/закрытие модалки — просадок FPS быть не должно.
