import { describe, expect, it } from "vitest"
import type { WeeklySlot } from "~/types"
import { findSlotConflicts } from "~/utils/find-slot-conflicts"

// Слот с разумными значениями по умолчанию; в тесте важны только день и время
const slot = (
    id: number,
    dayOfWeek: WeeklySlot["dayOfWeek"],
    startTime: string,
    endTime: string
): WeeklySlot => ({
    id,
    activity: { id: 1, name: "Кружок" },
    dayOfWeek,
    startTime,
    endTime,
    groupName: "Группа",
    maxCapacity: 8,
    available: 4
})

const pairIds = (slots: WeeklySlot[]) =>
    findSlotConflicts(slots).map(({ first, second }) => [first.id, second.id])

describe("findSlotConflicts", () => {
    it("returns nothing for an empty or single selection", () => {
        expect(findSlotConflicts([])).toEqual([])
        expect(findSlotConflicts([slot(1, 1, "10:00", "11:00")])).toEqual([])
    })

    it("detects overlap on the same day", () => {
        expect(pairIds([slot(1, 1, "10:00", "11:00"), slot(2, 1, "10:30", "11:30")])).toEqual([
            [1, 2]
        ])
    })

    it("detects a slot fully inside another", () => {
        expect(pairIds([slot(1, 3, "09:00", "12:00"), slot(2, 3, "10:00", "10:45")])).toEqual([
            [1, 2]
        ])
    })

    it("does not treat back-to-back slots as a conflict", () => {
        expect(pairIds([slot(1, 1, "10:00", "11:00"), slot(2, 1, "11:00", "12:00")])).toEqual([])
    })

    it("ignores the same time on different days", () => {
        expect(pairIds([slot(1, 1, "10:00", "11:00"), slot(2, 2, "10:00", "11:00")])).toEqual([])
    })

    it("reports every pair among three mutually overlapping slots", () => {
        expect(
            pairIds([
                slot(3, 5, "10:20", "11:20"),
                slot(1, 5, "10:00", "11:00"),
                slot(2, 5, "10:10", "11:10")
            ])
        ).toEqual([
            [1, 2],
            [1, 3],
            [2, 3]
        ])
    })

    it("orders pairs Monday first and Sunday (JS day 0) last", () => {
        expect(
            pairIds([
                slot(10, 0, "10:00", "11:00"),
                slot(11, 0, "10:30", "11:30"),
                slot(20, 1, "10:00", "11:00"),
                slot(21, 1, "10:30", "11:30")
            ])
        ).toEqual([
            [20, 21],
            [10, 11]
        ])
    })

    it("compares times numerically, not as strings", () => {
        expect(pairIds([slot(1, 2, "9:30", "10:30"), slot(2, 2, "10:00", "11:00")])).toEqual([
            [1, 2]
        ])
    })

    it("does not mutate the input array", () => {
        const input = [slot(2, 1, "11:00", "12:00"), slot(1, 1, "10:00", "11:30")]
        findSlotConflicts(input)
        expect(input.map((s) => s.id)).toEqual([2, 1])
    })
})
