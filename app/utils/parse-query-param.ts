import type { LocationQueryValue } from "vue-router"

// Извлекает одиночное строковое значение параметра из query маршрута.
export function parseQueryParam(
    value: LocationQueryValue | LocationQueryValue[] | undefined
): string | undefined {
    if (Array.isArray(value)) return value.find((v): v is string => v !== null) ?? undefined
    return value ?? undefined
}
