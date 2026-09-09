const dayMap: Record<string, number> = {
    пн: 1,
    вт: 2,
    ср: 3,
    чт: 4,
    пт: 5,
    сб: 6,
    вс: 0
}

export function getNextOccurrence(dayName: string, timeStr: string): Date {
    const targetDay = dayMap[dayName.toLowerCase()] ?? 0
    const [hours, minutes] = timeStr.split(":").map(Number)
    const h = hours ?? 0
    const m = minutes ?? 0
    const now = new Date()

    let daysUntil = (targetDay - now.getDay() + 7) % 7

    const activityTime = new Date(now)
    activityTime.setHours(h, m, 0, 0)

    if (daysUntil === 0 && now.getTime() >= activityTime.getTime()) {
        daysUntil = 7
    }

    const result = new Date(now)
    result.setDate(now.getDate() + daysUntil)
    result.setHours(h, m, 0, 0)
    return result
}

export function formatDisplayDate(date: Date): string {
    return date.toLocaleDateString("ru-RU", {
        month: "long",
        day: "numeric"
    })
}
