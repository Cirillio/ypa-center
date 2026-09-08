export default defineNuxtRouteMiddleware(() => {
    const { isAuthed } = storeToRefs(useAuthStore())
    if (!isAuthed.value) return navigateTo("/login")
})
