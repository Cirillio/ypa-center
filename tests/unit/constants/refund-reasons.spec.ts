import { describe, expect, it } from "vitest"
import { REFUND_REASONS } from "~/constants/refund-reasons"
import type { CheckoutTransactionReason } from "~/types"

// ПОЧЕМУ Record по типу: новая причина в api.d.ts без строки здесь ломает typecheck,
// а значит и тест – текст для неё не забудут
const EXPLAINED: Record<Exclude<CheckoutTransactionReason, "NOT_FULFILLED">, true> = {
    SEATS_TAKEN: true,
    GROUP_CLOSED: true,
    PAID_AFTER_EXPIRY: true,
    AMOUNT_MISMATCH: true,
    CANCELED_BY_CENTER: true
}

describe("REFUND_REASONS", () => {
    it.each(Object.keys(EXPLAINED))("explains the refund reason %s", (reason) => {
        expect(Object.entries(REFUND_REASONS)).toContainEqual([reason, expect.any(String)])
    })

    it("names the center as the one who canceled an event booking", () => {
        expect(REFUND_REASONS.CANCELED_BY_CENTER).toBe("Центр отменил запись на событие.")
    })

    it("leaves NOT_FULFILLED without a clarification", () => {
        expect(REFUND_REASONS.NOT_FULFILLED).toBeUndefined()
    })
})
