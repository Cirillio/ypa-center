import type { FormSubmitEvent } from "@nuxt/ui"
import { mockNuxtImport } from "@nuxt/test-utils/runtime"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useCallbackForm } from "~/composables/useCallbackForm"
import { useFeedbackForm } from "~/composables/useFeedbackForm"
import type { FeedbackFormState } from "~/schemas/feedback.schema"
import { CAPTCHA_PENDING_ERROR } from "~/utils/parse-error"
import { withSetup } from "../fixtures/with-setup"

const mocks = vi.hoisted(() => ({
    sendCallback: vi.fn<(dto: Record<string, unknown>) => Promise<void>>(),
    sendFeedback: vi.fn<(dto: Record<string, unknown>) => Promise<void>>()
}))

mockNuxtImport("useCallbackService", () => () => ({ send: mocks.sendCallback }))
mockNuxtImport("useFeedbackService", () => () => ({ send: mocks.sendFeedback }))

const PHONE = "+7 (913) 123-45-67"

beforeEach(() => {
    localStorage.clear()
    mocks.sendCallback.mockReset().mockResolvedValue()
    mocks.sendFeedback.mockReset().mockResolvedValue()
})

describe("useCallbackForm", () => {
    it("explains a click before the captcha is ready instead of sending", async () => {
        const onError = vi.fn()
        const form = await withSetup(() => useCallbackForm({ onError }))
        form.form.phone = PHONE

        expect(await form.submitForm()).toBe(false)
        expect(onError).toHaveBeenCalledWith(CAPTCHA_PENDING_ERROR)
        expect(mocks.sendCallback).not.toHaveBeenCalled()
    })

    it("keeps the button active: only loading and the cooldown disable it", async () => {
        const form = await withSetup(() => useCallbackForm())
        expect(form.isSubmitDisabled.value).toBe(false)
    })

    it("sends the time window, the consent and an anonymous name, then resets", async () => {
        const onSuccess = vi.fn()
        const form = await withSetup(() => useCallbackForm({ onSuccess }))
        form.captchaToken.value = "token"
        form.form.phone = PHONE
        form.form.consent = true
        form.setContactTime(form.contactTimeOptions[1]!)

        expect(await form.submitForm()).toBe(true)

        const dto = mocks.sendCallback.mock.calls[0]![0]
        expect(dto).toMatchObject({
            phone: PHONE,
            preferred_time_window: "AFTERNOON",
            pd_consent: true,
            captcha_token: "token"
        })
        expect(String(dto.name)).toMatch(/^Аноним от \d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/)
        expect(onSuccess).toHaveBeenCalledWith(form.contactTimeOptions[1])
        expect(form.form.phone).toBe("")
    })

    it("blocks a second request during the anti-spam cooldown", async () => {
        const form = await withSetup(() => useCallbackForm())
        form.captchaToken.value = "token"
        form.form.phone = PHONE
        await form.submitForm()

        expect(form.isSubmitDisabled.value).toBe(true)
        expect(await form.submitForm()).toBe(false)
        expect(mocks.sendCallback).toHaveBeenCalledTimes(1)
    })

    it("reports a backend error and keeps the form filled", async () => {
        mocks.sendCallback.mockRejectedValue({ status: 500, data: { status: 500, title: "Oops" } })
        const onError = vi.fn()
        const form = await withSetup(() => useCallbackForm({ onError }))
        form.captchaToken.value = "token"
        form.form.phone = PHONE

        expect(await form.submitForm()).toBe(false)
        expect(onError).toHaveBeenCalledTimes(1)
        expect(form.form.phone).toBe(PHONE)
    })
})

describe("useFeedbackForm", () => {
    const event = (data: FeedbackFormState) => ({ data }) as FormSubmitEvent<FeedbackFormState>
    const message: FeedbackFormState = {
        name: "Анна",
        email: "anna@example.com",
        message: "Подскажите расписание шахмат",
        consent: true
    }

    it("explains a click before the captcha is ready instead of sending", async () => {
        const onError = vi.fn()
        const form = await withSetup(() => useFeedbackForm({ onError }))

        expect(await form.onSubmit(event(message))).toBe(false)
        expect(onError).toHaveBeenCalledWith(CAPTCHA_PENDING_ERROR)
        expect(mocks.sendFeedback).not.toHaveBeenCalled()
    })

    it("sends the validated message with the consent flag", async () => {
        const form = await withSetup(() => useFeedbackForm())
        form.captchaToken.value = "token"

        expect(await form.onSubmit(event(message))).toBe(true)
        expect(mocks.sendFeedback).toHaveBeenCalledWith({
            name: "Анна",
            email: "anna@example.com",
            message: "Подскажите расписание шахмат",
            pd_consent: true,
            captcha_token: "token"
        })
    })
})
