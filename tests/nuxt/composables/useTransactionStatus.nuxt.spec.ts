import { mockNuxtImport } from "@nuxt/test-utils/runtime"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useTransactionStatus } from "~/composables/useTransactionStatus"
import type { CheckoutTransaction } from "~/types"
import { withSetup } from "../fixtures/with-setup"

const mocks = vi.hoisted(() => ({
    getTransactionStatus: vi.fn<(id: string) => Promise<CheckoutTransaction>>(),
    getEventPaymentStatus: vi.fn<(id: string) => Promise<CheckoutTransaction>>()
}))

mockNuxtImport("useBillingService", () => () => ({
    getTransactionStatus: mocks.getTransactionStatus,
    getEventPaymentStatus: mocks.getEventPaymentStatus
}))

const NOW = new Date("2026-10-05T09:00:00Z")

const eventTx = (status: CheckoutTransaction["status"]): CheckoutTransaction => ({
    id: "tx-1",
    type: "EVENT",
    status,
    reason: null,
    amount: 1_600,
    // 15 минут на оплату от «сейчас»
    expiresAt: new Date(NOW.getTime() + 15 * 60_000).toISOString(),
    order: {
        kind: "event",
        eventId: 2,
        title: "Мастер-класс",
        startsAt: "2026-10-29T18:00:00+07:00",
        attendeesCount: 2
    }
})

const notFound = { status: 404, statusCode: 404, data: { status: 404, title: "Not found" } }

beforeEach(() => {
    vi.useFakeTimers({ now: NOW })
    mocks.getTransactionStatus.mockReset()
    mocks.getEventPaymentStatus.mockReset()
})

afterEach(() => {
    vi.useRealTimers()
})

describe("useTransactionStatus: source", () => {
    it("polls the public event endpoint for kind=event", async () => {
        mocks.getEventPaymentStatus.mockResolvedValue(eventTx("SUCCEEDED"))
        const status = await withSetup(() => useTransactionStatus("tx-1", "event"))

        await vi.waitFor(() => expect(status.viewState.value).toBe("success"))
        expect(mocks.getEventPaymentStatus).toHaveBeenCalledWith("tx-1")
        expect(mocks.getTransactionStatus).not.toHaveBeenCalled()
    })

    it("keeps the purchase endpoint by default", async () => {
        mocks.getTransactionStatus.mockResolvedValue({ ...eventTx("SUCCEEDED"), type: "TRIAL" })
        const status = await withSetup(() => useTransactionStatus("tx-1"))

        await vi.waitFor(() => expect(status.viewState.value).toBe("success"))
        expect(mocks.getEventPaymentStatus).not.toHaveBeenCalled()
    })
})

describe("useTransactionStatus: polling an event payment", () => {
    it("polls every 2 s while PENDING and stops on the final status", async () => {
        mocks.getEventPaymentStatus
            .mockResolvedValueOnce(eventTx("PENDING"))
            .mockResolvedValueOnce(eventTx("PENDING"))
            .mockResolvedValue(eventTx("CANCELED"))
        const status = await withSetup(() => useTransactionStatus("tx-1", "event"))

        await vi.advanceTimersByTimeAsync(2_000)
        await vi.advanceTimersByTimeAsync(2_000)
        expect(status.viewState.value).toBe("canceled")

        await vi.advanceTimersByTimeAsync(10_000)
        expect(mocks.getEventPaymentStatus).toHaveBeenCalledTimes(3)
    })

    it("shows the refund", async () => {
        mocks.getEventPaymentStatus.mockResolvedValue(eventTx("REFUND"))
        const status = await withSetup(() => useTransactionStatus("tx-1", "event"))
        await vi.waitFor(() => expect(status.viewState.value).toBe("refund"))
    })

    it("stops on 404 with an error", async () => {
        mocks.getEventPaymentStatus.mockRejectedValue(notFound)
        const status = await withSetup(() => useTransactionStatus("tx-1", "event"))

        await vi.waitFor(() => expect(status.viewState.value).toBe("error"))
        await vi.advanceTimersByTimeAsync(10_000)
        expect(mocks.getEventPaymentStatus).toHaveBeenCalledOnce()
    })

    it("gives up after expires_at + 5 minutes", async () => {
        mocks.getEventPaymentStatus.mockResolvedValue(eventTx("PENDING"))
        const status = await withSetup(() => useTransactionStatus("tx-1", "event"))

        await vi.advanceTimersByTimeAsync(19 * 60_000)
        expect(status.viewState.value).toBe("pending")
        await vi.advanceTimersByTimeAsync(2 * 60_000)
        expect(status.viewState.value).toBe("timeout")
    })
})
