import type { ApiProfile } from "~/types/me"

export function useMeProfile() {
    const { apiFetch } = useApi()
    return useAsyncData("me-profile", () => apiFetch<ApiProfile>("/v1/me/profile/"), {
        server: false
    })
}
