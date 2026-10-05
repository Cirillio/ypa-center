import { mockNuxtImport } from "@nuxt/test-utils/runtime"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useCheckoutPayment } from "~/composables/useCheckoutPayment"
import type { CheckoutResponse, CheckoutSubscriptionRequest } from "~/types"
import { withSetup } from "../fixtures/with-setup"

const mocks = vi.hoisted(() => ({
    checkoutSubscription: vi.fn<(p: unknown, key: string) => Promise<CheckoutResponse>>()
}))

mockNuxtImport("useBillingService", () => () => ({
    checkoutSubscription: mocks.checkoutSubscription
}))
mockNuxtImport("useAuthStore", () => () => ({ isAuthed: true }))

// Ошибка ofetch: тело RFC 9457 в data, заголовки ответа в response
const problem = (status: number, code: string, invalidParams: string[] = []) => ({
    status,
    statusCode: status,
    data: {
        type: `urn:problem-type:${code.toLowerCase()}`,
        title: code,
        status,
        detail: "",
        code,
        extensions: { invalid_params: invalidParams.map((name) => ({ name, reason: "bad" })) }
    },
    response: { headers: new Headers() }
})

const ORDER: CheckoutSubscriptionRequest = {
    plan_id: 3,
    student_id: 7,
    slot_ids: [101, 102, 103],
    use_deposit: false
}

beforeEach(() => {
    mocks.checkoutSubscription.mockReset()
})

describe("useCheckoutPayment: subscription errors", () => {
    it("reloads the plans on 409 PLAN_UNAVAILABLE", async () => {
        const onPlansStale = vi.fn()
        mocks.checkoutSubscription.mockRejectedValue(problem(409, "PLAN_UNAVAILABLE"))
        const payment = await withSetup(() => useCheckoutPayment({ onPlansStale }))

        await payment.submitSubscription(ORDER)

        expect(payment.error.value?.code).toBe("PLAN_UNAVAILABLE")
        expect(payment.error.value?.title).toBe("Тариф изменился")
        expect(onPlansStale).toHaveBeenCalledOnce()
    })

    it("explains a slot count that does not fit the plan (422 slot_ids)", async () => {
        mocks.checkoutSubscription.mockRejectedValue(problem(422, "VALIDATION_ERROR", ["slot_ids"]))
        const payment = await withSetup(() => useCheckoutPayment())

        await payment.submitSubscription(ORDER)

        expect(payment.error.value?.code).toBe("VALIDATION_ERROR")
        expect(payment.error.value?.title).toBe("Число кружков не подходит тарифу")
    })

    it("explains 409 STUDENT_ALREADY_ENROLLED", async () => {
        mocks.checkoutSubscription.mockRejectedValue(problem(409, "STUDENT_ALREADY_ENROLLED"))
        const payment = await withSetup(() => useCheckoutPayment())

        await payment.submitSubscription(ORDER)

        expect(payment.error.value?.title).toBe("Ребёнок уже записан")
    })
})
