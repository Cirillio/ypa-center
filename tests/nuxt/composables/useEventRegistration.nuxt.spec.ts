import { mockNuxtImport } from "@nuxt/test-utils/runtime"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useEventRegistration } from "~/composables/useEventRegistration"
import type { EventContacts } from "~/schemas/event-contacts.schema"
import type { EventItem, EventRegistrationOutcome, EventRegistrationRequest } from "~/types"
import { eventDto } from "../fixtures/dto/public"
import { withSetup } from "../fixtures/with-setup"

const mocks = vi.hoisted(() => ({
    register:
        vi.fn<
            (
                id: number,
                body: EventRegistrationRequest,
                key?: string
            ) => Promise<EventRegistrationOutcome>
        >(),
    navigateTo: vi.fn()
}))

mockNuxtImport("useEventsService", () => () => ({ register: mocks.register }))
mockNuxtImport("navigateTo", () => mocks.navigateTo)

const PAID: EventItem = {
    ...eventDto({ id: 5, is_free: false, price: 150_000 }),
    availableSeats: 10
}
const FREE: EventItem = { ...eventDto({ id: 6, is_free: true, price: 0 }), availableSeats: 10 }

const CONTACTS: EventContacts = {
    parentName: "Анна",
    childName: "Маша",
    phone: "+7 (913) 123-45-67",
    email: "anna@example.com",
    consent: true
}

const PAYMENT: EventRegistrationOutcome = {
    kind: "payment",
    transactionId: "a1b2c3d4-e5f6-4890-9234-56789abcdef0",
    paymentUrl: "https://yoomoney.ru/checkout/payments/v2/contract?orderId=1",
    expiresAt: "2026-10-05T16:15:00+07:00"
}

// Ошибка ofetch: тело RFC 9457 в data, Retry-After – в заголовках ответа
function problem(status: number, code: string, field?: string, retryAfter?: number) {
    return {
        status,
        statusCode: status,
        data: {
            type: `urn:problem-type:${code.toLowerCase()}`,
            title: code,
            status,
            detail: "",
            code,
            extensions: {
                request_id: "req-1",
                invalid_params: field ? [{ name: field, reason: "bad" }] : []
            }
        },
        response: {
            headers: new Headers(retryAfter ? { "Retry-After": String(retryAfter) } : {})
        }
    }
}

const keyOfCall = (n: number) => mocks.register.mock.calls[n]?.[2]

beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    mocks.register.mockReset().mockResolvedValue(PAYMENT)
    mocks.navigateTo.mockReset()
})

afterEach(() => {
    vi.useRealTimers()
})

describe("useEventRegistration: outcome", () => {
    it("shows the confirmation for a free event without a key and without redirect", async () => {
        mocks.register.mockResolvedValue({ kind: "accepted" })
        const reg = await withSetup(() => useEventRegistration())

        await reg.submit(FREE, 2, CONTACTS)

        expect(keyOfCall(0)).toBeUndefined()
        expect(mocks.navigateTo).not.toHaveBeenCalled()
        expect(reg.result.value).toMatchObject({ eventTitle: FREE.title, seats: 2 })
    })

    it("sends the paid booking with a key and goes to the payment page", async () => {
        const reg = await withSetup(() => useEventRegistration())

        await reg.submit(PAID, 2, CONTACTS)

        expect(keyOfCall(0)).toMatch(/^[0-9a-f-]{36}$/)
        expect(mocks.register.mock.calls[0]?.[1]).toMatchObject({
            phone: "+79131234567",
            attendees_count: 2
        })
        expect(mocks.navigateTo).toHaveBeenCalledWith(PAYMENT.paymentUrl, { external: true })
        expect(reg.result.value).toBeNull()
    })

    it("opens the result screen when the payment has no external page", async () => {
        mocks.register.mockResolvedValue({ ...PAYMENT, paymentUrl: null })
        const reg = await withSetup(() => useEventRegistration())

        await reg.submit(PAID, 1, CONTACTS)

        expect(mocks.navigateTo).toHaveBeenCalledWith({
            path: "/checkout/result",
            query: { tx: PAYMENT.transactionId, kind: "event" }
        })
    })
})

describe("useEventRegistration: idempotency key", () => {
    it("reuses the key when the same form is retried after a network error", async () => {
        mocks.register.mockRejectedValueOnce(new Error("Network down"))
        const reg = await withSetup(() => useEventRegistration())

        await reg.submit(PAID, 2, CONTACTS)
        await reg.submit(PAID, 2, CONTACTS)

        expect(keyOfCall(1)).toBe(keyOfCall(0))
    })

    it("takes a new key when the form changes", async () => {
        mocks.register.mockRejectedValueOnce(new Error("Network down"))
        const reg = await withSetup(() => useEventRegistration())

        await reg.submit(PAID, 2, CONTACTS)
        await reg.submit(PAID, 3, CONTACTS)

        expect(keyOfCall(1)).not.toBe(keyOfCall(0))
    })

    it("drops the key after 409 IDEMPOTENCY_KEY_REUSED", async () => {
        mocks.register.mockRejectedValueOnce(problem(409, "IDEMPOTENCY_KEY_REUSED"))
        const reg = await withSetup(() => useEventRegistration())

        await reg.submit(PAID, 2, CONTACTS)
        await reg.submit(PAID, 2, CONTACTS)

        expect(keyOfCall(1)).not.toBe(keyOfCall(0))
    })

    it("sends one request on a double click", async () => {
        const reg = await withSetup(() => useEventRegistration())

        await Promise.all([reg.submit(PAID, 2, CONTACTS), reg.submit(PAID, 2, CONTACTS)])

        expect(mocks.register).toHaveBeenCalledOnce()
    })
})

describe("useEventRegistration: errors", () => {
    it.each<[string, ReturnType<typeof problem>, string, boolean]>([
        ["price changed", problem(409, "EVENT_PRICE_CHANGED"), "Цена изменилась", true],
        [
            "phone already booked",
            problem(422, "VALIDATION_ERROR", "phone"),
            "Бронь уже есть",
            false
        ],
        [
            "not enough seats",
            problem(422, "VALIDATION_ERROR", "attendees_count"),
            "Мест меньше, чем нужно",
            true
        ],
        ["event is over", problem(422, "VALIDATION_ERROR", "event"), "Запись закрыта", true],
        ["no email", problem(422, "VALIDATION_ERROR", "email"), "Нужна почта", false],
        ["event removed", problem(404, "NOT_FOUND"), "Событие недоступно", true],
        [
            "payment in progress",
            problem(409, "PAYMENT_IN_PROGRESS"),
            "Платёж уже обрабатывается",
            false
        ],
        [
            "gateway down",
            problem(503, "PAYMENT_GATEWAY_UNAVAILABLE"),
            "Платёжный сервис недоступен",
            false
        ],
        ["too many requests", problem(429, "RATE_LIMITED"), "Слишком много попыток", false]
    ])("%s → its own text and the right listing refresh", async (_label, err, title, stale) => {
        const onEventsStale = vi.fn()
        mocks.register.mockRejectedValue(err)
        const reg = await withSetup(() => useEventRegistration({ onEventsStale }))

        await reg.submit(PAID, 2, CONTACTS)

        expect(reg.error.value?.title).toBe(title)
        expect(reg.error.value?.requestId).toBe("req-1")
        expect(onEventsStale).toHaveBeenCalledTimes(stale ? 1 : 0)
    })

    it.each([
        ["PAYMENT_IN_PROGRESS", 409, 5],
        ["PAYMENT_GATEWAY_UNAVAILABLE", 503, 30],
        ["RATE_LIMITED", 429, 60]
    ])("waits Retry-After on %s and keeps the key", async (code, status, seconds) => {
        mocks.register.mockRejectedValueOnce(problem(status, code, undefined, seconds))
        const reg = await withSetup(() => useEventRegistration())

        await reg.submit(PAID, 2, CONTACTS)
        expect(reg.cooldownSeconds.value).toBe(seconds)

        await vi.advanceTimersByTimeAsync(seconds * 1000)
        await reg.submit(PAID, 2, CONTACTS)
        expect(keyOfCall(1)).toBe(keyOfCall(0))
    })
})
