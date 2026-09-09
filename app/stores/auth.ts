export type OtpEmailStep = "email" | "code" | "accepted"

// Стор сам подбирает текст по статусу (401/429/400); от парсера нужен только
// человекочитаемый detail из RFC 9457 как фолбэк.
const errorMessage = (err: unknown, fallback: string): string =>
    parseApiError(err, fallback).description ?? fallback

export const useAuthStore = defineStore("auth", () => {
    const auth = useAuthService()
    const { secondsLeft, canResend, startTimer, resetTimer } = useOtpTimer(60)

    const email = ref<string>("")
    const code = ref<string>("")
    const step = ref<OtpEmailStep>("email")

    const isLoading = ref<boolean>(false)
    const error = ref<string | null>(null)
    const isAuthed = ref<boolean>(import.meta.client ? hasTokens() : false)

    function hydrate() {
        isAuthed.value = hasTokens()
    }

    async function requestOtp() {
        if (!canResend.value && step.value === "code") {
            error.value = `Повторная отправка доступна через ${secondsLeft.value} сек.`
            return
        }

        const trimmedEmail = email.value.trim()
        if (!trimmedEmail) {
            error.value = "Введите email"
            return
        }

        isLoading.value = true
        error.value = null

        try {
            const res = await auth.requestOtp(trimmedEmail)
            step.value = "code"
            startTimer(res.resendAvailableIn)
        } catch (err: unknown) {
            const status = getFetchStatus(err)

            if (status === 429) {
                error.value = errorMessage(err, "Повторный запрос возможен позже")
            } else if (status === 400) {
                error.value = errorMessage(err, "Некорректный формат email")
            } else {
                error.value = errorMessage(err, "Не удалось отправить код. Попробуйте снова")
            }
        } finally {
            isLoading.value = false
        }
    }

    async function verifyOtp() {
        const trimmedCode = code.value.trim()
        if (!trimmedCode) {
            error.value = "Введите проверочный код"
            return
        }

        isLoading.value = true
        error.value = null

        try {
            const res = await auth.verifyOtp(email.value, trimmedCode)
            setTokens(res)
            isAuthed.value = true
            step.value = "accepted"
        } catch (err: unknown) {
            const status = getFetchStatus(err)

            if (status === 401) {
                error.value = "Неверный или истёкший код"
            } else if (status === 429) {
                error.value = "Превышен лимит попыток. Запросите код заново"
            } else if (status === 400) {
                error.value = errorMessage(err, "Проверьте введённые данные")
            } else {
                error.value = errorMessage(err, "Ошибка при проверке кода")
            }
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

    async function logout() {
        const refresh = getRefreshToken()
        if (refresh) {
            try {
                await auth.logout(refresh)
            } catch {
                // Best-effort: ошибку глотаем
            }
        }
        clearTokens()
        isAuthed.value = false
        resetFlow()
    }

    function resetFlow() {
        step.value = "email"
        email.value = ""
        code.value = ""
        error.value = null
        resetTimer()
    }

    return {
        email,
        code,
        step,
        isLoading,
        error,
        isAuthed,
        secondsLeft,
        canResend,
        requestOtp,
        verifyOtp,
        submit,
        resendCode,
        logout,
        resetFlow,
        hydrate
    }
})
