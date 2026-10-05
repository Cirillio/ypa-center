import { describe, expect, it } from "vitest"
import { ActivitiesService } from "~/services/activities.service"
import { EventsService } from "~/services/events.service"
import { GalleryService } from "~/services/gallery.service"
import { PlansService } from "~/services/plans.service"
import { ScheduleService } from "~/services/schedule.service"
import { TeachersService } from "~/services/teachers.service"
import { createFailingFetch, createFakeFetch } from "../fixtures/fake-api-fetch"
import { eventDto, planDto, weekSlotDto } from "../fixtures/dto/public"

describe("PlansService", () => {
    it("maps plans to tiers: 4 lessons per slot, price in rubles", async () => {
        const { fetch, calls } = createFakeFetch(() => [
            planDto(),
            planDto({ id: 2, slots_count: 3, price: 1_800_000 }),
            planDto({
                id: 3,
                name: "Безлимит",
                slots_count: 6,
                price: 2_500_000,
                is_unlimited: true
            })
        ])
        const tiers = await new PlansService(fetch).getAll()

        expect(calls[0]?.path).toBe("/v1/public/plans/")
        expect(tiers).toEqual([
            { id: 1, slotsCount: 1, lessons: 4, price: 7_000, label: null, highlight: false },
            { id: 2, slotsCount: 3, lessons: 12, price: 18_000, label: null, highlight: false },
            {
                id: 3,
                slotsCount: 6,
                lessons: null,
                price: 25_000,
                label: "Безлимит",
                highlight: true
            }
        ])
    })

    it("treats a missing is_unlimited as a limited plan", async () => {
        const dto = planDto()
        delete dto.is_unlimited
        const [tier] = await new PlansService(createFakeFetch(() => [dto]).fetch).getAll()
        expect(tier).toMatchObject({ lessons: 4, highlight: false, label: null })
    })
})

describe("ScheduleService", () => {
    it("passes week_start only when given", async () => {
        const { fetch, calls } = createFakeFetch(() => ({
            week_start: "",
            week_end: "",
            slots: []
        }))
        const svc = new ScheduleService(fetch)
        await svc.getWeek()
        await svc.getWeek("2026-10-05")

        expect(calls).toEqual([
            { path: "/v1/public/schedule/", opts: { query: undefined } },
            { path: "/v1/public/schedule/", opts: { query: { week_start: "2026-10-05" } } }
        ])
    })

    it("converts ISO weekdays (Mon=0) to JS weekdays (Sun=0)", async () => {
        const { fetch } = createFakeFetch(() => ({
            week_start: "2026-09-28",
            week_end: "2026-10-04",
            slots: [0, 1, 5, 6].map((day, i) =>
                weekSlotDto({ schedule_id: i + 1, day_of_week: day })
            )
        }))
        const slots = await new ScheduleService(fetch).getWeek()
        expect(slots.map((s) => s.dayOfWeek)).toEqual([1, 2, 6, 0])
    })

    it("maps a slot and drops cancelled ones", async () => {
        const { fetch } = createFakeFetch(() => ({
            week_start: "2026-09-28",
            week_end: "2026-10-04",
            slots: [weekSlotDto(), weekSlotDto({ schedule_id: 101, is_cancelled: true })]
        }))
        const slots = await new ScheduleService(fetch).getWeek()

        expect(slots).toEqual([
            {
                id: 100,
                activity: { id: 1, name: "Шахматы" },
                dayOfWeek: 1,
                startTime: "16:00",
                endTime: "16:45",
                groupName: "Младшая",
                maxCapacity: 8,
                available: 5
            }
        ])
    })
})

describe("EventsService", () => {
    it("requests the event list and never shows more free seats than capacity", async () => {
        const { fetch, calls } = createFakeFetch(() => [
            eventDto({ id: 1, capacity: 20 }),
            eventDto({ id: 3, capacity: 5 })
        ])
        const events = await new EventsService(fetch).getAll()

        expect(calls[0]?.path).toBe("/v1/public/events/")
        for (const event of events) {
            expect(event.availableSeats).toBeGreaterThanOrEqual(0)
            expect(event.availableSeats).toBeLessThanOrEqual(event.capacity)
        }
        expect(events[1]?.availableSeats).toBe(5)
        expect(events[0]).not.toHaveProperty("available_seats")
    })
})

describe("thin public services", () => {
    it.each([
        [
            "activities",
            (f: Parameters<typeof createFakeFetch>[0]) =>
                new ActivitiesService(createFakeFetch(f).fetch).getAll()
        ],
        [
            "teachers",
            (f: Parameters<typeof createFakeFetch>[0]) =>
                new TeachersService(createFakeFetch(f).fetch).getAll()
        ],
        [
            "gallery",
            (f: Parameters<typeof createFakeFetch>[0]) =>
                new GalleryService(createFakeFetch(f).fetch).getAll()
        ]
    ])("%s returns the backend array as is", async (_name, run) => {
        const payload = [{ id: 1 }]
        await expect(run(() => payload)).resolves.toBe(payload)
    })

    it("hits the right endpoints", async () => {
        const { fetch, calls } = createFakeFetch(() => [])
        await new ActivitiesService(fetch).getAll()
        await new ActivitiesService(fetch).getPopular()
        await new TeachersService(fetch).getAll()
        await new GalleryService(fetch).getAll()

        expect(calls.map((c) => c.path)).toEqual([
            "/v1/public/activities/",
            "/v1/public/activities/popular/",
            "/v1/public/teachers/",
            "/v1/public/gallery/"
        ])
    })

    it("sends offset for gallery pages only when it is not zero", async () => {
        const { fetch, calls } = createFakeFetch(() => ({
            count: 0,
            next: null,
            previous: null,
            results: []
        }))
        const svc = new GalleryService(fetch)
        await svc.getPage(12)
        await svc.getPage(12, 24)

        expect(calls.map((c) => c.opts)).toEqual([
            { query: { limit: 12 } },
            { query: { limit: 12, offset: 24 } }
        ])
    })

    it("propagates errors", async () => {
        const error = new Error("down")
        await expect(new PlansService(createFailingFetch(error)).getAll()).rejects.toBe(error)
    })
})
