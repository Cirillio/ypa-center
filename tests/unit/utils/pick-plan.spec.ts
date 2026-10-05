import { describe, expect, it } from "vitest"
import type { PlanTier } from "~/types"
import { pickPlan } from "~/utils/pick-plan"

const limited = (slotsCount: number): PlanTier => ({
    id: slotsCount,
    slotsCount,
    lessons: slotsCount * 4,
    price: slotsCount * 1_000,
    label: null,
    highlight: false
})

// У безлимита slotsCount – минимум слотов, с которого он продаётся
const unlimited = (slotsCount: number): PlanTier => ({
    id: 99,
    slotsCount,
    lessons: null,
    price: 16_000,
    label: "Безлимит",
    highlight: true
})

const FULL = [1, 2, 3, 4, 5].map(limited).concat(unlimited(6))
const WITH_GAP = [1, 2, 4].map(limited).concat(unlimited(6))
const NO_UNLIMITED = [1, 2, 3, 4, 5].map(limited)

describe("pickPlan", () => {
    it.each([
        ["1–5 + unlimited from 6", FULL, 3, 3],
        ["1–5 + unlimited from 6", FULL, 5, 5],
        ["1–5 + unlimited from 6", FULL, 6, 99],
        ["1–5 + unlimited from 6", FULL, 7, 99],
        ["1–5 + unlimited from 6", FULL, 10, 99],
        ["1, 2, 4 + unlimited from 6", WITH_GAP, 4, 4],
        ["1, 2, 4 + unlimited from 6", WITH_GAP, 6, 99]
    ])("%s: %i slots → plan %i", (_label, tiers, slots, expectedId) => {
        expect(pickPlan(tiers, slots)?.id).toBe(expectedId)
    })

    // ПОЧЕМУ: бэк принимает обычный тариф только при точном совпадении числа слотов
    it.each([
        ["nothing selected", FULL, 0],
        ["above the cart limit of 10", FULL, 11],
        ["a gap in the lineup is not filled by a larger plan", WITH_GAP, 3],
        ["a gap right below the unlimited", WITH_GAP, 5],
        ["no unlimited plan", NO_UNLIMITED, 6],
        ["no plans at all", [], 1]
    ])("returns null: %s", (_label, tiers, slots) => {
        expect(pickPlan(tiers, slots)).toBeNull()
    })

    it("prefers an exact limited plan over the unlimited one", () => {
        expect(pickPlan([limited(6), unlimited(6)], 6)?.id).toBe(6)
    })
})
