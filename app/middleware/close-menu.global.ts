import { useMobileMenuStore } from "~/store/mobile-menu"

export default defineNuxtRouteMiddleware((_, __) => {
    if (import.meta.client) {
        const mobileMenuStore = useMobileMenuStore()
        if (mobileMenuStore.isMenuOpen) mobileMenuStore.closeMenu()
    }
})
