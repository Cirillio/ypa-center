// Синхронизирует сессию между вкладками: вход или выход в одной сразу отражается в остальных.
export default defineNuxtPlugin(() => {
    const authStore = useAuthStore()
    const router = useRouter()

    // Экраны за гейтом auth: при потере токенов с них нужно уйти на /login
    const isGuardedRoute = (): boolean => {
        const middleware = router.currentRoute.value.meta.middleware
        return Array.isArray(middleware) ? middleware.includes("auth") : middleware === "auth"
    }

    const onStorage = async (event: StorageEvent) => {
        if (!isAccessTokenKey(event.key)) return

        const wasAuthed = authStore.isAuthed
        authStore.hydrate()

        // ПОЧЕМУ: ротация access соседней вкладкой тоже шлёт событие, но статус сессии
        // не меняется – реагировать на неё нельзя, иначе лишние запросы и редиректы.
        if (wasAuthed === authStore.isAuthed) return

        if (!authStore.isAuthed) {
            authStore.resetFlow()
            if (isGuardedRoute()) {
                await navigateTo("/login")
            }
            return
        }

        // Вошли в другой вкладке: тем же путём, что и при монтировании /login
        const route = router.currentRoute.value
        if (route.path === "/login" && (await authStore.checkProfileCompletion())) {
            await navigateTo(resolveRedirect(route.query.redirectFrom))
        }
    }

    // ПОЧЕМУ без cleanup: плагин живёт столько же, сколько приложение
    window.addEventListener("storage", onStorage)
})
