import { describe, expect, it } from "vitest"
import type { EventContacts } from "~/schemas/event-contacts.schema"
import { createEventOrderFingerprint } from "~/utils/order-fingerprint"

const CONTACTS: EventContacts = {
    parentName: "Анна",
    childName: "Маша",
    phone: "+7 (913) 123-45-67",
    email: "anna@example.com",
    consent: true
}

const fingerprint = (overrides: Partial<EventContacts> = {}, eventId = 5, seats = 2) =>
    createEventOrderFingerprint(eventId, seats, { ...CONTACTS, ...overrides })

describe("createEventOrderFingerprint", () => {
    it("is stable for the same form", () => {
        expect(fingerprint()).toBe(fingerprint())
    })

    // ПОЧЕМУ: бэк сверяет телефон в E.164 – запись маски не должна менять ключ
    it.each([["+79131234567"], ["+7 913 123 45 67"], ["+7(913)123-45-67"]])(
        "ignores how the phone is written: %s",
        (phone) => {
            expect(fingerprint({ phone })).toBe(fingerprint())
        }
    )

    it("ignores spaces around names and email", () => {
        expect(
            fingerprint({ parentName: "  Анна ", childName: " Маша ", email: " anna@example.com " })
        ).toBe(fingerprint())
    })

    it.each<[string, () => string]>([
        ["another event", () => fingerprint({}, 6)],
        ["another number of seats", () => fingerprint({}, 5, 3)],
        ["another phone", () => fingerprint({ phone: "+7 (913) 123-45-68" })],
        ["another email", () => fingerprint({ email: "bob@example.com" })],
        ["another parent name", () => fingerprint({ parentName: "Ольга" })],
        ["another child name", () => fingerprint({ childName: "Ваня" })]
    ])("changes for %s", (_label, other) => {
        expect(other()).not.toBe(fingerprint())
    })

    it("does not depend on the consent checkbox", () => {
        expect(fingerprint({ consent: false })).toBe(fingerprint())
    })
})
