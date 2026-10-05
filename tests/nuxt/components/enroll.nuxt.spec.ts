import { mountSuspended } from "@nuxt/test-utils/runtime"
import { describe, expect, it } from "vitest"
import SeatsStepper from "~/components/enroll/event/SeatsStepper.vue"
import SummaryCta from "~/components/enroll/SummaryCta.vue"
import SubscriptionSummary from "~/components/enroll/subscription/Summary.vue"
import type { WeeklySlot } from "~/types"

const button = (wrapper: Awaited<ReturnType<typeof mountSuspended>>, label: string) =>
    wrapper.get(`button[aria-label="${label}"]`)

describe("EnrollEventSeatsStepper", () => {
    it("emits ±1 from the buttons", async () => {
        const wrapper = await mountSuspended(SeatsStepper, {
            props: { seats: 2, max: 5, hasEvent: true }
        })
        await button(wrapper, "Больше").trigger("click")
        await button(wrapper, "Меньше").trigger("click")
        expect(wrapper.emitted("change")).toEqual([[1], [-1]])
        expect(wrapper.get("output").text()).toBe("2")
        expect(wrapper.text()).toContain("Свободно: 5")
    })

    it("cannot go below one seat", async () => {
        const wrapper = await mountSuspended(SeatsStepper, {
            props: { seats: 1, max: 5, hasEvent: true }
        })
        expect(button(wrapper, "Меньше").attributes("disabled")).toBeDefined()
        expect(button(wrapper, "Больше").attributes("disabled")).toBeUndefined()
    })

    it("cannot exceed the free seats", async () => {
        const wrapper = await mountSuspended(SeatsStepper, {
            props: { seats: 5, max: 5, hasEvent: true }
        })
        expect(button(wrapper, "Больше").attributes("disabled")).toBeDefined()
    })

    it("is locked until an event is chosen", async () => {
        const wrapper = await mountSuspended(SeatsStepper, {
            props: { seats: 1, max: 1, hasEvent: false }
        })
        expect(button(wrapper, "Больше").attributes("disabled")).toBeDefined()
        expect(wrapper.text()).toContain("Сначала выберите событие")
    })
})

describe("EnrollSummaryCta", () => {
    it("is disabled and lists what is missing", async () => {
        const wrapper = await mountSuspended(SummaryCta, {
            props: { ready: false, missing: ["ребёнка", "время"] }
        })
        expect(wrapper.get("button").attributes("disabled")).toBeDefined()
        expect(wrapper.text()).toContain("Осталось выбрать: ребёнка, время")
    })

    it("continues when everything is chosen", async () => {
        const wrapper = await mountSuspended(SummaryCta, {
            props: { ready: true, missing: [], label: "Оплатить" }
        })
        const cta = wrapper.get("button")
        expect(cta.attributes("disabled")).toBeUndefined()
        expect(cta.text()).toContain("Оплатить")
        expect(wrapper.text()).not.toContain("Осталось выбрать")

        await cta.trigger("click")
        expect(wrapper.emitted("continue")).toHaveLength(1)
    })
})

describe("EnrollSubscriptionSummary: no plan for the cart", () => {
    const slots = (count: number): WeeklySlot[] =>
        Array.from({ length: count }, (_, i) => ({
            id: i + 1,
            activity: { id: i + 1, name: `Кружок ${i + 1}` },
            dayOfWeek: 1,
            startTime: `${String(8 + i).padStart(2, "0")}:00`,
            endTime: `${String(9 + i).padStart(2, "0")}:00`,
            groupName: "Группа",
            maxCapacity: 8,
            available: 3
        }))

    const mountSummary = (count: number) =>
        mountSuspended(SubscriptionSummary, {
            props: {
                slots: slots(count),
                tier: null,
                totalMonthlyLessons: count * 4,
                hasChild: true,
                trialPrice: 1_200,
                isSubmitting: false,
                cooldownSeconds: 0,
                error: null
            }
        })

    it("blocks payment when the lineup has no plan for this many clubs", async () => {
        const wrapper = await mountSummary(3)
        const cta = wrapper.findAll("button").find((b) => b.text().includes("Продолжить"))
        expect(cta?.attributes("disabled")).toBeDefined()
        expect(wrapper.text()).toContain("Нет тарифа на 3 кружка – добавьте или уберите кружок")
    })

    it("explains the cart limit above 10 clubs", async () => {
        const wrapper = await mountSummary(11)
        expect(wrapper.text()).toContain("В абонементе не больше 10 кружков – уберите лишние")
    })

    it("tells how long the seats are held", async () => {
        const wrapper = await mountSummary(1)
        expect(wrapper.text()).toContain("места держим за вами 15 минут")
    })
})
