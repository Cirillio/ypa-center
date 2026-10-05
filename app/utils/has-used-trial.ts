import type { TrialUsage } from "~/types"

// Было ли у ребёнка пробное по этому кружку: бэк разрешает одно на пару «ребёнок – кружок».
export function hasUsedTrial(
    usages: readonly TrialUsage[],
    studentId: number | null,
    activityId: number | undefined
): boolean {
    if (studentId === null || activityId === undefined) return false
    return usages.some((u) => u.studentId === studentId && u.activityId === activityId)
}
