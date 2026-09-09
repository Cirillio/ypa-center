export function useMeSubscriptions() {
    const me = useMeService()
    return useAsyncData("me-subscriptions", () => me.getSubscriptions(), { server: false })
}
