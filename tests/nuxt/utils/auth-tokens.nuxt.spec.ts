import { afterEach, describe, expect, it } from "vitest"
import {
    clearTokens,
    getAccessToken,
    getRefreshToken,
    getTokens,
    hasTokens,
    isAccessTokenKey,
    setTokens
} from "~/utils/auth-tokens"

afterEach(() => {
    localStorage.clear()
})

describe("auth-tokens", () => {
    it("stores and reads both tokens", () => {
        setTokens({ access: "a1", refresh: "r1" })
        expect(getTokens()).toEqual({ access: "a1", refresh: "r1" })
        expect(getAccessToken()).toBe("a1")
        expect(getRefreshToken()).toBe("r1")
        expect(hasTokens()).toBe(true)
    })

    it("reports no session when storage is empty", () => {
        expect(getTokens()).toEqual({ access: null, refresh: null })
        expect(hasTokens()).toBe(false)
    })

    it("clears both tokens", () => {
        setTokens({ access: "a1", refresh: "r1" })
        clearTokens()
        expect(getTokens()).toEqual({ access: null, refresh: null })
        expect(hasTokens()).toBe(false)
    })

    it("treats a lone refresh token as no session (hasTokens reads access only)", () => {
        localStorage.setItem("ypa_refresh", "r1")
        expect(hasTokens()).toBe(false)
        expect(getRefreshToken()).toBe("r1")
    })

    it("does not touch unrelated keys on clear", () => {
        localStorage.setItem("contact_form_cooldown", "123")
        setTokens({ access: "a1", refresh: "r1" })
        clearTokens()
        expect(localStorage.getItem("contact_form_cooldown")).toBe("123")
    })
})

describe("isAccessTokenKey", () => {
    it.each([
        ["the access key", "ypa_access", true],
        ["localStorage.clear() (null key)", null, true],
        ["the refresh key", "ypa_refresh", false],
        ["an unrelated key", "theme", false]
    ])("%s → %s", (_label, key, expected) => {
        expect(isAccessTokenKey(key)).toBe(expected)
    })
})
