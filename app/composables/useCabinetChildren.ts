import type { CabinetChild, StatusData } from "~/types/status"

/**
 * Управление списком детей в кабинете.
 *
 * Бэкенда пока нет — операции имитируют запрос (как в useMailConfirm).
 * Контракт addChild/removeChild сохранится при подключении реального API.
 *
 * Признак isLinked (ребёнок привязан к покупке → удалять нельзя) вычисляется
 * на клиенте по имени участника в подписках/пробных/событиях. Флага на бэке нет.
 */
export const useCabinetChildren = (getData: () => StatusData | null) => {
    const source = computed(getData)

    const children = ref<CabinetChild[]>([])
    const isSaving = ref<boolean>(false)
    const error = ref<string | null>(null)

    let seq = 0
    const makeId = () => `child-${Date.now()}-${seq++}`

    // Имена участников, у которых есть покупки — их детей удалять нельзя.
    const linkedNames = computed<Set<string>>(() => {
        const data = source.value
        if (!data) return new Set()

        const names = new Set<string>()
        data.subscriptions.forEach((s) => names.add(s.participant.name))
        data.trials.forEach((t) => names.add(t.participant.name))
        data.events.forEach((e) => names.add(e.participant.name))
        return names
    })

    // Инициализация локального состояния при получении данных профиля.
    watch(
        source,
        (data) => {
            children.value = data
                ? data.children.map((c) => ({
                      ...c,
                      id: makeId(),
                      isLinked: linkedNames.value.has(c.name)
                  }))
                : []
        },
        { immediate: true }
    )

    const addChild = async (payload: { name: string; birthdate: string }) => {
        if (isSaving.value) return

        isSaving.value = true
        error.value = null
        try {
            await new Promise((resolve) => setTimeout(resolve, 800))
            children.value.push({
                ...payload,
                id: makeId(),
                isLinked: false
            })
        } catch (e: unknown) {
            error.value = e instanceof Error ? e.message : String(e)
        } finally {
            isSaving.value = false
        }
    }

    const removeChild = async (id: string) => {
        const child = children.value.find((c) => c.id === id)
        if (!child || child.isLinked || isSaving.value) return

        isSaving.value = true
        error.value = null
        try {
            await new Promise((resolve) => setTimeout(resolve, 600))
            children.value = children.value.filter((c) => c.id !== id)
        } catch (e: unknown) {
            error.value = e instanceof Error ? e.message : String(e)
        } finally {
            isSaving.value = false
        }
    }

    return {
        children: readonly(children),
        isSaving: readonly(isSaving),
        error: readonly(error),
        addChild,
        removeChild
    }
}
