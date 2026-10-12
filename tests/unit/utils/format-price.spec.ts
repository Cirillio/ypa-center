import { describe, expect, it } from "vitest"
import { formatRub, formatRubles, kopecksToRubles } from "~/utils/format-price"

// toLocaleString("ru-RU") группирует разряды неразрывным пробелом
const NBSP = "\u00a0"

describe("kopecksToRubles", () => {
    it.each([
        [0, 0],
        [100, 1],
        [120_000, 1_200],
        [700_000, 7_000]
    ])("converts %i kopecks to %i rubles", (kopecks, rubles) => {
        expect(kopecksToRubles(kopecks)).toBe(rubles)
    })

    // Фиксирует текущее поведение: Math.round, а не отбрасывание копеек,
    // хотя комментарий в исходнике говорит «округление вниз» (вопрос в трекере).
    it.each([
        [149, 1],
        [150, 2],
        [150_050, 1_501]
    ])("rounds half up: %i kopecks → %i rubles", (kopecks, rubles) => {
        expect(kopecksToRubles(kopecks)).toBe(rubles)
    })
})

describe("formatRub (input in kopecks)", () => {
    it.each([
        [0, "0 ₽"],
        [99, "0,99 ₽"],
        [100, "1 ₽"],
        [150_000, `1${NBSP}500 ₽`],
        [150_050, `1${NBSP}500,5 ₽`],
        [100_000_000, `1${NBSP}000${NBSP}000 ₽`]
    ])("formats %i kopecks as %j", (kopecks, expected) => {
        expect(formatRub(kopecks)).toBe(expected)
    })
})

describe("formatRubles (input in rubles)", () => {
    it.each([
        [0, "0 ₽"],
        [1_200, `1${NBSP}200 ₽`],
        [1_000_000, `1${NBSP}000${NBSP}000 ₽`]
    ])("formats %i rubles as %j", (rubles, expected) => {
        expect(formatRubles(rubles)).toBe(expected)
    })

    it("differs from formatRub by a factor of 100 for the same number (the 2026-09-24 bug)", () => {
        expect(formatRubles(1_200)).toBe(`1${NBSP}200 ₽`)
        expect(formatRub(1_200)).toBe("12 ₽")
    })

    it("round-trips with kopecksToRubles for whole-ruble prices", () => {
        expect(formatRubles(kopecksToRubles(120_000))).toBe(formatRub(120_000))
    })
})
