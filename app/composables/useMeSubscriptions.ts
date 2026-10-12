// Абонементы родителя страницами: действующие сверху, затем история.
export function useMeSubscriptions() {
    const me = useMeService()
    return usePagedList("me-subscriptions", (query) => me.getSubscriptionsPage(query))
}
