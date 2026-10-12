import { describe, expect, it } from "vitest"
import type { TrialUsage } from "~/types"
import { hasUsedTrial } from "~/utils/has-used-trial"

const USAGES: TrialUsage[] = [
    { studentId: 11, activityId: 1 },
    { studentId: 12, activityId: 2 }
]

describe("hasUsedTrial", () => {
    it.each<[string, TrialUsage[], number | null, number | undefined, boolean]>([
        ["same child, same club", USAGES, 11, 1, true],
        ["same club, another child", USAGES, 12, 1, false],
        ["same child, another club", USAGES, 11, 2, false],
        ["no bookings", [], 11, 1, false],
        ["no child chosen", USAGES, null, 1, false],
        ["no club chosen", USAGES, 11, undefined, false]
    ])("%s", (_label, usages, studentId, activityId, expected) => {
        expect(hasUsedTrial(usages, studentId, activityId)).toBe(expected)
    })
})
