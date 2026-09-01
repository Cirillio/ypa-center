export const useIsHydrated = () => {
    const isHydrated = ref(false)

    onMounted(() => {
        isHydrated.value = true
    })

    return { isHydrated }
}
