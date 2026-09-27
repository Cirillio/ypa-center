import { mountSuspended } from "@nuxt/test-utils/runtime"
import { describe, expect, it } from "vitest"
import OtpWidget from "~/components/login/otp/Widget.vue"
import type { OtpEmailStep } from "~/stores/auth"

type Props = {
    currentStep: OtpEmailStep
    secondsLeft: number
    isLoading: boolean
    error: string
    canResend: boolean
    code?: string
}

const mountWidget = (props: Partial<Props> = {}) =>
    mountSuspended(OtpWidget, {
        props: {
            currentStep: "code",
            secondsLeft: 0,
            isLoading: false,
            error: "",
            canResend: true,
            email: "anna@example.com",
            code: "",
            ...props
        }
    })

const pinInputs = (wrapper: Awaited<ReturnType<typeof mountWidget>>) =>
    wrapper.findAll('input[inputmode="numeric"], input[type="number"]')

describe("LoginOtpWidget: code input", () => {
    it("shows six code cells on the code step only", async () => {
        expect(pinInputs(await mountWidget({ currentStep: "code" }))).toHaveLength(6)
        expect(pinInputs(await mountWidget({ currentStep: "email" }))).toHaveLength(0)
    })

    // Регрессия 2026-09-27: при вставке reka-ui кладёт в модель строки, код терялся
    it("keeps a pasted code that arrives as strings", async () => {
        const wrapper = await mountWidget()
        const pin = wrapper.findComponent({ name: "UPinInput" })
        pin.vm.$emit("update:modelValue", ["1", "2", "3", "4", "5", "6"])

        expect(wrapper.emitted("update:code")?.at(-1)).toEqual(["123456"])
    })

    it("fills all six cells from a real paste event", async () => {
        const wrapper = await mountWidget()
        const data = new DataTransfer()
        data.setData("text", "654321")
        await pinInputs(wrapper)[0]?.trigger("paste", { clipboardData: data })

        expect(wrapper.emitted("update:code")?.at(-1)).toEqual(["654321"])
    })

    it("strips non-digits and extra characters from the pasted value", async () => {
        const wrapper = await mountWidget()
        wrapper
            .findComponent({ name: "UPinInput" })
            .vm.$emit("update:modelValue", ["1", "a", "2", 3, "4", "5", "6", "7"])
        expect(wrapper.emitted("update:code")?.at(-1)).toEqual(["123456"])
    })

    it("submits automatically when all six digits are entered", async () => {
        const wrapper = await mountWidget()
        wrapper.findComponent({ name: "UPinInput" }).vm.$emit("complete", [1, 2, 3, 4, 5, 6])
        expect(wrapper.emitted("submit")).toHaveLength(1)
    })

    it("does not auto-submit while a request is in flight", async () => {
        const wrapper = await mountWidget({ isLoading: true })
        wrapper.findComponent({ name: "UPinInput" }).vm.$emit("complete", [1, 2, 3, 4, 5, 6])
        expect(wrapper.emitted("submit")).toBeUndefined()
    })
})

describe("LoginOtpWidget: resend and errors", () => {
    const resendButton = (wrapper: Awaited<ReturnType<typeof mountWidget>>) => {
        const found = wrapper.findAll("button").find((b) => b.text().includes("Отправить заново"))
        if (!found) throw new Error("Resend button not found")
        return found
    }

    it("locks the resend and shows the countdown", async () => {
        const wrapper = await mountWidget({ canResend: false, secondsLeft: 42 })
        const resend = resendButton(wrapper)
        expect(resend.attributes("disabled")).toBeDefined()
        expect(resend.text()).toContain("(42)")
    })

    it("emits resend when allowed", async () => {
        const wrapper = await mountWidget()
        await resendButton(wrapper).trigger("click")
        expect(wrapper.emitted("resend")).toHaveLength(1)
    })

    it("shows the store error", async () => {
        const wrapper = await mountWidget({ error: "Неверный или истёкший код" })
        expect(wrapper.text()).toContain("Неверный или истёкший код")
    })

    it("locks the email on the code step and offers to change it", async () => {
        const wrapper = await mountWidget()
        expect(wrapper.get('input[type="email"]').attributes("disabled")).toBeDefined()
        const change = wrapper.findAll("button").find((b) => b.text().includes("Изменить почту"))
        await change?.trigger("click")
        expect(wrapper.emitted("reset")).toHaveLength(1)
    })
})
