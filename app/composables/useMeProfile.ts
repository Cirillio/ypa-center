export function useMeProfile() {
    const me = useMeService()
    return useAsyncData("me-profile", () => me.getProfile(), { server: false })
}
