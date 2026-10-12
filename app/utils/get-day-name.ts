const FULL_DAYS: Record<number, string> = {
    0: "Понедельник",
    1: "Вторник",
    2: "Среда",
    3: "Четверг",
    4: "Пятница",
    5: "Суббота",
    6: "Воскресенье"
}

const SHORT_DAYS: Record<number, string> = {
    0: "Пн",
    1: "Вт",
    2: "Ср",
    3: "Чт",
    4: "Пт",
    5: "Сб",
    6: "Вс"
}

const SHORT_TO_INDEX: Record<string, number> = {
    пн: 0,
    вт: 1,
    ср: 2,
    чт: 3,
    пт: 4,
    сб: 5,
    вс: 6
}

// Возвращает короткое или полное название дня недели по индексу (0-6) или краткому обозначению
export const getDayName = (
    mode: "short" | "full" = "short",
    day: number | string | undefined = 0
): string => {
    const index =
        typeof day === "string" ? (SHORT_TO_INDEX[day.trim().toLowerCase()] ?? 0) : (day ?? 0)
    if (mode === "short") {
        return SHORT_DAYS[index] ?? ""
    }
    return FULL_DAYS[index] ?? ""
}

// Удобный алиас для получения полного названия дня недели
export const getFullDayName = (day: number | string | undefined): string => getDayName("full", day)
