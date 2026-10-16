import type { ContactTimeOption, ContactTimeValue, PreferredTimeWindow } from "~/types"

/**
 * Интерфейс данных формы обратного звонка
 */
export interface ContactCallbackForm {
    name?: string
    phone: string
    time: ContactTimeOption
    consent: boolean
}

// Явное сопоставление вместо .toUpperCase() as PreferredTimeWindow: Record
// принудит компилятор проверить исчерпаемость при расширении ContactTimeValue
const CONTACT_TIME_TO_WINDOW: Record<ContactTimeValue, PreferredTimeWindow> = {
    morning: "MORNING",
    afternoon: "AFTERNOON",
    evening: "EVENING"
}

export interface UseCallbackFormOptions {
    onSuccess?: (selectedTime: ContactTimeOption) => void
    onError?: (error: ApiError) => void
}

/**
 * Композабл для управления логикой формы обратного звонка.
 * Зона ответственности:
 * - Состояние полей формы
 * - Валидация полей – в callbackSchema через UForm
 * - Anti-Spam кулдаун
 * - Делегирование отправки сервису
 */
export const useCallbackForm = (options: UseCallbackFormOptions = {}) => {
    const { contactTimeOptions } = useAppConfig()
    const callback = useCallbackService()
    const { isSpamBlocked, triggerCooldown } = useAntiSpamCooldown("contact_form_cooldown")

    const DEFAULT_FORM_STATE: ContactCallbackForm = {
        name: "",
        phone: "",
        time: contactTimeOptions[0]!,
        consent: false
    }

    const form = reactive<ContactCallbackForm>({ ...DEFAULT_FORM_STATE })
    const captchaToken = ref("")
    const isLoading = ref(false)
    const error = ref<unknown>(null)

    // ПОЧЕМУ без проверки полей и капчи: кнопка активна всегда, поля проверяет callbackSchema по клику
    const isSubmitDisabled = computed(() => isSpamBlocked.value || isLoading.value)

    /**
     * Сброс формы к начальному состоянию
     */
    const resetForm = () => {
        Object.assign(form, { ...DEFAULT_FORM_STATE })
        error.value = null
    }

    /**
     * Установка времени звонка
     */
    const setContactTime = (option: ContactTimeOption) => {
        form.time = option
    }

    /**
     * Обработчик отправки формы
     */
    const submitForm = async (): Promise<boolean> => {
        if (isSubmitDisabled.value) return false
        if (!captchaToken.value) {
            options.onError?.(CAPTCHA_PENDING_ERROR)
            return false
        }

        isLoading.value = true
        error.value = null

        try {
            const selectedTime = form.time
            const preferredTimeWindow = CONTACT_TIME_TO_WINDOW[selectedTime.value]

            // «28.09.2026 21:37» по времени центра; Intl ставит запятую между датой и временем – убираем
            const formattedDate = new Intl.DateTimeFormat("ru-RU", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Asia/Novosibirsk"
            })
                .format(new Date())
                .replace(",", "")
            const userName = form.name?.trim() || `Аноним от ${formattedDate}`

            await callback.send({
                name: userName,
                phone: form.phone,
                preferred_time_window: preferredTimeWindow,
                pd_consent: form.consent,
                captcha_token: captchaToken.value
            })

            triggerCooldown()
            options.onSuccess?.(selectedTime)
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
        contactTimeOptions,

        // Actions
        setContactTime,
        submitForm,
        resetForm
    }
}
