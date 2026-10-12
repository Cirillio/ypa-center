// Управляет состоянием и отправкой анкеты первичного заполнения профиля родителя.
import {
    profileSchema,
    type ProfileCompletion,
    type ProfileFormState
} from "~/schemas/profile.schema"

export function useProfileForm() {
    const meService = useMeService()

    const state = reactive<ProfileFormState>({
        fullName: "",
        phone: "",
        referralSource: undefined,
        consent: false
    })

    const isLoading = ref<boolean>(false)
    const error = ref<string | null>(null)

    const clearError = () => {
        error.value = null
    }

    // Принимает уже провалидированные схемой данные из события сабмита UForm.
    const submit = async (data: ProfileCompletion): Promise<boolean> => {
        if (isLoading.value) return false

        isLoading.value = true
        error.value = null

        try {
            await meService.completeProfile({
                fullName: data.fullName,
                phone: data.phone,
                referralSource: data.referralSource
            })
            return true
        } catch (err: unknown) {
            const parsed = parseApiError(err, "Не удалось сохранить анкету")
            error.value = parsed.description ?? parsed.title
            return false
        } finally {
            isLoading.value = false
        }
    }

    return {
        state,
        schema: profileSchema,
        isLoading,
        error,
        clearError,
        submit
    }
}
