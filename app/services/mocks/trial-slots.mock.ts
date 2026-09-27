// Мок-генератор доступных календарных слотов пробного занятия на две недели вперёд.
import type { TrialCheckoutSlot } from "~/types"
import { formatEventDate } from "~/utils/format-event-datetime"

const CENTER_TIMEZONE = "Asia/Novosibirsk"

interface MockSlotTemplate {
    offsetDays: number
    startTime: string
    endTime: string
    groupName: string
    maxCapacity: number
    available: number
}

// Шаблоны слотов на ближайшие 14 дней в сетке занятий
const DEFAULT_SLOT_TEMPLATES: MockSlotTemplate[] = [
    {
        offsetDays: 2,
        startTime: "14:00",
        endTime: "15:00",
        groupName: "Мини, 5–7 лет",
        maxCapacity: 6,
        available: 4
    },
    {
        offsetDays: 4,
        startTime: "16:30",
        endTime: "17:30",
        groupName: "Старшая, 8–10 лет",
        maxCapacity: 6,
        available: 2
    },
    {
        offsetDays: 6,
        startTime: "17:00",
        endTime: "18:00",
        groupName: "Мини, 4–6 лет",
        maxCapacity: 6,
        available: 0
    },
    {
        offsetDays: 9,
        startTime: "10:00",
        endTime: "11:00",
        groupName: "Средняя, 7–9 лет",
        maxCapacity: 6,
        available: 5
    },
    {
        offsetDays: 11,
        startTime: "15:00",
        endTime: "16:00",
        groupName: "Мини, 5–7 лет",
        maxCapacity: 6,
        available: 3
    }
]

// Генерирует детерминированные календарные слоты для выбранного кружка на 2 недели вперёд.
export function generateMockTrialSlots(
    activityId: number,
    activityName = "Кружок"
): TrialCheckoutSlot[] {
    const now = new Date()
    const centerDateStr = now.toLocaleDateString("en-US", { timeZone: CENTER_TIMEZONE })
    const baseDate = new Date(centerDateStr)

    const shift = activityId % 3

    return DEFAULT_SLOT_TEMPLATES.map((tmpl, idx) => {
        const targetDate = new Date(baseDate)
        targetDate.setDate(targetDate.getDate() + tmpl.offsetDays + shift)

        const year = targetDate.getFullYear()
        const month = String(targetDate.getMonth() + 1).padStart(2, "0")
        const day = String(targetDate.getDate()).padStart(2, "0")
        const dateIso = `${year}-${month}-${day}`

        const rawDow = targetDate.getDay()
        const dayOfWeek = (rawDow === 0 ? 0 : rawDow) as 0 | 1 | 2 | 3 | 4 | 5 | 6

        const scheduleId = activityId * 100 + idx + 1
        const slotId = scheduleId * 1000 + targetDate.getDate()

        return {
            id: slotId,
            schedule_id: scheduleId,
            date: dateIso,
            dayOfWeek,
            startTime: tmpl.startTime,
            endTime: tmpl.endTime,
            groupName: tmpl.groupName,
            activity: {
                id: activityId,
                name: activityName
            },
            maxCapacity: tmpl.maxCapacity,
            available: tmpl.available,
            displayDate: formatEventDate(dateIso),
            displayTime: `${tmpl.startTime}–${tmpl.endTime}`
        }
    })
}
