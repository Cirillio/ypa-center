import { describe, expect, it } from "vitest"
import { EventsService } from "~/services/events.service"
import type { CheckoutResponse, EventRegistrationRequest } from "~/types"
import { createFailingFetch, createFakeFetch } from "../fixtures/fake-api-fetch"

const BODY: EventRegistrationRequest = {
    child_name: "Маша",
    parent_name: "Анна",
    phone: "+79131234567",
    email: "anna@example.com",
    attendees_count: 2,
    pd_consent: true,
    website_url: ""
}

const PAYMENT: CheckoutResponse = {
    transaction_id: "a1b2c3d4-e5f6-4890-9234-56789abcdef0",
    status: "PENDING_PAYMENT",
    payment_url: "https://yoomoney.ru/checkout/payments/v2/contract?orderId=1",
    expires_at: "2026-10-05T16:15:00+07:00"
}

describe("EventsService.register", () => {
    it("books a free event without an idempotency key", async () => {
        const { fetch, calls } = createFakeFetch(() => ({ status: "accepted" }))

        const outcome = await new EventsService(fetch).register(5, BODY)

        expect(outcome).toEqual({ kind: "accepted" })
        expect(calls).toEqual([
            { path: "/v1/public/events/5/register/", opts: { method: "POST", body: BODY } }
        ])
    })

    it("sends the idempotency key for a paid event and maps the payment", async () => {
        const { fetch, calls } = createFakeFetch(() => PAYMENT)

        const outcome = await new EventsService(fetch).register(5, BODY, "key-1")

        expect(calls[0]?.opts).toEqual({
            method: "POST",
            body: BODY,
            headers: { "X-Idempotency-Key": "key-1" }
        })
        expect(outcome).toEqual({
            kind: "payment",
            transactionId: PAYMENT.transaction_id,
            paymentUrl: PAYMENT.payment_url,
            expiresAt: PAYMENT.expires_at
        })
    })

    it("passes errors through", async () => {
        const error = new Error("down")
        await expect(
            new EventsService(createFailingFetch(error)).register(5, BODY, "key-1")
        ).rejects.toBe(error)
    })
})
