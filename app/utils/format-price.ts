/**
 * Цены с бэка приходят в копейках – переводим в целые рубли (округление
 * вниз до рубля, для отображения в карточках и сводках без дробной части).
 */
export const kopecksToRubles = (kopecks: number): number => Math.round(kopecks / 100)

/**
 * Цены с бэка приходят в копейках – переводим в рубли и форматируем.
 * Дробная часть сохраняется (в отличие от kopecksToRubles) – используется
 * там, где цена показывается напрямую, без промежуточной доменной модели.
 */
export const formatRub = (kopecks: number): string => `${(kopecks / 100).toLocaleString("ru-RU")} ₽`

/**
 * Форматирует цену, уже переведённую в рубли в доменной модели (kopecksToRubles).
 * Отдельно от formatRub, чтобы рубли не делились на 100 повторно.
 */
export const formatRubles = (rubles: number): string => `${rubles.toLocaleString("ru-RU")} ₽`
