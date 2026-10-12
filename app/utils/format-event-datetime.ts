const EVENT_TIMEZONE = "Asia/Novosibirsk"

// Форматирует дату события в часовом поясе центра с заглавной буквы («Вт, 29 сентября»).
export function formatEventDate(dateStr: string): string {
    const formatted = new Intl.DateTimeFormat("ru-RU", {
        weekday: "short",
        day: "numeric",
        month: "long",
        timeZone: EVENT_TIMEZONE
    }).format(new Date(dateStr))

    return formatted ? formatted.charAt(0).toUpperCase() + formatted.slice(1) : formatted
}

// Форматирует время начала события в часовом поясе центра («11:00»).
export function formatEventTime(dateStr: string): string {
    return new Intl.DateTimeFormat("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: EVENT_TIMEZONE
    }).format(new Date(dateStr))
}

// Возвращает склеенную строку даты и времени события («Вт, 29 сентября · 11:00»).
export function formatEventDateTime(dateStr: string): string {
    return `${formatEventDate(dateStr)} · ${formatEventTime(dateStr)}`
}
