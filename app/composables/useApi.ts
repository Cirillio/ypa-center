export function useApi() {
    const { apiBase } = useRuntimeConfig().public

    function apiFetch<T>(path: string, opts?: Parameters<typeof $fetch<T>>[1]) {
        return $fetch<T>(path, { baseURL: apiBase, ...opts })
    }

    return { apiFetch }
}
