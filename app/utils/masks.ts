import type { MaskaDetail } from "maska"

export type MaskaDetailEvent = { detail: MaskaDetail }

// Телефон из маски «+7 (913) 123-45-67» в E.164: бэк ищет дубль брони по точному номеру
export const toE164Phone = (phone: string): string => phone.replace(/[^\d+]/g, "")

/**
 * Извлекает статус завершенности маски из события Maska.
 * @param e - Объект события с деталями Maska.
 * @returns boolean - true, если ввод соответствует маске.
 */
export const isMaskaCompleted = (e: MaskaDetailEvent): boolean => {
    return e.detail.completed
}
