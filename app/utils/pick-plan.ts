import type { PlanTier } from "~/types"

// Потолок корзины абонемента на бэке (checkout-flow.md §2)
export const MAX_SUBSCRIPTION_SLOTS = 10

// Тариф под число слотов по правилу бэка: обычный – ровно slotsCount, безлимит – slotsCount и больше.
export function pickPlan(tiers: readonly PlanTier[], slotsCount: number): PlanTier | null {
    if (slotsCount < 1 || slotsCount > MAX_SUBSCRIPTION_SLOTS) return null
    const exact = tiers.find((tier) => tier.lessons !== null && tier.slotsCount === slotsCount)
    if (exact) return exact
    return tiers.find((tier) => tier.lessons === null && slotsCount >= tier.slotsCount) ?? null
}
