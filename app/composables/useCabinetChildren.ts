import type { MeChild, MeProfile, NewChild } from "~/types"

/**
 * Управление списком детей в кабинете.
 * Список – производное от профиля; композабл владеет только состоянием сохранения.
 */
export const useCabinetChildren = (
    getProfile: () => MeProfile | null | undefined,
    onRefreshProfile?: () => Promise<unknown>
) => {
    const me = useMeService()

    const isSaving = ref<boolean>(false)
    const error = ref<string | null>(null)

    const children = computed<MeChild[]>(() => getProfile()?.children ?? [])

    const addChild = async (payload: NewChild) => {
        if (isSaving.value) return

        isSaving.value = true
        error.value = null
        try {
            await me.addChild(payload)
            await onRefreshProfile?.()
        } catch (e: unknown) {
            error.value = e instanceof Error ? e.message : String(e)
            throw e
        } finally {
            isSaving.value = false
        }
    }

    return {
        children,
        isSaving: readonly(isSaving),
        error: readonly(error),
        addChild
    }
}
