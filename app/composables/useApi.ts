import type { AuthTokens } from "~/utils/auth-tokens"

/**
 * Транспорт, который сервисы получают в конструктор.
 *
 * WHY отдельный тип: useApi()/useRuntimeConfig() резолвятся только в setup-контексте,
 * поэтому сервис-классы не зовут композабл внутри методов, а принимают готовый fetch.
 */
export type ApiFetch = <T>(path: string, opts?: Parameters<typeof $fetch<T>>[1]) => Promise<T>

let refreshPromise: Promise<AuthTokens> | null = null

const REFRESH_LOCK_NAME = "ypa-token-refresh"

// Меняет refresh на новую пару токенов; если соседняя вкладка уже успела, берёт её результат.
async function rotateTokens(apiBase: string, staleAccess: string | null): Promise<AuthTokens> {
    const { access, refresh } = getTokens()

    // ПОЧЕМУ: refresh ротируется, старый сразу в blacklist. Если access в хранилище уже
    // не тот, с которым получили 401, другая вкладка обновила пару – повторная ротация
    // сожгла бы актуальный refresh и разлогинила пользователя везде.
    if (access && refresh && access !== staleAccess) {
        return { access, refresh }
    }

    if (!refresh) {
        clearTokens()
        throw new Error("No refresh token available")
    }

    const res = await $fetch<AuthTokens>("/v1/auth/token/refresh/", {
        baseURL: apiBase,
        method: "POST",
        body: { refresh }
    })
    setTokens(res)
    return res
}

async function requestTokenRefresh(
    apiBase: string,
    staleAccess: string | null
): Promise<AuthTokens> {
    if (!refreshPromise) {
        const rotate = () => rotateTokens(apiBase, staleAccess)

        // ПОЧЕМУ: single-flight ниже работает только внутри вкладки; Web Locks
        // выстраивает ротации разных вкладок в очередь. Без API – прежнее поведение.
        const pending = Promise.resolve(
            "locks" in navigator ? navigator.locks.request(REFRESH_LOCK_NAME, rotate) : rotate()
        )

        refreshPromise = pending
            .catch(async (err) => {
                clearTokens()
                if (import.meta.client) {
                    const authStore = useAuthStore()
                    authStore.resetFlow()
                    await navigateTo("/login")
                }
                throw err
            })
            .finally(() => {
                refreshPromise = null
            })
    }

    return refreshPromise
}

export function useApi() {
    const { apiBase } = useRuntimeConfig().public

    async function apiFetch<T>(path: string, opts?: Parameters<typeof $fetch<T>>[1]): Promise<T> {
        const headers = new Headers(opts?.headers)
        const access = getAccessToken()

        if (access && !headers.has("Authorization")) {
            headers.set("Authorization", `Bearer ${access}`)
        }

        try {
            return (await $fetch(path, {
                baseURL: apiBase,
                ...opts,
                headers
            })) as T
        } catch (error: unknown) {
            const status = getFetchStatus(error)

            const isAuthEndpoint =
                path.includes("/auth/token/refresh/") ||
                path.includes("/auth/otp/") ||
                path.includes("/auth/logout/")

            const canAttemptRefresh =
                status === 401 && !isAuthEndpoint && Boolean(getRefreshToken())

            if (!canAttemptRefresh) {
                throw error
            }

            // Single-flight refresh
            const newTokens = await requestTokenRefresh(apiBase, access)

            // Повторяем исходный запрос ровно один раз с новым access токеном
            const retryHeaders = new Headers(opts?.headers)
            retryHeaders.set("Authorization", `Bearer ${newTokens.access}`)

            return (await $fetch(path, {
                baseURL: apiBase,
                ...opts,
                headers: retryHeaders
            })) as T
        }
    }

    return { apiFetch }
}
