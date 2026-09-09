import type { ApiUpcomingItem } from "~/types/me"

export function useMeUpcoming() {
    const { apiFetch } = useApi()
    return useAsyncData("me-upcoming", () => apiFetch<ApiUpcomingItem[]>("/v1/me/upcoming/"), {
        server: false
    })
}
