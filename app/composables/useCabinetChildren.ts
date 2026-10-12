import type { ActiveEnrollmentDto, MeChild, MeChildBlocker, MeProfile, NewChild } from "~/types"

// Переводит живую запись из тела 409 в строку для окна подтверждения удаления.
function toBlocker(dto: ActiveEnrollmentDto): MeChildBlocker {
    const title = dto.group_name ? `${dto.activity_name}, ${dto.group_name}` : dto.activity_name
    let detail = "Действующий абонемент"
    if (dto.type === "TRIAL") {
        detail = dto.status === "HELD" ? "Пробное ждёт оплаты" : "Предстоящее пробное"
        if (dto.trial_date) {
            const [year, month, day] = dto.trial_date.split("-")
            detail += ` · ${day}.${month}.${year}`
        }
    } else if (dto.status === "HELD") {
        detail = "Абонемент ждёт оплаты"
    }
    return { key: `${dto.type}-${dto.id}`, title, detail }
}

/**
 * Управление списком детей в кабинете.
 * Список – производное от профиля; композабл владеет только состоянием сохранения и удаления.
 */
export const useCabinetChildren = (
    getProfile: () => MeProfile | null | undefined,
    onRefreshProfile?: () => Promise<unknown>
) => {
    const me = useMeService()

    const isSaving = ref<boolean>(false)
    const error = ref<string | null>(null)

    const isDeleting = ref<boolean>(false)
    const deleteError = ref<string | null>(null)
    const deleteBlockers = ref<MeChildBlocker[]>([])

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

    // true – ребёнок удалён; false – причина лежит в deleteBlockers или deleteError.
    const deleteChild = async (id: string): Promise<boolean> => {
        if (isDeleting.value) return false

        isDeleting.value = true
        resetDeleteState()
        try {
            await me.deleteChild(id)
            await onRefreshProfile?.()
            return true
        } catch (e: unknown) {
            if (getProblemCode(e) === "CHILD_HAS_ACTIVE_ENROLLMENTS") {
                deleteBlockers.value = getActiveEnrollments(e).map(toBlocker)
            } else {
                const parsed = parseApiError(e, "Не удалось удалить ребёнка")
                deleteError.value = parsed.description ?? parsed.title
            }
            return false
        } finally {
            isDeleting.value = false
        }
    }

    function resetDeleteState() {
        deleteError.value = null
        deleteBlockers.value = []
    }

    return {
        children,
        isSaving: readonly(isSaving),
        error: readonly(error),
        addChild,
        isDeleting: readonly(isDeleting),
        deleteError: readonly(deleteError),
        deleteBlockers: readonly(deleteBlockers),
        deleteChild,
        resetDeleteState
    }
}
