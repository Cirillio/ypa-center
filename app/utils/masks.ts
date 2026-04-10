import type { MaskaDetail } from "maska"

export type MaskaDetailEvent = { detail: MaskaDetail }

/**
 * Извлекает статус завершенности маски из события Maska.
 * @param e - Объект события с деталями Maska.
 * @returns boolean - true, если ввод соответствует маске.
 */
export const isMaskaCompleted = (e: MaskaDetailEvent): boolean => {
    return e.detail.completed
}
