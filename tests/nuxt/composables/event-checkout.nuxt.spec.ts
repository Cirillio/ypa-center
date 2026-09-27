import { mockNuxtImport } from "@nuxt/test-utils/runtime"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useEventCheckout } from "~/composables/useEventCheckout"
import type { EventItem } from "~/types"
import { eventDto } from "../fixtures/dto/public"
import { withSetup } from "../fixtures/with-setup"

const mocks = vi.hoisted(() => {
    const query: Record<string, string> = {}
    return { getAll: vi.fn<() => Promise<EventItem[]>>(), replace: vi.fn(), query }
})

mockNuxtImport("useEventsService", () => () => ({ getAll: mocks.getAll }))
mockNuxtImport("useRoute", (original: () => object) => () => ({
    ...original(),
    query: mocks.query
}))
mockNuxtImport(
    "useRouter",
    (original: () => object) => () =>
        new Proxy(original(), {
            get: (target, prop, receiver) =>
                prop === "replace" ? mocks.replace : Reflect.get(target, prop, receiver)
        })
)

const event = (
    id: number,
    availableSeats: number,
    overrides: Partial<EventItem> = {}
): EventItem => ({
    ...eventDto({ id, price: 50_000, is_free: false, capacity: 20 }),
    availableSeats,
    ...overrides
})

const EVENTS = [event(1, 5), event(2, 0), event(3, 2, { is_free: true, price: 0 })]

async function setup(query: Record<string, string> = {}) {
    mocks.query = query
    const checkout = await withSetup(() => useEventCheckout())
    await vi.waitFor(() => expect(checkout.events.value).toHaveLength(EVENTS.length))
    return checkout
}

beforeEach(() => {
    clearNuxtData()
    mocks.getAll.mockReset().mockResolvedValue(EVENTS)
    mocks.replace.mockReset()
})

describe("useEventCheckout: selection from the link", () => {
    it("preselects an event with free seats from ?eventId", async () => {
        const checkout = await setup({ eventId: "1" })
        expect(checkout.selectedEvent.value?.id).toBe(1)
    })

    it.each([
        ["a sold-out event", "2"],
        ["an unknown event", "404"],
        ["a non-numeric id", "1abc"]
    ])("ignores %s and cleans the query", async (_label, eventId) => {
        const checkout = await setup({ eventId })
        expect(checkout.selectedEventId.value).toBeUndefined()
        expect(mocks.replace).toHaveBeenCalledWith({ query: { eventId: undefined } })
    })

    it("mirrors a new choice into the query without a history entry", async () => {
        const checkout = await setup()
        checkout.selectedEventId.value = 3
        await vi.waitFor(() =>
            expect(mocks.replace).toHaveBeenCalledWith({ query: { eventId: "3" } })
        )
    })
})

describe("useEventCheckout: seats and total", () => {
    it("keeps seats within 1..free seats", async () => {
        const checkout = await setup({ eventId: "1" })
        expect(checkout.seats.value).toBe(1)

        checkout.changeSeats(-1)
        expect(checkout.seats.value).toBe(1)

        for (let i = 0; i < 10; i++) checkout.changeSeats(1)
        expect(checkout.seats.value).toBe(5)
        expect(checkout.maxSeats.value).toBe(5)
    })

    it("clamps the seat count when switching to an event with fewer seats", async () => {
        const checkout = await setup({ eventId: "1" })
        checkout.changeSeats(3)
        expect(checkout.seats.value).toBe(4)

        checkout.selectedEventId.value = 3
        expect(checkout.seats.value).toBe(2)
    })

    it("computes the total in kopecks as price × seats", async () => {
        const checkout = await setup({ eventId: "1" })
        checkout.changeSeats(2)
        expect(checkout.totalKopecks.value).toBe(150_000)
        expect(checkout.isFree.value).toBe(false)
    })

    it("marks a free event", async () => {
        const checkout = await setup({ eventId: "3" })
        expect(checkout.isFree.value).toBe(true)
        expect(checkout.totalKopecks.value).toBe(0)
    })
})

describe("useEventCheckout: readiness", () => {
    it("is ready only with a selected event and valid contacts", async () => {
        const checkout = await setup({ eventId: "1" })
        expect(checkout.isReady.value).toBe(false)

        checkout.contacts.value = {
            name: "Анна",
            phone: "+7 (913) 123-45-67",
            email: "anna@example.com",
            consent: true
        }
        expect(checkout.isContactsValid.value).toBe(true)
        expect(checkout.isReady.value).toBe(true)

        checkout.contacts.value = { ...checkout.contacts.value, consent: false }
        expect(checkout.isReady.value).toBe(false)
    })
})
