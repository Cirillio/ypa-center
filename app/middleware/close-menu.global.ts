import { useMobileMenuStore } from "~/stores/mobile-menu-store"

export default defineNuxtRouteMiddleware((_, __) => {
    if (import.meta.client) {
        const mobileMenuStore = useMobileMenuStore()
        if (mobileMenuStore.isMenuOpen) mobileMenuStore.closeMenu()
    }
})
