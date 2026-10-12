import type { Ref } from "vue"

interface TrialUsageOptions {
    isAuthed: Ref<boolean>
    studentId: Ref<number | null>
    activityId: Ref<number | undefined>
}

// Предпроверка лимита пробного до ЮKassa: пары «ребёнок – кружок» из записей родителя.
export function useTrialUsage({ isAuthed, studentId, activityId }: TrialUsageOptions) {
    const me = useMeService()

    // ПОЧЕМУ только на клиенте и после входа: гостю ручка ответит 401, а записи – в localStorage-сессии
    const { data, execute, refresh } = useAsyncData("me-trial-usages", () => me.getTrialUsages(), {
        server: false,
        immediate: false
    })

    watch(
        isAuthed,
        (authed) => {
            if (authed) void execute()
        },
        { immediate: true }
    )

    const isUsed = computed<boolean>(() =>
        hasUsedTrial(data.value ?? [], studentId.value, activityId.value)
    )

    // Перечитывает записи – после 409 TRIAL_LIMIT_EXCEEDED, если предпроверка не успела
    async function reload() {
        await refresh()
    }

    return { isUsed, refresh: reload }
}
