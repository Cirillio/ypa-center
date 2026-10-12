import { afterEach, describe, expect, it, vi } from "vitest"
import { useSchedule } from "~/composables/useSchedule"

afterEach(() => {
    vi.useRealTimers()
})

// Тесты идут в UTC; «сегодня» обязано считаться по Новосибирску (UTC+7)
describe("useSchedule", () => {
    it("treats Sunday 20:00 UTC as Monday in Novosibirsk", () => {
        vi.useFakeTimers({ now: new Date("2026-09-27T20:00:00Z"), toFake: ["Date"] })
        const schedule = useSchedule()

        expect(schedule.weekStart.value).toBe("2026-09-28")
        expect(schedule.selectedDay.value).toMatchObject({ dow: 1, dayShort: "Пн", isToday: true })
    })

    it("stays on the current week late on Sunday in Novosibirsk", () => {
        vi.useFakeTimers({ now: new Date("2026-10-04T16:00:00Z"), toFake: ["Date"] })
        const schedule = useSchedule()

        expect(schedule.weekStart.value).toBe("2026-09-28")
        expect(schedule.selectedDay.value.dayShort).toBe("Вс")
    })

    it("builds the week Monday to Sunday", () => {
        vi.useFakeTimers({ now: new Date("2026-09-30T05:00:00Z"), toFake: ["Date"] })
        const { weekDays } = useSchedule()

        expect(weekDays.value.map((d) => d.dayShort)).toEqual([
            "Пн",
            "Вт",
            "Ср",
            "Чт",
            "Пт",
            "Сб",
            "Вс"
        ])
        expect(weekDays.value.filter((d) => d.isToday).map((d) => d.dayShort)).toEqual(["Ср"])
    })

    it("pages forward up to three weeks and never into the past", () => {
        vi.useFakeTimers({ now: new Date("2026-09-30T05:00:00Z"), toFake: ["Date"] })
        const schedule = useSchedule()

        schedule.prevWeek()
        expect(schedule.weekOffset.value).toBe(0)
        expect(schedule.canPrevWeek.value).toBe(false)

        schedule.nextWeek()
        schedule.nextWeek()
        schedule.nextWeek()
        schedule.nextWeek()
        expect(schedule.weekOffset.value).toBe(3)
        expect(schedule.canNextWeek.value).toBe(false)
        expect(schedule.weekStart.value).toBe("2026-10-19")
    })

    it("labels a week inside one month and across months", () => {
        vi.useFakeTimers({ now: new Date("2026-10-14T05:00:00Z"), toFake: ["Date"] })
        expect(useSchedule().weekRangeLabel.value).toBe("12–18 октября")

        vi.setSystemTime(new Date("2026-09-30T05:00:00Z"))
        expect(useSchedule().weekRangeLabel.value).toBe("28 сентября – 4 октября")
    })
})
