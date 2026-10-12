import { describe, expect, it } from "vitest"
import {
    formatEventDate,
    formatEventDateTime,
    formatEventTime
} from "~/utils/format-event-datetime"

// Тесты идут в UTC (vitest.config.ts): форматтер обязан сам переводить в Новосибирск (UTC+7)
describe("formatEventDate / formatEventTime", () => {
    it("renders the time in Novosibirsk, not in the machine timezone", () => {
        expect(formatEventTime("2026-09-29T04:00:00Z")).toBe("11:00")
    })

    it("moves to the next calendar day when UTC evening is past midnight in Novosibirsk", () => {
        const iso = "2026-09-29T20:30:00Z"
        expect(formatEventDate(iso)).toBe("Ср, 30 сентября")
        expect(formatEventTime(iso)).toBe("03:30")
    })

    it("capitalises the weekday", () => {
        expect(formatEventDate("2026-09-29T04:00:00Z")).toMatch(/^Вт, /)
    })

    it("accepts an offset timestamp as sent by the backend", () => {
        expect(formatEventDateTime("2026-10-03T11:00:00+07:00")).toBe("Сб, 3 октября · 11:00")
    })
})
