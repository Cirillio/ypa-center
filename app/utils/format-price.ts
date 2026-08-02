/**
 * Цены с бэка приходят в копейках — переводим в рубли и форматируем.
 */
export const formatRub = (kopecks: number): string => `${(kopecks / 100).toLocaleString("ru-RU")} ₽`
