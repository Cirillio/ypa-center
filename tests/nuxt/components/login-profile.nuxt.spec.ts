import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime"
import { beforeEach, describe, expect, it, vi } from "vitest"
import ProfileWidget from "~/components/login/profile/Widget.vue"
import type { MeProfile, ProfileCompletionPayload } from "~/types"

const mocks = vi.hoisted(() => ({
    completeProfile: vi.fn<(payload: ProfileCompletionPayload) => Promise<MeProfile>>()
}))

mockNuxtImport("useMeService", () => () => ({ completeProfile: mocks.completeProfile }))

const ERRORS = {
    fullName: "Поле обязательно",
    phone: "Укажите телефон",
    referralSource: "Пожалуйста, укажите, откуда вы о нас узнали",
    consent: "Необходимо принять условия"
}

type Wrapper = Awaited<ReturnType<typeof mountSuspended>>

async function fillValid(wrapper: Wrapper) {
    await wrapper.get('input[autocomplete="name"]').setValue(" Иванова Анна ")
    await wrapper.get('input[type="tel"]').setValue("+7 (913) 123-45-67")
    wrapper.findComponent({ name: "USelect" }).vm.$emit("update:modelValue", "MAPS")
    await wrapper.get('[role="checkbox"]').trigger("click")
}

const submit = async (wrapper: Wrapper) => {
    await wrapper.get("form").trigger("submit")
    await vi.waitFor(() => expect(wrapper.find("form").exists()).toBe(true))
}

beforeEach(() => {
    mocks.completeProfile.mockReset().mockResolvedValue({
        parent: { name: "Иванова Анна", phone: "+7 (913) 123-45-67", email: "anna@example.com" },
        children: [],
        isComplete: true
    })
})

describe("LoginProfileWidget", () => {
    it("shows no errors before the first submit", async () => {
        const wrapper = await mountSuspended(ProfileWidget)
        const name = wrapper.get('input[autocomplete="name"]')
        await name.setValue("1")
        await name.trigger("blur")
        await new Promise((resolve) => setTimeout(resolve, 50))

        expect(wrapper.text()).not.toContain("Допустимы только буквы и тире")
        for (const message of Object.values(ERRORS)) expect(wrapper.text()).not.toContain(message)
    })

    it("reports every required field on an empty submit and does not call the API", async () => {
        const wrapper = await mountSuspended(ProfileWidget)
        await submit(wrapper)

        await vi.waitFor(() => {
            for (const message of Object.values(ERRORS)) expect(wrapper.text()).toContain(message)
        })
        expect(mocks.completeProfile).not.toHaveBeenCalled()
    })

    it("clears the error of a field once it changes", async () => {
        const wrapper = await mountSuspended(ProfileWidget)
        await submit(wrapper)
        await vi.waitFor(() => expect(wrapper.text()).toContain(ERRORS.fullName))

        await wrapper.get('input[autocomplete="name"]').setValue("Анна")
        await vi.waitFor(() => expect(wrapper.text()).not.toContain(ERRORS.fullName))
        expect(wrapper.text()).toContain(ERRORS.phone)
    })

    it("does not submit without consent", async () => {
        const wrapper = await mountSuspended(ProfileWidget)
        await wrapper.get('input[autocomplete="name"]').setValue("Иванова Анна")
        await wrapper.get('input[type="tel"]').setValue("+7 (913) 123-45-67")
        wrapper.findComponent({ name: "USelect" }).vm.$emit("update:modelValue", "MAPS")
        await submit(wrapper)

        await vi.waitFor(() => expect(wrapper.text()).toContain(ERRORS.consent))
        expect(mocks.completeProfile).not.toHaveBeenCalled()
    })

    it("sends the trimmed profile and reports completion", async () => {
        const wrapper = await mountSuspended(ProfileWidget)
        await fillValid(wrapper)
        await submit(wrapper)

        await vi.waitFor(() => expect(wrapper.emitted("completed")).toHaveLength(1))
        expect(mocks.completeProfile).toHaveBeenCalledWith({
            fullName: "Иванова Анна",
            phone: "+7 (913) 123-45-67",
            referralSource: "MAPS"
        })
    })

    it("shows a backend error and stays on the form", async () => {
        mocks.completeProfile.mockRejectedValue({
            status: 400,
            data: {
                status: 400,
                title: "Validation Error",
                detail: "Проверьте поля",
                extensions: {
                    invalid_params: [{ name: "phone", reason: "Номер уже используется." }]
                }
            }
        })
        const wrapper = await mountSuspended(ProfileWidget)
        await fillValid(wrapper)
        await submit(wrapper)

        await vi.waitFor(() => expect(wrapper.text()).toContain("Номер уже используется."))
        expect(wrapper.emitted("completed")).toBeUndefined()
    })
})
