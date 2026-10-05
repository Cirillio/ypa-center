import { describe, expect, it } from "vitest"
import { formatAgeRange } from "~/utils/format-age-range"

describe("formatAgeRange", () => {
    // ПОЧЕМУ: диапазон с 2026-09 пишется через дефис («6-13 лет»), число при нём – в именительном
    it.each([
        [6, 13, "6-13 лет"],
        [2, 4, "2-4 года"],
        [3, 21, "3-21 год"]
    ])("formats a range with a hyphen: (%j, %j) → %j", (min, max, expected) => {
        expect(formatAgeRange(min, max)).toBe(expected)
    })

    it.each([
        [5, null, "от 5 лет"],
        [1, null, "от 1 года"],
        [2, null, "от 2 лет"],
        [null, 2, "до 2 лет"],
        [null, 1, "до 1 года"]
    ])("uses the genitive after от/до: (%j, %j) → %j", (min, max, expected) => {
        expect(formatAgeRange(min, max)).toBe(expected)
    })

    it.each([
        [1, "1 год"],
        [4, "4 года"],
        [7, "7 лет"]
    ])("uses the nominative for an exact age: %i → %j", (age, expected) => {
        expect(formatAgeRange(age, age)).toBe(expected)
    })

    it("returns null when the age is unknown", () => {
        expect(formatAgeRange(null, null)).toBeNull()
    })
})
