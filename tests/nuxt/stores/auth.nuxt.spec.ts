import { mockNuxtImport } from "@nuxt/test-utils/runtime"
import { createPinia, setActivePinia } from "pinia"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useAuthStore } from "~/stores/auth"
import type { MeProfile, OtpRequestResult, OtpVerifyResult } from "~/types"

const mocks = vi.hoisted(() => ({
    requestOtp: vi.fn<(email: string) => Promise<OtpRequestResult>>(),
    verifyOtp: vi.fn<(email: string, code: string) => Promise<OtpVerifyResult>>(),
    logout: vi.fn<(refresh: string) => Promise<void>>(),
    getProfile: vi.fn<() => Promise<MeProfile>>()
}))

mockNuxtImport("useAuthService", () => () => ({
    requestOtp: mocks.requestOtp,
    verifyOtp: mocks.verifyOtp,
    logout: mocks.logout
}))
mockNuxtImport("useMeService", () => () => ({ getProfile: mocks.getProfile }))

const httpError = (status: number, detail?: string, code?: string) => ({
    status,
    data: {
        status,
        title: `HTTP ${status}`,
        ...(detail ? { detail } : {}),
        ...(code ? { code } : {})
    }
})

const profile = (isComplete: boolean): MeProfile => ({
    parent: { name: "", phone: "", email: "anna@example.com" },
    children: [],
    isComplete
})

beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
    setActivePinia(createPinia())
    mocks.requestOtp.mockReset().mockResolvedValue({ resendAvailableIn: 60, codeTtl: 600 })
    mocks.verifyOtp
        .mockReset()
        .mockResolvedValue({ access: "A", refresh: "R", profileCompleted: true })
    mocks.logout.mockReset().mockResolvedValue(undefined)
    mocks.getProfile.mockReset()
})

afterEach(() => {
    vi.useRealTimers()
})

describe("auth store: email step", () => {
    it("asks for an email before calling the API", async () => {
        const store = useAuthStore()
        store.email = "   "
        await store.submit()

        expect(store.error).toBe("Введите email")
        expect(mocks.requestOtp).not.toHaveBeenCalled()
    })

    it("sends the code, moves to the code step and starts the resend timer", async () => {
        const store = useAuthStore()
        store.email = " anna@example.com "
        await store.submit()

        expect(mocks.requestOtp).toHaveBeenCalledWith("anna@example.com")
        expect(store.step).toBe("code")
        expect(store.canResend).toBe(false)
        expect(store.secondsLeft).toBe(60)
    })

    it.each([
        [429, "Слишком часто", "Слишком часто"],
        [429, undefined, "Повторный запрос возможен позже"],
        [422, undefined, "Некорректный формат email"],
        [500, undefined, "Не удалось отправить код. Попробуйте снова"]
    ])(
        "maps HTTP %i (detail %j) to %j and stays on the email step",
        async (status, detail, message) => {
            mocks.requestOtp.mockRejectedValue(httpError(status, detail))
            const store = useAuthStore()
            store.email = "anna@example.com"
            await store.submit()

            expect(store.step).toBe("email")
            expect(store.error).toBe(message)
            expect(store.isLoading).toBe(false)
        }
    )

    it("blocks a resend while the timer runs and allows it afterwards", async () => {
        const store = useAuthStore()
        store.email = "anna@example.com"
        await store.submit()

        await store.resendCode()
        expect(mocks.requestOtp).toHaveBeenCalledTimes(1)
        expect(store.error).toBe("Повторная отправка доступна через 60 сек.")

        await vi.advanceTimersByTimeAsync(61_000)
        await store.resendCode()
        expect(mocks.requestOtp).toHaveBeenCalledTimes(2)
    })
})

describe("auth store: code step", () => {
    async function atCodeStep() {
        const store = useAuthStore()
        store.email = "anna@example.com"
        await store.submit()
        return store
    }

    it("asks for a code before calling the API", async () => {
        const store = await atCodeStep()
        store.code = " "
        await store.submit()
        expect(store.error).toBe("Введите проверочный код")
        expect(mocks.verifyOtp).not.toHaveBeenCalled()
    })

    it.each([
        [true, "accepted"],
        [false, "profile"]
    ])("stores tokens and goes to %s → %s", async (profileCompleted, step) => {
        mocks.verifyOtp.mockResolvedValue({ access: "A", refresh: "R", profileCompleted })
        const store = await atCodeStep()
        store.code = " 123456 "
        await store.submit()

        expect(mocks.verifyOtp).toHaveBeenCalledWith("anna@example.com", "123456")
        expect(getTokens()).toEqual({ access: "A", refresh: "R" })
        expect(store.isAuthed).toBe(true)
        expect(store.step).toBe(step)
    })

    it.each([
        [401, "Неверный или истёкший код"],
        [429, "Слишком много запросов. Повторите позже"],
        [500, "Ошибка при проверке кода"]
    ])("maps HTTP %i to %j without logging in", async (status, message) => {
        mocks.verifyOtp.mockRejectedValue(httpError(status))
        const store = await atCodeStep()
        store.code = "000000"
        await store.submit()

        expect(store.error).toBe(message)
        expect(store.step).toBe("code")
        expect(store.isAuthed).toBe(false)
        expect(getTokens().access).toBeNull()
    })

    it("sends the user back to the email step on OTP_ATTEMPTS_EXCEEDED", async () => {
        mocks.verifyOtp.mockRejectedValue(httpError(429, undefined, "OTP_ATTEMPTS_EXCEEDED"))
        const store = await atCodeStep()
        store.code = "000000"
        await store.submit()

        expect(store.error).toBe("Превышен лимит попыток. Запросите код заново")
        expect(store.step).toBe("email")
        expect(store.code).toBe("")
        expect(store.isAuthed).toBe(false)
    })
})

describe("auth store: profile gate", () => {
    it("reports no session without tokens and does not call the API", async () => {
        await expect(useAuthStore().checkProfileCompletion()).resolves.toBe(false)
        expect(mocks.getProfile).not.toHaveBeenCalled()
    })

    it("sends an incomplete profile to the form with the confirmed email", async () => {
        setTokens({ access: "A", refresh: "R" })
        mocks.getProfile.mockResolvedValue(profile(false))
        const store = useAuthStore()

        await expect(store.checkProfileCompletion()).resolves.toBe(false)
        expect(store.step).toBe("profile")
        expect(store.email).toBe("anna@example.com")
    })

    it("accepts a complete profile", async () => {
        setTokens({ access: "A", refresh: "R" })
        mocks.getProfile.mockResolvedValue(profile(true))
        const store = useAuthStore()

        await expect(store.checkProfileCompletion()).resolves.toBe(true)
        expect(store.step).toBe("accepted")
    })
})

describe("auth store: session", () => {
    it("logs out: server call, tokens cleared, flow reset", async () => {
        setTokens({ access: "A", refresh: "R" })
        const store = useAuthStore()
        store.hydrate()
        store.email = "anna@example.com"
        store.step = "code"

        await store.logout()
        expect(mocks.logout).toHaveBeenCalledWith("R")
        expect(getTokens()).toEqual({ access: null, refresh: null })
        expect(store.isAuthed).toBe(false)
        expect(store.step).toBe("email")
        expect(store.email).toBe("")
    })

    it("still logs out locally when the server call fails", async () => {
        setTokens({ access: "A", refresh: "R" })
        mocks.logout.mockRejectedValue(new Error("offline"))
        const store = useAuthStore()

        await store.logout()
        expect(getTokens().access).toBeNull()
    })

    it("hydrate follows tokens changed outside the store", () => {
        const store = useAuthStore()
        expect(store.isAuthed).toBe(false)
        setTokens({ access: "A", refresh: "R" })
        store.hydrate()
        expect(store.isAuthed).toBe(true)
    })
})
