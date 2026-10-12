import type { MeChild, NewChild } from "~/types"

// Дети родителя для сводки оформления: профиль грузится только авторизованному и только на клиенте.
export function useCheckoutChildren() {
    const authStore = useAuthStore()
    const route = useRoute()
    const toast = useToast()
    const me = useMeService()

    // ПОЧЕМУ после монтирования: токены в localStorage, на сервере их нет –
    // решение «гость или родитель» до гидрации дало бы mismatch.
    const isAuthed = ref<boolean>(false)
    const selectedChildId = ref<string | undefined>()

    const {
        data: profile,
        status,
        error,
        execute,
        refresh
    } = useAsyncData("me-profile", () => me.getProfile(), {
        server: false,
        immediate: false
    })

    const {
        children,
        isSaving,
        addChild: addChildBase
    } = useCabinetChildren(() => profile.value, refresh)

    const isPending = computed(() => isAuthed.value && status.value !== "success" && !error.value)

    const selectedChild = computed<MeChild | null>(
        () => children.value.find((c) => c.id === selectedChildId.value) ?? null
    )

    const loginTo = computed(() => ({ path: "/login", query: { redirectFrom: route.fullPath } }))

    onMounted(() => {
        authStore.hydrate()
        isAuthed.value = authStore.isAuthed
        if (isAuthed.value) void execute()
    })

    // Добавляет ребёнка и сразу выбирает его – как в макете.
    async function addChild(payload: NewChild) {
        const knownIds = new Set(children.value.map((c) => c.id))
        try {
            await addChildBase(payload)
            selectedChildId.value = children.value.find((c) => !knownIds.has(c.id))?.id
        } catch {
            toast.add({
                title: "Не удалось добавить ребёнка",
                description: "Проверьте данные и попробуйте снова.",
                icon: "ph:x-circle-bold",
                color: "error"
            })
        }
    }

    return {
        isAuthed: readonly(isAuthed),
        isPending,
        error,
        retry: refresh,
        children,
        isSaving,
        selectedChildId,
        selectedChild,
        loginTo,
        addChild
    }
}
