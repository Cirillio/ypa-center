import { useDayjs } from "#dayjs"
import type { WeeklySlot } from "~/types"

export const useFormatDate = () => {
    const dayjs = useDayjs()

    const getClosestDate = (dayOfWeek: number, startTime: string) => {
        const now = dayjs()
        const [hours, minutes] = startTime.split(":").map(Number)

        // dayjs: 0 = Вс, 1 = Пн, ..., 6 = Сб
        let target = dayjs()
            .day(dayOfWeek === 7 ? 0 : dayOfWeek)
            .hour(hours!)
            .minute(minutes!)
            .second(0)
            .millisecond(0)

        if (target.isBefore(now)) {
            target = target.add(1, "week")
        }

        return target
    }

    // "ср, 12 мар · 17:00 – 18:00"
    const formatSlotDate = (slot: WeeklySlot): string => {
        const date = getClosestDate(slot.dayOfWeek, slot.startTime)
        return `${date.format("dd, D MMM")} · ${slot.startTime} – ${slot.endTime}`
    }

    return { getClosestDate, formatSlotDate }
}
