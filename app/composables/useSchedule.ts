import type { ScheduleWeekDay } from "~/types"

const DAY_SHORT = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"] as const

export type DayShort = (typeof DAY_SHORT)[number]
export type WeekDay = ScheduleWeekDay

const TIMEZONE = "Asia/Novosibirsk"
// Максимальный горизонт просмотра расписания вперёд (текущая + 3 недели = 4 недели).
const MAX_WEEK_OFFSET = 3

// Возвращает дату в часовом поясе центра (Новосибирск) для исключения SSR hydration mismatch.
function getNovosibirskDate(d = new Date()): Date {
    return new Date(d.toLocaleString("en-US", { timeZone: TIMEZONE }))
}

// Вычисляет понедельник недели со смещением weekOffset относительно текущей недели центра.
function getMondayByOffset(weekOffset: number): Date {
    const today = getNovosibirskDate()
    const dow = today.getDay()
    const monday = new Date(today)
    monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1) + weekOffset * 7)
    monday.setHours(0, 0, 0, 0)
    return monday
}

// Форматирует дату в строку YYYY-MM-DD для query-параметра week_start API расписания.
function formatIsoDate(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

// Форматирует диапазон дат недели («12–18 октября» или «28 сентября – 4 октября») для переключателя.
function formatWeekRangeLabel(monday: Date): string {
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)

    const dayOnlyFormatter = new Intl.DateTimeFormat("ru-RU", { day: "numeric" })
    const dayMonthFormatter = new Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "long"
    })

    if (monday.getMonth() === sunday.getMonth()) {
        return `${dayOnlyFormatter.format(monday)}–${dayMonthFormatter.format(sunday)}`
    }
    return `${dayMonthFormatter.format(monday)} – ${dayMonthFormatter.format(sunday)}`
}

// Строит список из 7 дней недели от переданного понедельника; isToday проверяется относительно сегодняшнего дня в Новосибирске.
function buildWeekDays(monday: Date): WeekDay[] {
    const today = getNovosibirskDate()
    const todayDateString = today.toDateString()

    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday)
        d.setDate(monday.getDate() + i)
        const dayDow = d.getDay()
        return {
            dow: dayDow,
            dayShort: DAY_SHORT[dayDow]!,
            isToday: d.toDateString() === todayDateString
        }
    })
}

// Управляет днями недели, смещением недели и выбранным днём для расписания.
export function useSchedule() {
    const weekOffset = ref(0)

    const currentMonday = computed(() => getMondayByOffset(weekOffset.value))
    const weekStart = computed(() => formatIsoDate(currentMonday.value))
    const weekRangeLabel = computed(() => formatWeekRangeLabel(currentMonday.value))

    const canPrevWeek = computed(() => weekOffset.value > 0)
    const canNextWeek = computed(() => weekOffset.value < MAX_WEEK_OFFSET)

    // Переключает на предыдущую неделю, если не достигнута текущая.
    function prevWeek() {
        if (canPrevWeek.value) {
            weekOffset.value -= 1
        }
    }

    // Переключает на следующую неделю в пределах горизонта.
    function nextWeek() {
        if (canNextWeek.value) {
            weekOffset.value += 1
        }
    }

    const weekDays = computed(() => buildWeekDays(currentMonday.value))

    const todayDow = getNovosibirskDate().getDay()
    const selectedDow = ref(todayDow)
    const selectedDay = computed<WeekDay>({
        get: () => weekDays.value.find((d) => d.dow === selectedDow.value) ?? weekDays.value[0]!,
        set: (day) => {
            selectedDow.value = day.dow
        }
    })

    return {
        weekDays,
        selectedDay,
        weekOffset,
        weekStart,
        weekRangeLabel,
        canPrevWeek,
        canNextWeek,
        prevWeek,
        nextWeek
    }
}
