import { useStorage } from "@vueuse/core"
import { FetchError } from "ofetch"
import type { ContactTimeOption } from "~/types"

/**
 * Интерфейс данных формы обратного звонка
 */
export interface ContactCallbackForm {
    phone: string
    time: ContactTimeOption
}

/**
 * Композабл для управления логикой формы обратного звонка.
 * Включает в себя:
 * - Состояние полей формы
 * - Валидацию (через маску)
 * - Систему Anti-Spam (кулдаун)
 * - Интеграцию с API
 */
export const useCallbackForm = () => {
    const { contactTimeOptions } = useAppConfig()

    /**
     * Константы и настройки
     */
    const COOLDOWN_MINUTES = 5
    const DEFAULT_FORM_STATE: ContactCallbackForm = {
        phone: "",
        time: contactTimeOptions[0]!
    }

    /**
     * Реактивные состояния
     */
    const form = reactive<ContactCallbackForm>({ ...DEFAULT_FORM_STATE })
    const isFormCompleted = ref(false)
    const isLoading = ref(false)
    const modalOpen = ref(false)
    const popoverOpen = ref(false)
    const lastSelectedTimeLabel = ref("")

    /**
     * Anti-Spam: Хранение времени окончания блокировки в LocalStorage
     */
    const cooldownUntil = useStorage<number>("contact_form_cooldown", 0)
    const isSpamBlocked = computed(() => Date.now() < cooldownUntil.value)

    /**
     * Валидация и доступность отправки
     */
    const isSubmitDisabled = computed(
        () => !isFormCompleted.value || isSpamBlocked.value || isLoading.value
    )

    /**
     * Сброс формы к начальному состоянию
     */
    const resetForm = () => {
        Object.assign(form, { ...DEFAULT_FORM_STATE })
        isFormCompleted.value = false
    }

    /**
     * Установка времени звонка
     */
    const setContactTime = (option: ContactTimeOption) => {
        form.time = option
        popoverOpen.value = false
    }

    /**
     * Заглушка API для DRF
     */
    const mockApiCall = async (payload: ContactCallbackForm): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log("Form Submitted:", { ...payload })
                resolve()
            }, 1200)
        })
    }

    /**
     * Обработчик отправки формы
     */
    const submitForm = async () => {
        if (isSubmitDisabled.value) return

        isLoading.value = true
        try {
            await mockApiCall(form)

            // Успешная отправка
            cooldownUntil.value = Date.now() + COOLDOWN_MINUTES * 60 * 1000
            lastSelectedTimeLabel.value = form.time.time
            modalOpen.value = true

            resetForm()
        } catch (error: unknown) {
            if (error instanceof FetchError) {
                console.error("API Error:", error.data?.message || error.message)
            } else {
                console.error("Unexpected Error:", error)
            }
        } finally {
            isLoading.value = false
        }
    }

    return {
        // State
        form,
        isFormCompleted,
        isLoading,
        modalOpen,
        popoverOpen,
        isSpamBlocked,
        isSubmitDisabled,
        lastSelectedTimeLabel,
        contactTimeOptions,

        // Actions
        setContactTime,
        submitForm,
        resetForm
    }
}
