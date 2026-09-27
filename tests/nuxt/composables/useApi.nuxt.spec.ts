import { mockNuxtImport } from "@nuxt/test-utils/runtime"
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest"
import { useApi } from "~/composables/useApi"

const mocks = vi.hoisted(() => ({
    navigateTo: vi.fn(),
    resetFlow: vi.fn(),
    currentRoute: { path: "/me", fullPath: "/me?tab=bookings" }
}))

mockNuxtImport("navigateTo", () => mocks.navigateTo)
mockNuxtImport("useAuthStore", () => () => ({ resetFlow: mocks.resetFlow }))
// Настоящий роутер нужен плагинам Nuxt при старте; подменяется только текущий маршрут
mockNuxtImport(
    "useRouter",
    (original: () => object) => () =>
        new Proxy(original(), {
            get: (target, prop, receiver) =>
                prop === "currentRoute"
                    ? { value: mocks.currentRoute }
                    : Reflect.get(target, prop, receiver)
        })
)

type FetchCall = { url: string; opts: { method?: string; body?: unknown; headers?: Headers } }
type Handler = (call: FetchCall) => unknown

// Ошибка в форме ofetch: статус и тело RFC 9457
const httpError = (status: number, code?: string) => ({
    status,
    data: { status, title: `HTTP ${status}`, ...(code ? { code } : {}) }
})

const REFRESH_PATH = "/v1/auth/token/refresh/"

let calls: FetchCall[] = []
let handler: Handler = () => ({})

// Подменяет глобальный $fetch: пишет вызовы, ответ отдаёт handler текущего теста
function installFetch() {
    const fake = vi.fn(async (url: string, opts: FetchCall["opts"] = {}) => {
        const call = { url, opts }
        calls.push(call)
        return handler(call)
    })
    vi.stubGlobal("$fetch", fake)
}

const authHeader = (call: FetchCall | undefined) => call?.opts.headers?.get("Authorization") ?? null
const nonRefresh = () => calls.filter((c) => c.url !== REFRESH_PATH)
const refreshes = () => calls.filter((c) => c.url === REFRESH_PATH)

// Отложенный промис: тест сам решает, когда refresh «вернётся», – гонки без таймеров
function deferred<T>() {
    let resolve: (value: T) => void = () => {}
    let reject: (reason: unknown) => void = () => {}
    const promise = new Promise<T>((res, rej) => {
        resolve = res
        reject = rej
    })
    return { promise, resolve, reject }
}

// ПОЧЕМУ: happy-dom объявляет navigator.locks геттером на прототипе, который отдаёт null.
// В реальном браузере без Web Locks свойства нет вовсе – моделируем именно это.
const navigatorProto: object = Object.getPrototypeOf(navigator)
const protoLocks = Object.getOwnPropertyDescriptor(navigatorProto, "locks")

beforeAll(() => {
    Reflect.deleteProperty(navigatorProto, "locks")
})

afterAll(() => {
    if (protoLocks) Object.defineProperty(navigatorProto, "locks", protoLocks)
})

function setLocks(locks: { request: (name: string, cb: () => unknown) => unknown } | undefined) {
    if (locks) {
        Object.defineProperty(navigator, "locks", { value: locks, configurable: true })
    } else {
        Reflect.deleteProperty(navigator, "locks")
    }
}

beforeEach(() => {
    calls = []
    handler = () => ({ ok: true })
    installFetch()
    setLocks(undefined)
    mocks.navigateTo.mockReset()
    mocks.resetFlow.mockReset()
    mocks.currentRoute = { path: "/me", fullPath: "/me?tab=bookings" }
    localStorage.clear()
})

afterEach(() => {
    vi.unstubAllGlobals()
    setLocks(undefined)
})

describe("useApi: auth header", () => {
    it("adds the bearer token when a session exists", async () => {
        setTokens({ access: "A1", refresh: "R1" })
        await useApi().apiFetch("/v1/me/profile/")
        expect(authHeader(calls[0])).toBe("Bearer A1")
    })

    it("sends no Authorization header for a guest", async () => {
        await useApi().apiFetch("/v1/public/plans/")
        expect(authHeader(calls[0])).toBeNull()
    })

    it("keeps an Authorization header set by the caller", async () => {
        setTokens({ access: "A1", refresh: "R1" })
        await useApi().apiFetch("/v1/me/profile/", { headers: { Authorization: "Bearer custom" } })
        expect(authHeader(calls[0])).toBe("Bearer custom")
    })

    it("targets the configured API base", async () => {
        await useApi().apiFetch("/v1/public/plans/")
        expect(calls[0]?.opts).toMatchObject({ baseURL: useRuntimeConfig().public.apiBase })
    })
})

describe("useApi: 401 and token refresh", () => {
    beforeEach(() => {
        setTokens({ access: "OLD", refresh: "R1" })
    })

    it("refreshes once and retries the original request once with the new token", async () => {
        handler = ({ url, opts }) => {
            if (url === REFRESH_PATH) return { access: "NEW", refresh: "R2" }
            if (opts.headers?.get("Authorization") === "Bearer OLD") throw httpError(401)
            return { ok: true }
        }

        await expect(useApi().apiFetch("/v1/me/profile/")).resolves.toEqual({ ok: true })
        expect(refreshes()).toHaveLength(1)
        expect(refreshes()[0]?.opts).toMatchObject({ method: "POST", body: { refresh: "R1" } })
        expect(nonRefresh().map(authHeader)).toEqual(["Bearer OLD", "Bearer NEW"])
        expect(getTokens()).toEqual({ access: "NEW", refresh: "R2" })
    })

    it("does not loop when the retry is rejected again", async () => {
        handler = ({ url }) => {
            if (url === REFRESH_PATH) return { access: "NEW", refresh: "R2" }
            throw httpError(401)
        }

        await expect(useApi().apiFetch("/v1/me/profile/")).rejects.toMatchObject({ status: 401 })
        expect(refreshes()).toHaveLength(1)
        expect(nonRefresh()).toHaveLength(2)
    })

    it("shares one refresh between parallel 401s (single-flight)", async () => {
        const refresh = deferred<{ access: string; refresh: string }>()
        handler = ({ url, opts }) => {
            if (url === REFRESH_PATH) return refresh.promise
            if (opts.headers?.get("Authorization") === "Bearer OLD") throw httpError(401)
            return { ok: url }
        }

        const api = useApi()
        const pending = Promise.all([
            api.apiFetch("/v1/me/profile/"),
            api.apiFetch("/v1/me/deposit/"),
            api.apiFetch("/v1/me/upcoming/")
        ])
        await vi.waitFor(() => expect(nonRefresh()).toHaveLength(3))
        refresh.resolve({ access: "NEW", refresh: "R2" })

        await expect(pending).resolves.toEqual([
            { ok: "/v1/me/profile/" },
            { ok: "/v1/me/deposit/" },
            { ok: "/v1/me/upcoming/" }
        ])
        expect(refreshes()).toHaveLength(1)
        expect(nonRefresh().slice(3).map(authHeader)).toEqual([
            "Bearer NEW",
            "Bearer NEW",
            "Bearer NEW"
        ])
    })

    it.each(["/v1/auth/otp/verify/", "/v1/auth/otp/request/", "/v1/auth/logout/", REFRESH_PATH])(
        "never refreshes for the auth endpoint %s",
        async (path) => {
            handler = () => {
                throw httpError(401)
            }
            await expect(useApi().apiFetch(path, { method: "POST" })).rejects.toMatchObject({
                status: 401
            })
            expect(calls).toHaveLength(1)
        }
    )

    it("does not try to refresh without a refresh token", async () => {
        localStorage.removeItem("ypa_refresh")
        handler = () => {
            throw httpError(401)
        }
        await expect(useApi().apiFetch("/v1/me/profile/")).rejects.toMatchObject({ status: 401 })
        expect(refreshes()).toHaveLength(0)
    })

    it.each([403, 404, 500])("does not refresh on %i", async (status) => {
        handler = () => {
            throw httpError(status)
        }
        await expect(useApi().apiFetch("/v1/me/profile/")).rejects.toMatchObject({ status })
        expect(refreshes()).toHaveLength(0)
    })

    it("logs out and goes to /login when the refresh itself fails", async () => {
        const refreshError = httpError(401)
        handler = ({ url }) => {
            throw url === REFRESH_PATH ? refreshError : httpError(401)
        }

        await expect(useApi().apiFetch("/v1/me/profile/")).rejects.toBe(refreshError)
        expect(getTokens()).toEqual({ access: null, refresh: null })
        expect(mocks.resetFlow).toHaveBeenCalledOnce()
        expect(mocks.navigateTo).toHaveBeenCalledWith("/login")
    })

    it("allows a new refresh after a failed one (the shared promise is released)", async () => {
        handler = ({ url }) => {
            throw url === REFRESH_PATH ? httpError(401) : httpError(401)
        }
        await expect(useApi().apiFetch("/v1/me/profile/")).rejects.toBeDefined()

        setTokens({ access: "OLD", refresh: "R9" })
        handler = ({ url, opts }) => {
            if (url === REFRESH_PATH) return { access: "NEW", refresh: "R10" }
            if (opts.headers?.get("Authorization") === "Bearer OLD") throw httpError(401)
            return { ok: true }
        }
        await expect(useApi().apiFetch("/v1/me/profile/")).resolves.toEqual({ ok: true })
    })
})

describe("useApi: several tabs", () => {
    beforeEach(() => {
        setTokens({ access: "OLD", refresh: "R1" })
    })

    it("reuses a pair already rotated by another tab instead of burning the refresh token", async () => {
        handler = ({ url, opts }) => {
            if (url === REFRESH_PATH) throw new Error("must not be called")
            if (opts.headers?.get("Authorization") === "Bearer OLD") {
                // Пока запрос летел, соседняя вкладка обновила пару в localStorage
                setTokens({ access: "FROM_TAB_B", refresh: "R2" })
                throw httpError(401)
            }
            return { ok: true }
        }

        await expect(useApi().apiFetch("/v1/me/profile/")).resolves.toEqual({ ok: true })
        expect(refreshes()).toHaveLength(0)
        expect(authHeader(nonRefresh()[1])).toBe("Bearer FROM_TAB_B")
    })

    it("rotates under the shared Web Lock when the API exists", async () => {
        const request = vi.fn((_name: string, cb: () => unknown) => cb())
        setLocks({ request })
        handler = ({ url, opts }) => {
            if (url === REFRESH_PATH) return { access: "NEW", refresh: "R2" }
            if (opts.headers?.get("Authorization") === "Bearer OLD") throw httpError(401)
            return { ok: true }
        }

        await useApi().apiFetch("/v1/me/profile/")
        expect(request).toHaveBeenCalledOnce()
        expect(request.mock.calls[0]?.[0]).toBe("ypa-token-refresh")
        expect(refreshes()).toHaveLength(1)
    })

    it("still refreshes in browsers without Web Locks", async () => {
        expect("locks" in navigator).toBe(false)
        handler = ({ url, opts }) => {
            if (url === REFRESH_PATH) return { access: "NEW", refresh: "R2" }
            if (opts.headers?.get("Authorization") === "Bearer OLD") throw httpError(401)
            return { ok: true }
        }
        await expect(useApi().apiFetch("/v1/me/profile/")).resolves.toEqual({ ok: true })
    })
})

describe("useApi: 403 PROFILE_INCOMPLETE", () => {
    it("sends the user to the profile form and comes back afterwards", async () => {
        const error = httpError(403, "PROFILE_INCOMPLETE")
        handler = () => {
            throw error
        }

        await expect(useApi().apiFetch("/v1/me/bookings/")).rejects.toBe(error)
        expect(mocks.navigateTo).toHaveBeenCalledWith({
            path: "/login",
            query: { redirectFrom: "/me?tab=bookings" }
        })
    })

    it("does not redirect while already on /login", async () => {
        mocks.currentRoute = { path: "/login", fullPath: "/login" }
        handler = () => {
            throw httpError(403, "PROFILE_INCOMPLETE")
        }
        await expect(useApi().apiFetch("/v1/me/profile/")).rejects.toBeDefined()
        expect(mocks.navigateTo).not.toHaveBeenCalled()
    })

    it("ignores other 403 codes", async () => {
        handler = () => {
            throw httpError(403, "FORBIDDEN_RESOURCE")
        }
        await expect(useApi().apiFetch("/v1/me/profile/")).rejects.toBeDefined()
        expect(mocks.navigateTo).not.toHaveBeenCalled()
    })
})
