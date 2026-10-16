import { describe, expect, it } from "vitest"
import { getGreeting } from "~/utils/get-greeting"

// Новосибирск = UTC+7: час центра = час UTC + 7
const atNovosibirskHour = (hour: number) =>
    new Date(Date.UTC(2026, 9, 16, (hour - 7 + 24) % 24, 30))

describe("getGreeting", () => {
    it.each([
        [5, "Доброе утро"],
        [11, "Доброе утро"],
        [12, "Добрый день"],
        [17, "Добрый день"],
        [18, "Добрый вечер"],
        [22, "Добрый вечер"],
        [23, "Доброй ночи"],
        [0, "Доброй ночи"],
        [4, "Доброй ночи"]
    ])("in %i:30 Novosibirsk time says «%s»", (hour, expected) => {
        expect(getGreeting(atNovosibirskHour(hour))).toBe(expected)
    })

    it("uses the centre timezone, not UTC", () => {
        // 02:00 UTC – ночь по UTC, но 09:00 в Новосибирске
        expect(getGreeting(new Date("2026-10-16T02:00:00Z"))).toBe("Доброе утро")
    })
})
