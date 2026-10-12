import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime"
import type { DOMWrapper } from "@vue/test-utils"
import { beforeEach, describe, expect, it, vi } from "vitest"
import ResultWidget from "~/components/checkout/ResultWidget.vue"
import type { CheckoutTransaction } from "~/types"
import { formatEventDateTime } from "~/utils/format-event-datetime"

const mocks = vi.hoisted(() => ({
    getEventPaymentStatus: vi.fn<(id: string) => Promise<CheckoutTransaction>>()
}))

mockNuxtImport("useBillingService", () => () => ({
    getTransactionStatus: vi.fn(),
    getEventPaymentStatus: mocks.getEventPaymentStatus
}))

const STARTS_AT = "2026-10-29T18:00:00+07:00"

const eventTx = (
    status: CheckoutTransaction["status"],
    reason: CheckoutTransaction["reason"] = null
): CheckoutTransaction => ({
    id: "a1b2c3d4-e5f6-4890-9234-56789abcdef0",
    type: "EVENT",
    status,
    reason,
    amount: 1_600,
    expiresAt: "2099-01-01T00:00:00Z",
    order: {
        kind: "event",
        eventId: 2,
        title: "Мастер-класс по мышлению",
        startsAt: STARTS_AT,
        attendeesCount: 2
    }
})

async function mountResult(tx: CheckoutTransaction) {
    mocks.getEventPaymentStatus.mockResolvedValue(tx)
    const wrapper = await mountSuspended(ResultWidget, { props: { txId: tx.id, kind: "event" } })
    await vi.waitFor(() => expect(wrapper.text()).not.toContain("Подтверждаем оплату"))
    return wrapper
}

const linkTo = (wrapper: Awaited<ReturnType<typeof mountSuspended>>, label: string) =>
    wrapper
        .findAll("a")
        .find((a: DOMWrapper<Element>) => a.text().includes(label))
        ?.attributes("href")

beforeEach(() => {
    mocks.getEventPaymentStatus.mockReset()
})

describe("CheckoutResultWidget: event payment", () => {
    it("names the event, its time and the seats on success", async () => {
        const wrapper = await mountResult(eventTx("SUCCEEDED"))
        const text = wrapper.text()

        expect(text).toContain(
            `Вы записаны на «Мастер-класс по мышлению», ${formatEventDateTime(STARTS_AT)}, мест: 2`
        )
        // ПОЧЕМУ \u00a0: ru-RU разделяет разряды неразрывным пробелом
        expect(text).toContain("1\u00a0600 ₽")
        expect(text).not.toContain("личном кабинете")
        expect(linkTo(wrapper, "К афише")).toBe("/enroll/event")
    })

    it("offers to try the same event again after a cancel", async () => {
        const wrapper = await mountResult(eventTx("CANCELED"))

        expect(linkTo(wrapper, "Попробовать снова")).toBe("/enroll/event?eventId=2")
        expect(linkTo(wrapper, "К афише")).toBe("/enroll/event")
        expect(wrapper.text()).not.toContain("Выбрать другую группу")
    })

    it("explains a refund after the center canceled the booking", async () => {
        const wrapper = await mountResult(eventTx("REFUND", "CANCELED_BY_CENTER"))

        expect(wrapper.text()).toContain("Центр отменил запись на событие.")
        expect(wrapper.text()).not.toContain("Выбрать другую группу")
        expect(linkTo(wrapper, "К афише")).toBe("/enroll/event")
    })

    it("does not send a guest to the cabinet when the payment is unknown", async () => {
        mocks.getEventPaymentStatus.mockRejectedValue({
            status: 404,
            statusCode: 404,
            data: { status: 404, title: "Not found" }
        })
        const wrapper = await mountSuspended(ResultWidget, {
            props: { txId: "missing", kind: "event" }
        })
        await vi.waitFor(() => expect(wrapper.text()).toContain("Заказ не найден"))

        expect(linkTo(wrapper, "В личный кабинет")).toBeUndefined()
        expect(linkTo(wrapper, "К афише")).toBe("/enroll/event")
    })
})
