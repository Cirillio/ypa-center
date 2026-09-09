import type { ApiSubscriptionView } from "~/types/me"

export function useMeSubscriptions() {
    const { apiFetch } = useApi()
    return useAsyncData(
        "me-subscriptions",
        () => apiFetch<ApiSubscriptionView[]>("/v1/me/subscriptions/"),
        { server: false }
    )
}
