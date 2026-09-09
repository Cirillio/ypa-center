import type { ApiProfile, ApiSubscriptionView, MeChildVM } from "~/types/me"
import { toChildVM } from "~/types/me"

export const useCabinetChildren = (
    getProfile: () => ApiProfile | null | undefined,
    getSubscriptions?: () => ApiSubscriptionView[] | null | undefined,
    onRefreshProfile?: () => Promise<unknown>
) => {
    const { apiFetch } = useApi()

    const isSaving = ref<boolean>(false)
    const error = ref<string | null>(null)

    const children = computed<MeChildVM[]>(() => {
        const profile = getProfile()
        if (!profile?.children) return []
        const subs = getSubscriptions?.() ?? []
        return profile.children.map((child) => toChildVM(child, subs))
    })

    const addChild = async (payload: { name: string; birthdate: string }) => {
        if (isSaving.value) return

        isSaving.value = true
        error.value = null
        try {
            await apiFetch("/v1/me/children/", {
                method: "POST",
                body: {
                    full_name: payload.name.trim(),
                    dob: payload.birthdate
                }
            })
            if (onRefreshProfile) {
                await onRefreshProfile()
            }
        } catch (e: unknown) {
            error.value = e instanceof Error ? e.message : String(e)
            throw e
        } finally {
            isSaving.value = false
        }
    }

    // TODO backend: нет DELETE /api/v1/me/children/{id}/, удаление временно не поддерживается бэкендом.

    return {
        children,
        isSaving: readonly(isSaving),
        error: readonly(error),
        addChild
    }
}
