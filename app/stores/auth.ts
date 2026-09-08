import { MOCK_STATUS_DATA } from "~/constants/mock"
import type { StatusData } from "~/types/status"

export type OtpEmailStep = "email" | "code" | "accepted"

const DEFAULT_STEP: OtpEmailStep = "email"

export const useAuthStore = defineStore("auth", () => {
    const { secondsLeft, canResend, startTimer, resetTimer } = useOtpTimer(5)

    const email = ref<string>("")
    const code = ref<string>("")
    const step = ref<OtpEmailStep>(DEFAULT_STEP)

    const data = ref<StatusData | null>(null)
    const isLoading = ref<boolean>(false)
    const error = ref<string | null>(null)

    const isAuthed = computed(() => step.value === "accepted" && data.value !== null)

    async function requestOtp() {
        if (!canResend.value) return

        isLoading.value = true
        error.value = null

        try {
            const resp = await new Promise<boolean>((resolve) => {
                const timeout = setTimeout(() => {
                    resolve(true)
                    clearTimeout(timeout)
                }, 2000)
            })
            if (resp) {
                step.value = "code"
                startTimer()
            }
        } catch (e: unknown) {
            error.value = e instanceof Error ? e.message : String(e)
        } finally {
            isLoading.value = false
        }
    }

    async function verifyOtp() {
        isLoading.value = true
        error.value = null

        try {
            const resp = await new Promise<boolean>((resolve) => {
                const timeout = setTimeout(() => {
                    resolve(true)
                    clearTimeout(timeout)
                }, 2000)
            })
            if (resp) {
                data.value = MOCK_STATUS_DATA
                step.value = "accepted"
            }
        } catch (e: unknown) {
            error.value = e instanceof Error ? e.message : String(e)
        } finally {
            isLoading.value = false
        }
    }

    async function submit() {
        if (isLoading.value) return

        if (step.value === "email") {
            await requestOtp()
        } else if (step.value === "code") {
            await verifyOtp()
        }
    }

    async function resendCode() {
        await requestOtp()
    }

    function resetFlow() {
        step.value = "email"
        email.value = ""
        code.value = ""
        data.value = null
        error.value = null
        resetTimer()
    }

    return {
        email,
        code,
        step,
        isLoading,
        error,
        data,
        isAuthed,
        secondsLeft,
        canResend,
        requestOtp,
        verifyOtp,
        submit,
        resendCode,
        resetFlow
    }
})
