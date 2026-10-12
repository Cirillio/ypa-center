export interface AuthTokens {
    access: string
    refresh: string
}

const ACCESS_KEY = "ypa_access"
const REFRESH_KEY = "ypa_refresh"

export function getTokens(): { access: string | null; refresh: string | null } {
    if (!import.meta.client) {
        return { access: null, refresh: null }
    }
    return {
        access: localStorage.getItem(ACCESS_KEY),
        refresh: localStorage.getItem(REFRESH_KEY)
    }
}

export function getAccessToken(): string | null {
    if (!import.meta.client) return null
    return localStorage.getItem(ACCESS_KEY)
}

export function getRefreshToken(): string | null {
    if (!import.meta.client) return null
    return localStorage.getItem(REFRESH_KEY)
}

export function setTokens(tokens: AuthTokens): void {
    if (!import.meta.client) return
    localStorage.setItem(ACCESS_KEY, tokens.access)
    localStorage.setItem(REFRESH_KEY, tokens.refresh)
}

export function clearTokens(): void {
    if (!import.meta.client) return
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
}

// Отвечает, касается ли событие storage токена доступа (null – это localStorage.clear()), не раскрывая имена ключей.
export function isAccessTokenKey(key: string | null): boolean {
    return key === null || key === ACCESS_KEY
}

export function hasTokens(): boolean {
    if (!import.meta.client) return false
    return Boolean(localStorage.getItem(ACCESS_KEY))
}
