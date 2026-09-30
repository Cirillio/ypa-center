// Id ребёнка в модели – строка, бэк чекаута ждёт число; мусор не отправляем.
export function toStudentId(id: string | undefined): number | null {
    return id !== undefined && /^\d+$/.test(id) ? Number(id) : null
}
