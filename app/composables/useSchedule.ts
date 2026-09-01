const DAY_SHORT = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"] as const

export type DayShort = (typeof DAY_SHORT)[number]

export interface WeekDay {
    dow: number
    dayShort: string
    isToday: boolean
}

const TIMEZONE = "Asia/Novosibirsk"

// Текущая дата в таймзоне центра (Новосибирск, UTC+7) для исключения SSR hydration mismatch
function getNovosibirskDate(d = new Date()): Date {
    return new Date(d.toLocaleString("en-US", { timeZone: TIMEZONE }))
}

function buildWeekDays(): WeekDay[] {
    const today = getNovosibirskDate()
    const dow = today.getDay()
    const monday = new Date(today)
    monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1))
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday)
        d.setDate(monday.getDate() + i)
        const dayDow = d.getDay()
        return {
            dow: dayDow,
            dayShort: DAY_SHORT[dayDow]!,
            isToday: d.toDateString() === today.toDateString()
        }
    })
}

export function useSchedule() {
    const weekDays = buildWeekDays()

    const todayDow = getNovosibirskDate().getDay()
    const defaultDay = weekDays.find((d) => d.dow === todayDow) ?? weekDays[0]!
    const selectedDay = ref<WeekDay>(defaultDay)

    return {
        weekDays,
        selectedDay
    }
}
