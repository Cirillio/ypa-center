import { describe, expect, it } from "vitest"
import { getCapacityTextColor } from "~/utils/get-capacity-text-color"
import { getDayName, getFullDayName } from "~/utils/get-day-name"
import { isMaskaCompleted } from "~/utils/masks"
import { parseQueryParam } from "~/utils/parse-query-param"
import { pluralize } from "~/utils/pluralize"
import { getActivityTheme } from "~/utils/theme"

describe("pluralize", () => {
    it.each([
        [0, "лет"],
        [1, "год"],
        [2, "года"],
        [4, "года"],
        [5, "лет"],
        [11, "лет"],
        [12, "лет"],
        [14, "лет"],
        [19, "лет"],
        [21, "год"],
        [22, "года"],
        [25, "лет"],
        [101, "год"],
        [111, "лет"],
        [112, "лет"]
    ])("%i → %s", (count, expected) => {
        expect(pluralize(count)).toBe(expected)
    })

    it("uses custom word forms", () => {
        const seats: [string, string, string] = ["место", "места", "мест"]
        expect([1, 3, 7].map((n) => pluralize(n, seats))).toEqual(["место", "места", "мест"])
    })
})

describe("getDayName (backend ISO numbering, 0 = Monday)", () => {
    it.each([
        [0, "Пн", "Понедельник"],
        [3, "Чт", "Четверг"],
        [6, "Вс", "Воскресенье"]
    ])("index %i → %s / %s", (index, short, full) => {
        expect(getDayName("short", index)).toBe(short)
        expect(getFullDayName(index)).toBe(full)
    })

    it("accepts short names case- and space-insensitively", () => {
        expect(getDayName("full", " ВС ")).toBe("Воскресенье")
        expect(getDayName("short", "ср")).toBe("Ср")
    })

    it("defaults to Monday for unknown strings and undefined", () => {
        expect(getDayName("short", "xx")).toBe("Пн")
        expect(getDayName("short", undefined)).toBe("Пн")
    })

    it("returns an empty string for an out-of-range index", () => {
        expect(getDayName("short", 7)).toBe("")
        expect(getDayName("full", -1)).toBe("")
    })
})

describe("getCapacityTextColor", () => {
    it.each([
        [0, "text-muted"],
        [1, "text-amber-500"],
        [3, "text-amber-500"],
        [4, "text-emerald-600"]
    ])("%i seats → %s", (capacity, expected) => {
        expect(getCapacityTextColor(capacity)).toBe(expected)
    })
})

describe("parseQueryParam", () => {
    it.each([
        ["a string", "3", "3"],
        ["null", null, undefined],
        ["undefined", undefined, undefined],
        ["an array", ["5", "6"], "5"],
        ["an array starting with null", [null, "6"], "6"],
        ["an array of nulls", [null], undefined]
    ])("handles %s", (_label, value, expected) => {
        expect(parseQueryParam(value)).toBe(expected)
    })
})

describe("isMaskaCompleted", () => {
    it("reads the completed flag of a maska event", () => {
        expect(
            isMaskaCompleted({ detail: { masked: "+7", unmasked: "7", completed: false } })
        ).toBe(false)
        expect(
            isMaskaCompleted({
                detail: { masked: "+7 (913) 000-00-00", unmasked: "79130000000", completed: true }
            })
        ).toBe(true)
    })
})

describe("getActivityTheme", () => {
    it("is stable for the same activity", () => {
        expect(getActivityTheme(3)).toEqual(getActivityTheme(3))
    })

    it("cycles through the palette every 10 activities", () => {
        expect(getActivityTheme(11)).toEqual(getActivityTheme(1))
        expect(getActivityTheme(1)).not.toEqual(getActivityTheme(2))
    })

    it("returns a full theme for every id from 1 to 20", () => {
        for (let id = 1; id <= 20; id++) {
            expect(getActivityTheme(id)).toEqual(
                expect.objectContaining({
                    bg: expect.any(String),
                    ring: expect.any(String),
                    title: expect.any(String),
                    fullBg: expect.any(String)
                })
            )
        }
    })
})
