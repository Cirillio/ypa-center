import { describe, expect, it } from "vitest"
import { AuthService } from "~/services/auth.service"
import { CallbackService } from "~/services/callback.service"
import { FeedbackService } from "~/services/feedback.service"
import { createFakeFetch } from "../fixtures/fake-api-fetch"

describe("CallbackService", () => {
    it("sends consent, a honeypot and an E.164 phone", async () => {
        const { fetch, calls } = createFakeFetch(() => ({ status: "accepted" }))
        await new CallbackService(fetch).send({
            name: "Анна",
            phone: "+7 (913) 123-45-67",
            preferred_time_window: "EVENING",
            pd_consent: true,
            captcha_token: "tkn"
        })

        expect(calls[0]).toEqual({
            path: "/v1/public/callback/",
            opts: {
                method: "POST",
                body: {
                    name: "Анна",
                    phone: "+79131234567",
                    preferred_time_window: "EVENING",
                    pd_consent: true,
                    website_url: "",
                    captcha_token: "tkn"
                }
            }
        })
    })
})

describe("FeedbackService", () => {
    const base = {
        email: "anna@example.com",
        message: "Подскажите расписание",
        pd_consent: true,
        captcha_token: "tkn"
    }

    it("sends consent and an empty honeypot", async () => {
        const { fetch, calls } = createFakeFetch(() => ({ status: "accepted" }))
        await new FeedbackService(fetch).send({ ...base, name: " Анна " })

        expect(calls[0]).toEqual({
            path: "/v1/public/feedback/",
            opts: {
                method: "POST",
                body: { ...base, name: "Анна", website_url: "" }
            }
        })
    })

    it.each([undefined, "", "   "])("omits a blank name %j", async (name) => {
        const { fetch, calls } = createFakeFetch(() => ({ status: "accepted" }))
        await new FeedbackService(fetch).send({ ...base, name })
        expect(calls[0]?.opts?.body).toMatchObject({ name: undefined })
    })
})

describe("AuthService", () => {
    it("requests an OTP with a trimmed email and maps the timers", async () => {
        const { fetch, calls } = createFakeFetch(() => ({
            status: "sent",
            resend_available_in: 60,
            code_ttl: 600
        }))
        const result = await new AuthService(fetch).requestOtp("  anna@example.com ")

        expect(calls[0]).toEqual({
            path: "/v1/auth/otp/request/",
            opts: { method: "POST", body: { email: "anna@example.com" } }
        })
        expect(result).toEqual({ resendAvailableIn: 60, codeTtl: 600 })
    })

    it("verifies a code and returns tokens with the profile flag", async () => {
        const { fetch, calls } = createFakeFetch(() => ({
            access: "a",
            refresh: "r",
            profile_completed: false
        }))
        const result = await new AuthService(fetch).verifyOtp("anna@example.com ", " 123456 ")

        expect(calls[0]?.opts).toEqual({
            method: "POST",
            body: { email: "anna@example.com", code: "123456" }
        })
        expect(result).toEqual({ access: "a", refresh: "r", profileCompleted: false })
    })

    it("sends the refresh token on logout", async () => {
        const { fetch, calls } = createFakeFetch(() => undefined)
        await new AuthService(fetch).logout("r")
        expect(calls[0]).toEqual({
            path: "/v1/auth/logout/",
            opts: { method: "POST", body: { refresh: "r" } }
        })
    })
})
