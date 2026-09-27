import type { SubscriptionSlotConflict, WeeklySlot } from "~/types"

// Переводит время формата HH:MM в минуты от начала суток для сравнения интервалов.
function timeToMinutes(time: string): number {
    const [hours = 0, minutes = 0] = time.split(":").map(Number)
    return hours * 60 + minutes
}

// Приводит JS-индекс дня недели (0=Вс..6=Сб) к порядку недели с понедельника (0=Пн..6=Вс).
function toIsoDayOrder(dayOfWeek: number): number {
    return (dayOfWeek + 6) % 7
}

// Находит пары выбранных слотов в один день недели, чьи временные интервалы пересекаются.
export function findSlotConflicts(slots: WeeklySlot[]): SubscriptionSlotConflict[] {
    const sorted = [...slots].sort(
        (a, b) =>
            toIsoDayOrder(a.dayOfWeek) - toIsoDayOrder(b.dayOfWeek) ||
            timeToMinutes(a.startTime) - timeToMinutes(b.startTime) ||
            a.id - b.id
    )

    const conflicts: SubscriptionSlotConflict[] = []

    for (let i = 0; i < sorted.length; i++) {
        const first = sorted[i]
        if (!first) continue

        for (let j = i + 1; j < sorted.length; j++) {
            const second = sorted[j]
            if (!second) continue

            if (
                first.dayOfWeek === second.dayOfWeek &&
                timeToMinutes(first.startTime) < timeToMinutes(second.endTime) &&
                timeToMinutes(second.startTime) < timeToMinutes(first.endTime)
            ) {
                conflicts.push({ first, second })
            }
        }
    }

    return conflicts
}
