import { describe, expect, it } from "vitest"
import { BillingService } from "~/services/billing.service"
import { createFailingFetch, createFakeFetch } from "../fixtures/fake-api-fetch"
import { eventTransactionDto, transactionDto } from "../fixtures/dto/billing"

describe("BillingService.getTransactionStatus", () => {
    it("maps a purchase: kopecks to rubles, order of kind purchase", async () => {
        const { fetch, calls } = createFakeFetch(() => transactionDto())

        const tx = await new BillingService(fetch).getTransactionStatus("tx-1")

        expect(calls[0]?.path).toBe("/v1/checkout/transactions/tx-1")
        expect(tx).toMatchObject({ type: "TRIAL", amount: 1_200, reason: null })
        expect(tx.order).toEqual({
            kind: "purchase",
            title: "Пробное: Шахматы",
            studentName: "Маша",
            trialDate: "2026-10-12",
            slots: [
                {
                    scheduleId: 7,
                    activityName: "Шахматы",
                    groupName: "Младшая",
                    dayOfWeek: 0,
                    startTime: "16:00",
                    endTime: "17:00"
                }
            ]
        })
    })
})

describe("BillingService.getEventPaymentStatus", () => {
    it("asks the public endpoint and maps an event order", async () => {
        const { fetch, calls } = createFakeFetch(() => eventTransactionDto())

        const tx = await new BillingService(fetch).getEventPaymentStatus("a1b2")

        expect(calls[0]?.path).toBe("/v1/public/events/payments/a1b2/")
        expect(tx).toMatchObject({
            id: "a1b2c3d4-e5f6-4890-9234-56789abcdef0",
            type: "EVENT",
            status: "SUCCEEDED",
            amount: 1_600,
            expiresAt: "2026-10-05T16:15:00+07:00"
        })
        expect(tx.order).toEqual({
            kind: "event",
            eventId: 2,
            title: "Мастер-класс по мышлению",
            startsAt: "2026-10-29T18:00:00+07:00",
            attendeesCount: 2
        })
    })

    it("keeps the refund reason only for REFUND", async () => {
        const refund = createFakeFetch(() =>
            eventTransactionDto({ status: "REFUND", reason: "CANCELED_BY_CENTER" })
        )
        const canceled = createFakeFetch(() =>
            eventTransactionDto({ status: "CANCELED", reason: "CANCELED_BY_CENTER" })
        )

        expect((await new BillingService(refund.fetch).getEventPaymentStatus("x")).reason).toBe(
            "CANCELED_BY_CENTER"
        )
        expect(
            (await new BillingService(canceled.fetch).getEventPaymentStatus("x")).reason
        ).toBeNull()
    })

    it("encodes the id and passes errors through", async () => {
        const { fetch, calls } = createFakeFetch(() => eventTransactionDto())
        await new BillingService(fetch).getEventPaymentStatus("a/b")
        expect(calls[0]?.path).toBe("/v1/public/events/payments/a%2Fb/")

        const error = new Error("down")
        await expect(
            new BillingService(createFailingFetch(error)).getEventPaymentStatus("x")
        ).rejects.toBe(error)
    })
})
