import { describe, expect, it } from "vitest"
import type { CheckoutResultKind } from "~/types"
import { parseCheckoutResultKind } from "~/utils/checkout-result-kind"

describe("parseCheckoutResultKind", () => {
    it.each<[Parameters<typeof parseCheckoutResultKind>[0], CheckoutResultKind]>([
        ["event", "event"],
        [["event", "x"], "event"],
        [undefined, "purchase"],
        [null, "purchase"],
        ["", "purchase"],
        ["EVENT", "purchase"],
        ["subscription", "purchase"],
        [["trial"], "purchase"]
    ])("%j → %s", (raw, expected) => {
        expect(parseCheckoutResultKind(raw)).toBe(expected)
    })
})
