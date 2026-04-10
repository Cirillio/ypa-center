import { defineStore } from "pinia"

export const useMobileMenuStore = defineStore("MobileMenu", () => {
    const isMenuOpen = ref<boolean>(false)

    const toggleMenu = () => {
        isMenuOpen.value = !isMenuOpen.value
    }

    const closeMenu = () => (isMenuOpen.value = false)
    const openMenu = () => (isMenuOpen.value = true)

    return { isMenuOpen, toggleMenu, closeMenu, openMenu }
})
