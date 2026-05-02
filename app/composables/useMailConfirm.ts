export type OtpEmailStep = "email" | "code" | "accepted"

export const OTP_EMAIL_STEPS: OtpEmailStep[] = ["email", "code", "accepted"] as const

const DEFAULT_STEP: OtpEmailStep = "email"

export const useMailConfirm = <T>() => {
    const { secondsLeft, canResend, startTimer, resetTimer } = useOtpTimer(5)

    const email = ref<string>("")
    const code = ref<string>("")
    const step = ref<OtpEmailStep>(DEFAULT_STEP)

    const data = ref<T | null>(null)
    const isLoading = ref<boolean>(false)
    const error = ref<string | undefined | null>()

    function setStep(_step: OtpEmailStep) {
        step.value = _step
    }

    async function executeRequest() {
        if (!canResend.value) return

        isLoading.value = true
        error.value = null

        try {
            const resp = await new Promise((rs) => {
                const _timeout = setTimeout(() => {
                    console.log(email.value)
                    // rj("rejected")
                    rs(true)
                    clearTimeout(_timeout)
                }, 2000)
            })
            if (resp) {
                setStep("code")
                startTimer()
            }
        } catch (e: unknown) {
            error.value = e instanceof Error ? e.message : String(e)
            console.log(e)
        }
        isLoading.value = false
    }

    async function executeConfirm() {
        isLoading.value = true
        error.value = null
        try {
            const resp = await new Promise((rs) => {
                const _timeout = setTimeout(() => {
                    console.log(code.value)
                    rs(true)
                    clearTimeout(_timeout)
                }, 2000)
            })
            if (resp) {
                setStep("accepted")
            }
        } catch (e: unknown) {
            error.value = e instanceof Error ? e.message : String(e)
            console.log(e)
        }
        isLoading.value = false
    }

    const handleOtp = async () => {
        if (isLoading.value) return

        if (step.value === "email") await executeRequest()
        else if (step.value === "code") await executeConfirm()
    }

    const resetFlow = () => {
        setStep("email")
        email.value = ""
        code.value = ""
        data.value = null
        error.value = null
        resetTimer()
    }

    return {
        email,
        code,
        step: readonly(step),
        isLoading: readonly(isLoading),
        error: readonly(error),
        data: readonly(data),
        handleOtp,
        resendCode: executeRequest,
        resetFlow,
        secondsLeft: readonly(secondsLeft),
        canResend: readonly(canResend)
    }
}
