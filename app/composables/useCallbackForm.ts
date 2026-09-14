import type { ContactTimeOption, ContactTimeValue, PreferredTimeWindow } from "~/types"
import { useDayjs } from "#dayjs"
import { Mask } from "maska"
import { Maskas } from "~/constants/masks"

/**
 * Интерфейс данных формы обратного звонка
 */
export interface ContactCallbackForm {
    name?: string
    phone: string
    time: ContactTimeOption
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
 * - Валидация
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
        time: contactTimeOptions[0]!
    }

    const form = reactive<ContactCallbackForm>({ ...DEFAULT_FORM_STATE })
    const isFormCompleted = computed<boolean>(() => {
        const phoneCompleted = new Mask({ mask: Maskas.Phone }).completed(form.phone)
        // Имя опционально, но если введено — валидируем от 2 символов
        const nameValid = !form.name?.trim() || form.name.trim().length >= 2

        return phoneCompleted && nameValid
    })
    const captchaToken = ref("")
    const isLoading = ref(false)
    const error = ref<unknown>(null)

    /**
     * Валидация и доступность отправки
     */
    const isSubmitDisabled = computed(
        () =>
            !isFormCompleted.value || !captchaToken.value || isSpamBlocked.value || isLoading.value
    )

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

        isLoading.value = true
        error.value = null

        try {
            const selectedTime = form.time
            const preferredTimeWindow = CONTACT_TIME_TO_WINDOW[selectedTime.value]

            const dayjs = useDayjs(),
                formattedDate = dayjs().tz("Asia/Novosibirsk").format("DD.MM.YYYY HH:mm")
            const userName = form.name?.trim() || `Аноним от ${formattedDate}`

            await callback.send({
                name: userName,
                phone: form.phone,
                preferred_time_window: preferredTimeWindow,
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
        isFormCompleted,
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
