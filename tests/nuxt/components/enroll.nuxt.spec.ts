import { mountSuspended } from "@nuxt/test-utils/runtime"
import { describe, expect, it } from "vitest"
import SeatsStepper from "~/components/enroll/event/SeatsStepper.vue"
import SummaryCta from "~/components/enroll/SummaryCta.vue"

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
