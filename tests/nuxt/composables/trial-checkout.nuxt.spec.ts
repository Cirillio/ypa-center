import { mockNuxtImport } from "@nuxt/test-utils/runtime"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { nextTick } from "vue"
import { useTrialCheckout } from "~/composables/useTrialCheckout"
import type { Activity, TrialCheckoutSlot } from "~/types"
import { withSetup } from "../fixtures/with-setup"

const mocks = vi.hoisted(() => {
    const query: Record<string, string> = {}
    return {
        getAll: vi.fn<() => Promise<Activity[]>>(),
        getNextTrialSlots: vi.fn<(id: number) => Promise<TrialCheckoutSlot[]>>(),
        replace: vi.fn(),
        query
    }
})

mockNuxtImport("useActivitiesService", () => () => ({
    getAll: mocks.getAll,
    getNextTrialSlots: mocks.getNextTrialSlots
}))
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

const club = (id: number, slug: string): Activity => ({
    id,
    name: `Кружок ${id}`,
    slug,
    groups: [],
    teachers: [],
    days_of_week: []
})

// Слоты пробного: scheduleId = clubId * 100 + n; бэк отдаёт только свободные занятия
const slotsOf = (clubId: number): TrialCheckoutSlot[] =>
    [1, 2].map((n) => ({
        key: `${clubId * 100 + n}_2026-10-05`,
        scheduleId: clubId * 100 + n,
        date: "2026-10-05",
        startTime: "10:00",
        endTime: "11:00",
        groupName: "Группа",
        displayDate: "Пн, 5 октября",
        displayTime: "10:00"
    }))

async function setup(query: Record<string, string> = {}) {
    mocks.query = query
    const checkout = await withSetup(() => useTrialCheckout())
    await vi.waitFor(() => expect(checkout.clubs.value).toHaveLength(2))
    return checkout
}

beforeEach(() => {
    clearNuxtData()
    mocks.getAll.mockReset().mockResolvedValue([club(1, "chess"), club(2, "robotics")])
    mocks.getNextTrialSlots.mockReset().mockImplementation(async (id) => slotsOf(id))
    mocks.replace.mockReset()
})

describe("useTrialCheckout", () => {
    it.each([
        ["id", "2"],
        ["slug", "robotics"]
    ])("preselects a club from ?clubId by %s and loads its slots", async (_label, clubId) => {
        const checkout = await setup({ clubId })
        await vi.waitFor(() => expect(checkout.selectedClubId.value).toBe(2))
        await vi.waitFor(() => expect(checkout.selectedClubSlots.value).toHaveLength(2))
        expect(mocks.getNextTrialSlots).toHaveBeenCalledWith(2)
    })

    it("keeps an available slot from ?slotId", async () => {
        const checkout = await setup({ clubId: "1", slotId: "101_2026-10-05" })
        await vi.waitFor(() => expect(checkout.selectedSlot.value?.scheduleId).toBe(101))
    })

    it.each([
        ["a slot the backend no longer offers", "103_2026-10-05"],
        ["a slot of another club", "201_2026-10-05"],
        ["a malformed slot key", "101"]
    ])("drops %s from the link", async (_label, slotId) => {
        const checkout = await setup({ clubId: "1", slotId })
        await vi.waitFor(() => expect(checkout.selectedClubSlots.value).toHaveLength(2))
        await nextTick()
        expect(checkout.selectedSlotId.value).toBeUndefined()
    })

    it("resets the chosen slot when the club changes", async () => {
        const checkout = await setup({ clubId: "1", slotId: "101_2026-10-05" })
        await vi.waitFor(() => expect(checkout.selectedSlot.value?.scheduleId).toBe(101))

        checkout.selectedClubId.value = 2
        await nextTick()
        expect(checkout.selectedSlotId.value).toBeUndefined()
    })

    it("mirrors the choice into the query", async () => {
        const checkout = await setup()
        checkout.selectedClubId.value = 1
        await vi.waitFor(() =>
            expect(mocks.replace).toHaveBeenLastCalledWith({
                query: { clubId: "1", slotId: undefined }
            })
        )
        checkout.selectedSlotId.value = "101_2026-10-05"
        await vi.waitFor(() =>
            expect(mocks.replace).toHaveBeenLastCalledWith({
                query: { clubId: "1", slotId: "101_2026-10-05" }
            })
        )
    })

    it("does not select anything for an unknown club", async () => {
        const checkout = await setup({ clubId: "999" })
        expect(checkout.selectedClubId.value).toBeUndefined()
        expect(checkout.selectedClubSlots.value).toEqual([])
    })
})
