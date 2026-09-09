export function useMeUpcoming() {
    const me = useMeService()
    return useAsyncData("me-upcoming", () => me.getUpcoming(), { server: false })
}
