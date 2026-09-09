import { useStorage } from "@vueuse/core"
import type { FormSubmitEvent } from "@nuxt/ui"
import type { FeedbackFormState } from "~/schemas/feedback.schema"

export interface UseFeedbackFormOptions {
    onSuccess?: () => void
    onError?: (error: ApiError) => void
}

/**
 * Композабл для формы обратной связи.
 * Зона ответственности: состояние полей, Anti-Spam кулдаун, делегирование отправки сервису.
 */
export const useFeedbackForm = (options: UseFeedbackFormOptions = {}) => {
    const feedback = useFeedbackService()

    const COOLDOWN_MINUTES = 5
    const DEFAULT_FORM_STATE: FeedbackFormState = { name: "", email: "", message: "" }

    const form = reactive<FeedbackFormState>({ ...DEFAULT_FORM_STATE })
    const captchaToken = ref("")
    const isLoading = ref(false)
    const error = ref<ApiError | null>(null)

    // Anti-Spam: хранение времени окончания блокировки в LocalStorage
    const cooldownUntil = useStorage<number>("feedback_form_cooldown", 0)
    const isSpamBlocked = computed(() => Date.now() < cooldownUntil.value)

    const isSubmitDisabled = computed(
        () => !captchaToken.value || isSpamBlocked.value || isLoading.value
    )

    const resetForm = () => {
        Object.assign(form, { ...DEFAULT_FORM_STATE })
        error.value = null
    }

    const onSubmit = async (event: FormSubmitEvent<FeedbackFormState>): Promise<boolean> => {
        if (isSubmitDisabled.value) return false

        isLoading.value = true
        error.value = null

        try {
            await feedback.send({
                name: event.data.name,
                email: event.data.email,
                message: event.data.message,
                captcha_token: captchaToken.value
            })

            cooldownUntil.value = Date.now() + COOLDOWN_MINUTES * 60 * 1000
            options.onSuccess?.()
            resetForm()
            return true
        } catch (err: unknown) {
            const parsedError: ApiError = parseApiError(err)
            error.value = parsedError
            options.onError?.(parsedError)

            return false
        } finally {
            isLoading.value = false
        }
    }

    return {
        // State
        form,
        captchaToken,
        isLoading,
        error,
        isSpamBlocked,
        isSubmitDisabled,

        // Actions
        onSubmit,
        resetForm
    }
}
