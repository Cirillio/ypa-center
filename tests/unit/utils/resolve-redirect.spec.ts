import { describe, expect, it } from "vitest"
import { resolveRedirect } from "~/utils/resolve-redirect"

describe("resolveRedirect", () => {
    it.each([
        ["/me", "/me"],
        ["/me/", "/me"],
        ["/enroll/trial", "/enroll/trial"],
        ["/enroll/subscription", "/enroll/subscription"],
        ["/enroll/trial?club=3&slot=7", "/enroll/trial?club=3&slot=7"],
        ["/enroll/trial?club=3#summary", "/enroll/trial?club=3"],
        ["/me#bookings", "/me"]
    ])("allows internal whitelisted path %j → %j", (raw, expected) => {
        expect(resolveRedirect(raw)).toBe(expected)
    })

    it.each([
        "https://evil.example",
        "http://evil.example/me",
        "//evil.example",
        "//evil.example/me",
        // Путь из белого списка на чужом хосте – всё равно внешний URL
        "//evil.example/enroll/trial?club=3",
        "https://evil.example/enroll/subscription",
        "/\\evil.example",
        "/\\/evil.example",
        "/\t/evil.example",
        "javascript:alert(1)",
        "me",
        "/admin",
        "/login",
        "/enroll/event",
        "/me/../admin",
        ""
    ])("falls back to /me for unsafe or non-whitelisted %j", (raw) => {
        expect(resolveRedirect(raw)).toBe("/me")
    })

    it.each([null, undefined, 42, {}, true])("falls back to /me for non-string %j", (raw) => {
        expect(resolveRedirect(raw)).toBe("/me")
    })

    it("uses the first element of a repeated query param", () => {
        expect(resolveRedirect(["/enroll/trial", "/me"])).toBe("/enroll/trial")
        expect(resolveRedirect(["//evil.example", "/me"])).toBe("/me")
        expect(resolveRedirect([])).toBe("/me")
    })
})
