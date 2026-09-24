// Управляет состоянием и отправкой анкеты первичного заполнения профиля родителя.
import type { FormSubmitEvent } from "@nuxt/ui"
import { profileSchema, type ProfileCompletion } from "~/schemas/profile.schema"

export function useProfileForm() {
    const meService = useMeService()

    const state = reactive<ProfileCompletion>({
        fullName: "",
        phone: "",
        referralSource: "",
        consent: false
    })

    const isLoading = ref<boolean>(false)
    const error = ref<string | null>(null)

    const clearError = () => {
        error.value = null
    }

    const submit = async (_event?: FormSubmitEvent<ProfileCompletion>): Promise<boolean> => {
        if (isLoading.value) return false

        isLoading.value = true
        error.value = null

        try {
            await meService.completeProfile({
                fullName: state.fullName,
                phone: state.phone,
                referralSource: state.referralSource
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
