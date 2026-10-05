import { describe, expect, it } from "vitest"
import { MeService, isProfileComplete } from "~/services/me.service"
import { createFailingFetch, createFakeFetch } from "../fixtures/fake-api-fetch"
import {
    bookingDto,
    childDto,
    depositEntryDto,
    pageOf,
    profileDto,
    subscriptionDto,
    upcomingDto
} from "../fixtures/dto/me"

const NBSP = "\u00a0"

describe("MeService.getProfile", () => {
    it("requests the profile and maps it to the domain model", async () => {
        const { fetch, calls } = createFakeFetch(() => profileDto())
        const profile = await new MeService(fetch).getProfile()

        expect(calls).toEqual([{ path: "/v1/me/profile/", opts: undefined }])
        expect(profile).toEqual({
            parent: { name: "Иванова Анна", phone: "+79131234567", email: "anna@example.com" },
            children: [{ id: "11", name: "Иванов Петя", birthdate: "2018-05-20" }],
            isComplete: true
        })
    })

    it("uses empty strings for a first-login profile without name and phone", async () => {
        const dto = profileDto({ profile_completed: false, children: [] })
        delete dto.full_name
        delete dto.phone
        const profile = await new MeService(createFakeFetch(() => dto).fetch).getProfile()

        expect(profile.parent).toEqual({ name: "", phone: "", email: "anna@example.com" })
        expect(profile.isComplete).toBe(false)
    })

    it("trusts the backend profile_completed flag", () => {
        expect(isProfileComplete(profileDto({ profile_completed: false }))).toBe(false)
        expect(isProfileComplete(profileDto({ profile_completed: true }))).toBe(true)
    })

    it("propagates transport errors", async () => {
        const error = new Error("boom")
        await expect(new MeService(createFailingFetch(error)).getProfile()).rejects.toBe(error)
    })
})

describe("MeService.getSubscriptionsPage", () => {
    it("passes limit/offset and maps a page", async () => {
        const { fetch, calls } = createFakeFetch(() =>
            pageOf([subscriptionDto()], { count: 7, next: "n" })
        )
        const page = await new MeService(fetch).getSubscriptionsPage({ limit: 5, offset: 5 })

        expect(calls[0]).toEqual({
            path: "/v1/me/subscriptions/",
            opts: { query: { limit: 5, offset: 5 } }
        })
        expect(page).toMatchObject({ count: 7, next: "n", previous: null })
        expect(page.results[0]).toEqual({
            id: 5,
            displayId: "SUB-0005",
            status: "ACTIVE",
            createdAt: "2026-09-30T20:00:00Z",
            // 20:00 UTC = 03:00 следующего дня в Новосибирске
            formattedCreatedAt: "1 октября 2026 г.",
            studentName: "Иванов Петя",
            sum: 7_000,
            totalRemaining: 6,
            totalMax: 8,
            slots: [
                {
                    scheduleId: 100,
                    activityName: "Шахматы",
                    groupName: "Младшая",
                    schedule: "Пн 16:00",
                    remaining: 2,
                    total: 4
                },
                {
                    scheduleId: 101,
                    activityName: "Робототехника",
                    groupName: "Старшая",
                    schedule: "Ср 17:00",
                    remaining: 4,
                    total: 4
                }
            ]
        })
    })
})

describe("MeService.getBookingsPage", () => {
    it("always asks for period=all on top of pagination", async () => {
        const { fetch, calls } = createFakeFetch(() => pageOf([]))
        await new MeService(fetch).getBookingsPage({ limit: 5, offset: 0 })

        expect(calls[0]).toEqual({
            path: "/v1/me/bookings/",
            opts: { query: { limit: 5, offset: 0, period: "all" } }
        })
    })

    it("maps a trial booking", async () => {
        const { fetch } = createFakeFetch(() => pageOf([bookingDto()]))
        const [booking] = (await new MeService(fetch).getBookingsPage({ limit: 5, offset: 0 }))
            .results

        expect(booking).toEqual({
            key: "TRIAL-3",
            kind: "trial",
            title: "Шахматы",
            subtitle: "Младшая",
            participant: "Иванов Петя",
            displayDate: "03.10.2026",
            displayTime: "16:00-16:45",
            price: 1_200,
            status: "CONFIRMED",
            statusLabel: "Подтверждена",
            isPast: false
        })
    })

    it.each([
        ["with a child name", "Петя", 3, "Петя · 3 места"],
        ["without a child name", "", 1, "1 место"],
        ["with five seats", "", 5, "5 мест"]
    ])("maps an event booking %s", async (_label, childName, seats, participant) => {
        const dto = bookingDto({
            kind: "EVENT",
            id: 8,
            child_name: childName,
            attendees_count: seats,
            group_name: null
        })
        const [booking] = (
            await new MeService(createFakeFetch(() => pageOf([dto])).fetch).getBookingsPage({
                limit: 5,
                offset: 0
            })
        ).results

        expect(booking).toMatchObject({ key: "EVENT-8", kind: "event", subtitle: "", participant })
    })

    it("keeps a free booking as null price, not 0", async () => {
        const { fetch } = createFakeFetch(() => pageOf([bookingDto({ cost: null })]))
        const [booking] = (await new MeService(fetch).getBookingsPage({ limit: 5, offset: 0 }))
            .results
        expect(booking?.price).toBeNull()
    })
})

// Характеризация под бэк от 2026-10-05: cost брони события – снимок суммы в момент записи
describe("MeService.getBookingsPage: event booking amount", () => {
    it.each([
        ["a paid online booking awaiting payment", 300_000, "PENDING", "Ожидает оплаты", 3_000],
        ["a confirmed paid booking", 300_000, "CONFIRMED", "Подтверждена", 3_000],
        ["a free booking", 0, "CONFIRMED", "Подтверждена", 0]
    ] as const)(
        "shows %s with its own price and status",
        async (_l, cost, status, label, price) => {
            const dto = bookingDto({
                kind: "EVENT",
                id: 9,
                cost,
                status,
                status_display: label,
                attendees_count: 2,
                student_id: null,
                activity_id: null,
                event_id: 2
            })
            const [booking] = (
                await new MeService(createFakeFetch(() => pageOf([dto])).fetch).getBookingsPage({
                    limit: 5,
                    offset: 0
                })
            ).results

            expect(booking).toMatchObject({ price, status, statusLabel: label })
        }
    )
})

describe("MeService.getUpcoming: item type", () => {
    it.each([
        ["SUBSCRIPTION_SESSION", "subscription"],
        ["TRIAL", "trial"],
        ["EVENT", "event"]
    ] as const)("maps kind %s to badge type %s", async (kind, type) => {
        const { fetch } = createFakeFetch(() => [upcomingDto({ kind })])
        const [item] = await new MeService(fetch).getUpcoming()

        expect(item?.type).toBe(type)
    })
})

describe("MeService.getUpcoming", () => {
    it("sends only the params that are set", async () => {
        const { fetch, calls } = createFakeFetch(() => [])
        const svc = new MeService(fetch)
        await svc.getUpcoming()
        await svc.getUpcoming({ weeks: 2, childId: 11 })

        expect(calls.map((c) => c.opts)).toEqual([
            { query: {} },
            { query: { weeks: 2, child_id: 11 } }
        ])
    })

    it("maps lessons and events with a unique key per occurrence", async () => {
        const { fetch } = createFakeFetch(() => [
            upcomingDto(),
            upcomingDto({ date: "2026-10-12", is_rescheduled: true }),
            upcomingDto({
                kind: "EVENT",
                source_type: "event",
                source_id: 4,
                activity_name: null,
                group_name: null,
                title: "Хэллоуин",
                student_name: null
            })
        ])
        const items = await new MeService(fetch).getUpcoming()

        expect(new Set(items.map((i) => i.id)).size).toBe(3)
        expect(items[0]).toEqual({
            id: "subscription_slot-100-2026-10-05-16:00",
            type: "subscription",
            title: "Шахматы",
            subtitle: "Младшая",
            displayDate: "2026-10-05",
            displayTime: "16:00",
            participant: "Иванов Петя",
            metaLabel: undefined
        })
        expect(items[1]?.metaLabel).toBe("Перенос")
        expect(items[2]).toMatchObject({
            type: "event",
            title: "Хэллоуин",
            subtitle: "",
            participant: ""
        })
    })
})

describe("MeService deposit", () => {
    it("returns the balance in rubles", async () => {
        const { fetch, calls } = createFakeFetch(() => ({ balance: 250_000 }))
        expect(await new MeService(fetch).getDepositBalance()).toBe(2_500)
        expect(calls[0]?.path).toBe("/v1/me/deposit/")
    })

    it("maps entries with the date in Novosibirsk", async () => {
        const { fetch, calls } = createFakeFetch(() => pageOf([depositEntryDto()]))
        const page = await new MeService(fetch).getDepositEntriesPage({ limit: 10, offset: 0 })

        expect(calls[0]).toEqual({
            path: "/v1/me/deposit/entries/",
            opts: { query: { limit: 10, offset: 0 } }
        })
        expect(page.results[0]).toEqual({
            id: 9,
            amount: 2_500,
            reason: "SUBSCRIPTION_EXPIRY_CREDIT",
            reasonLabel: "Возврат за неиспользованные занятия",
            subscriptionDisplayId: "SUB-0005",
            createdAt: "1 октября 2026 г."
        })
        expect(formatRubles(page.results[0]?.amount ?? 0)).toBe(`2${NBSP}500 ₽`)
    })
})

describe("MeService children", () => {
    it("adds a child with a trimmed name", async () => {
        const { fetch, calls } = createFakeFetch(() =>
            childDto({ id: 12, full_name: "Иванова Маша" })
        )
        const child = await new MeService(fetch).addChild({
            name: "  Иванова Маша ",
            birthdate: "2019-01-02"
        })

        expect(calls[0]).toEqual({
            path: "/v1/me/children/",
            opts: { method: "POST", body: { full_name: "Иванова Маша", dob: "2019-01-02" } }
        })
        expect(child).toEqual({ id: "12", name: "Иванова Маша", birthdate: "2018-05-20" })
    })

    it("deletes a child by an encoded id", async () => {
        const { fetch, calls } = createFakeFetch(() => undefined)
        await new MeService(fetch).deleteChild("12")
        await new MeService(fetch).deleteChild("../1")

        expect(calls.map((c) => c.path)).toEqual(["/v1/me/children/12/", "/v1/me/children/..%2F1/"])
        expect(calls[0]?.opts).toEqual({ method: "DELETE" })
    })

    it("propagates a 409 CHILD_HAS_ACTIVE_ENROLLMENTS to the caller", async () => {
        const conflict = {
            status: 409,
            data: { status: 409, title: "Conflict", code: "CHILD_HAS_ACTIVE_ENROLLMENTS" }
        }
        await expect(new MeService(createFailingFetch(conflict)).deleteChild("12")).rejects.toBe(
            conflict
        )
    })
})

describe("MeService.completeProfile", () => {
    it("PATCHes the profile with consent and the referral source", async () => {
        const { fetch, calls } = createFakeFetch(() => profileDto())
        const profile = await new MeService(fetch).completeProfile({
            fullName: " Иванова Анна ",
            phone: "+7 (913) 123-45-67 ",
            referralSource: "MAPS"
        })

        expect(calls[0]).toEqual({
            path: "/v1/me/profile/",
            opts: {
                method: "PATCH",
                body: {
                    full_name: "Иванова Анна",
                    phone: "+7 (913) 123-45-67",
                    referral_source: "MAPS",
                    pd_consent: true
                }
            }
        })
        expect(profile.isComplete).toBe(true)
    })
})

describe("MeService.getTrialUsages", () => {
    it("asks all trial bookings without pagination", async () => {
        const { fetch, calls } = createFakeFetch(() => [bookingDto()])
        await new MeService(fetch).getTrialUsages()

        expect(calls).toEqual([
            {
                path: "/v1/me/bookings/",
                opts: { query: { kind: "TRIAL", period: "all" } }
            }
        ])
    })

    it("keeps child and club pairs, skips manual records without them", async () => {
        const { fetch } = createFakeFetch(() => [
            bookingDto({ student_id: 11, activity_id: 1 }),
            bookingDto({ id: 4, student_id: null, activity_id: 1 }),
            bookingDto({ id: 5, student_id: 11, activity_id: null })
        ])

        expect(await new MeService(fetch).getTrialUsages()).toEqual([
            { studentId: 11, activityId: 1 }
        ])
    })
})
