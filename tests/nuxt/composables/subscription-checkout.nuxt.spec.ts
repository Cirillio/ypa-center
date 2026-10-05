import { mockNuxtImport } from "@nuxt/test-utils/runtime"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useSubscriptionCheckout } from "~/composables/useSubscriptionCheckout"
import { useSubscriptionPlans } from "~/composables/useSubscriptionPlans"
import type { PlanTier, WeeklySlot } from "~/types"
import { withSetup } from "../fixtures/with-setup"

const mocks = vi.hoisted(() => ({
    getPlans: vi.fn<() => Promise<PlanTier[]>>(),
    getWeek: vi.fn<() => Promise<WeeklySlot[]>>()
}))

mockNuxtImport("usePlansService", () => () => ({ getAll: mocks.getPlans }))
mockNuxtImport("useScheduleService", () => () => ({ getWeek: mocks.getWeek }))

const tier = (lessons: number | null, price: number): PlanTier => ({
    id: lessons ?? 99,
    lessons,
    price,
    label: lessons === null ? "Безлимит" : null,
    highlight: lessons === null
})

// Тарифы в порядке, в котором их отдаёт бэк: по возрастанию, безлимит последним
const TIERS = [
    tier(4, 4_000),
    tier(8, 7_000),
    tier(12, 10_000),
    tier(16, 11_000),
    tier(20, 15_000),
    tier(null, 16_000)
]

type Dow = WeeklySlot["dayOfWeek"]
const isDow = (n: number): n is Dow => Number.isInteger(n) && n >= 0 && n <= 6

// День недели по модулю 7 с проверкой вместо приведения типа
function dow(n: number): Dow {
    const d = ((n % 7) + 7) % 7
    if (!isDow(d)) throw new Error(`Bad weekday ${n}`)
    return d
}

const slot = (
    id: number,
    dayOfWeek: WeeklySlot["dayOfWeek"],
    startTime: string,
    available = 3
): WeeklySlot => ({
    id,
    activity: { id, name: `Кружок ${id}` },
    dayOfWeek,
    startTime,
    endTime: `${String(Number(startTime.slice(0, 2)) + 1).padStart(2, "0")}${startTime.slice(2)}`,
    groupName: "Группа",
    maxCapacity: 8,
    available
})

beforeEach(() => {
    clearNuxtData()
    mocks.getPlans.mockReset().mockResolvedValue(TIERS)
    mocks.getWeek.mockReset().mockResolvedValue([])
})

describe("useSubscriptionPlans", () => {
    it("uses tiers from the API", async () => {
        const { tiers } = await withSetup(() => useSubscriptionPlans())
        await vi.waitFor(() => expect(tiers.value).toEqual(TIERS))
    })

    it.each([
        ["the API fails", () => mocks.getPlans.mockRejectedValue(new Error("down"))],
        ["the API returns no plans", () => mocks.getPlans.mockResolvedValue([])]
    ])("falls back to app.config when %s, with the same shape", async (_label, arrange) => {
        arrange()
        const { tiers } = await withSetup(() => useSubscriptionPlans())
        await vi.waitFor(() => expect(mocks.getPlans).toHaveBeenCalled())

        expect(tiers.value.length).toBeGreaterThan(0)
        for (const t of tiers.value) {
            expect(Object.keys(t).sort()).toEqual(["highlight", "id", "label", "lessons", "price"])
            expect(t.id).toBeNull()
        }
        expect(tiers.value.filter((t) => t.lessons === null)).toHaveLength(1)
    })
})

describe("useSubscriptionCheckout: tier selection", () => {
    async function setup() {
        const checkout = await withSetup(() => useSubscriptionCheckout())
        await vi.waitFor(() => expect(checkout.tiers.value).toEqual(TIERS))
        return checkout
    }

    it("has no tier until a slot is chosen", async () => {
        const checkout = await setup()
        expect(checkout.totalMonthlyLessons.value).toBe(0)
        expect(checkout.currentTier.value).toBeNull()
        expect(checkout.nextTier.value).toBeNull()
    })

    it.each([
        [1, 4, 8],
        [2, 8, 12],
        // после 20 занятий следующий тариф – безлимит, у него lessons: null
        [5, 20, null],
        [6, null, null],
        [9, null, null]
    ])("%i slots → tier with %j lessons, next tier lessons %j", async (count, lessons, next) => {
        const checkout = await setup()
        for (let i = 1; i <= count; i++) checkout.toggleSlot(slot(i, dow(i), "10:00"))

        expect(checkout.totalMonthlyLessons.value).toBe(count * 4)
        expect(checkout.currentTier.value?.lessons).toBe(lessons)
        expect(checkout.nextTier.value?.lessons ?? null).toBe(next)
    })

    it("offers the unlimited plan as next after the largest limited one", async () => {
        const checkout = await setup()
        for (let i = 1; i <= 5; i++) checkout.toggleSlot(slot(i, 1, `${10 + i}:00`))
        expect(checkout.currentTier.value?.lessons).toBe(20)
        expect(checkout.nextTier.value).toMatchObject({ lessons: null, label: "Безлимит" })
    })

    it("derives the unlimited hint from the largest limited tier", async () => {
        const checkout = await setup()
        expect(checkout.unlimitedHint.value).toBe("при 6+ кружках")
    })
})

describe("useSubscriptionCheckout: cart", () => {
    it("toggles a slot on and off", async () => {
        const checkout = await withSetup(() => useSubscriptionCheckout())
        const s = slot(1, 1, "10:00")

        checkout.toggleSlot(s)
        expect(checkout.selectedSlotIds.value.has(1)).toBe(true)
        checkout.toggleSlot(s)
        expect(checkout.selectedSlots.value).toEqual([])
    })

    it("does not add a slot without free seats, but lets the user remove one", async () => {
        const checkout = await withSetup(() => useSubscriptionCheckout())
        checkout.toggleSlot(slot(1, 1, "10:00", 0))
        expect(checkout.selectedSlots.value).toEqual([])

        const s = slot(2, 1, "10:00", 1)
        checkout.toggleSlot(s)
        checkout.toggleSlot({ ...s, available: 0 })
        expect(checkout.selectedSlots.value).toEqual([])
    })

    it("stores a snapshot: later changes to the source slot do not leak into the cart", async () => {
        const checkout = await withSetup(() => useSubscriptionCheckout())
        const s = slot(1, 1, "10:00")
        checkout.toggleSlot(s)
        s.activity.name = "Переименован"
        expect(checkout.selectedSlots.value[0]?.activity.name).toBe("Кружок 1")
    })

    it("counts selected slots per weekday and reports conflicts", async () => {
        const checkout = await withSetup(() => useSubscriptionCheckout())
        checkout.toggleSlot(slot(1, 1, "10:00"))
        checkout.toggleSlot(slot(2, 1, "10:30"))
        checkout.toggleSlot(slot(3, 3, "10:00"))

        expect(checkout.selectedCountByDow.value).toEqual({ 1: 2, 3: 1 })
        expect(checkout.conflicts.value.map(({ first, second }) => [first.id, second.id])).toEqual([
            [1, 2]
        ])
    })

    it("shows the selected day's slots sorted by time", async () => {
        const checkout = await withSetup(() => useSubscriptionCheckout())
        const day = dow(checkout.selectedDay.value.dow)
        const other = dow(day + 1)
        mocks.getWeek.mockResolvedValue([
            slot(1, day, "17:00"),
            slot(2, other, "09:00"),
            slot(3, day, "09:30")
        ])
        await checkout.refreshSlots()

        expect(checkout.slotsForSelectedDay.value.map((s) => s.id)).toEqual([3, 1])
    })
})
