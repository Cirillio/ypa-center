export default defineNuxtRouteMiddleware(() => {
    // ПОЧЕМУ: isAuthed стора выставляется один раз при создании и не следит
    // за localStorage дальше (нет storage-события) — токены могли смениться
    // в другой вкладке или очиститься извне. hasTokens() читает localStorage
    // напрямую и остаётся источником истины для гейта; hydrate() подтягивает
    // isAuthed к этому же значению, чтобы /login (который смотрит на
    // isAuthed) не разъехался с реальным состоянием токенов.
    if (import.meta.client) {
        useAuthStore().hydrate()
    }

    if (!hasTokens()) {
        return navigateTo("/login")
    }
})
