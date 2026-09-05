import { useStorage } from "@vueuse/core"
import type { ContactTimeOption, PreferredTimeWindow } from "~/types"
import { useCallbackService } from "~/services/callback.service"
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
    const { sendCallbackRequest } = useCallbackService()

    const COOLDOWN_MINUTES = 5
    const DEFAULT_FORM_STATE: ContactCallbackForm = {
        phone: "",
        time: contactTimeOptions[0]!
    }

    const form = reactive<ContactCallbackForm>({ ...DEFAULT_FORM_STATE })
    const isFormCompleted = computed<boolean>({
        get() {
            const name = form.name

            if (name === undefined) return false

            const nameCompleted = name.length >= 2
            const phoneCompleted = new Mask({ mask: Maskas.Phone }).completed(form.phone)

            return nameCompleted && phoneCompleted
        },
        set(newValue) {
            return newValue
        }
    })
    const captchaToken = ref("")
    const isLoading = ref(false)
    const error = ref<unknown>(null)

    /**
     * Anti-Spam: Хранение времени окончания блокировки в LocalStorage
     */
    const cooldownUntil = useStorage<number>("contact_form_cooldown", 0)
    const isSpamBlocked = computed(() => Date.now() < cooldownUntil.value)

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
        isFormCompleted.value = false
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
            const preferredTimeWindow = selectedTime.value.toUpperCase() as PreferredTimeWindow

            const dayjs = useDayjs(),
                formattedDate = dayjs().tz("Asia/Novosibirsk").format("DD.MM.YYYY HH:mm")
            const userName = form.name?.trim() || `Аноним от ${formattedDate}`

            await sendCallbackRequest({
                name: userName,
                phone: form.phone,
                preferred_time_window: preferredTimeWindow,
                captcha_token: captchaToken.value
            })

            cooldownUntil.value = Date.now() + COOLDOWN_MINUTES * 60 * 1000
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
