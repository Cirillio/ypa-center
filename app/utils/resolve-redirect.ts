const DEFAULT_REDIRECT = "/me"
const ALLOWED_PATHS: ReadonlySet<string> = new Set(["/me", "/enroll/trial", "/enroll/subscription"])
// Фиктивный origin: по нему отличаем внутренний путь от внешнего после разбора URL
const PROBE_ORIGIN = "http://internal.invalid"

// Возвращает безопасный внутренний путь для возврата после входа, иначе /me (защита от открытого редиректа).
export const resolveRedirect = (raw: unknown): string => {
    const value = Array.isArray(raw) ? raw[0] : raw
    if (typeof value !== "string" || !value.startsWith("/")) {
        return DEFAULT_REDIRECT
    }

    let url: URL
    try {
        url = new URL(value, PROBE_ORIGIN)
    } catch {
        return DEFAULT_REDIRECT
    }

    // "//host", "/\host" и "/\t/host" URL-парсер превращает во внешний origin
    if (url.origin !== PROBE_ORIGIN) {
        return DEFAULT_REDIRECT
    }

    const pathname = url.pathname.replace(/\/+$/, "")
    if (!ALLOWED_PATHS.has(pathname)) {
        return DEFAULT_REDIRECT
    }

    return pathname + url.search
}
