const FULL_DAYS: Record<string, string> = {
    пн: "Понедельник",
    вт: "Вторник",
    ср: "Среда",
    чт: "Четверг",
    пт: "Пятница",
    сб: "Суббота",
    вс: "Воскресенье"
}

export const getFullDayName = (day: string) => {
    const dayFormatted = day.trim().toLocaleLowerCase()
    return FULL_DAYS[dayFormatted] || dayFormatted
}
