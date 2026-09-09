export default defineNuxtRouteMiddleware(() => {
    if (!hasTokens()) {
        return navigateTo("/login")
    }
})
