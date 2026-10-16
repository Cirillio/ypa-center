import { describe, expect, it } from "vitest"
import { getFirstName } from "~/utils/get-first-name"

describe("getFirstName", () => {
    it("takes the given name from «Surname Name Patronymic»", () => {
        expect(getFirstName("Петрова Елизавета Михайловна")).toBe("Елизавета")
    })

    it("takes the second word when there is no patronymic", () => {
        expect(getFirstName("Петрова Елизавета")).toBe("Елизавета")
    })

    it("returns a single word as is", () => {
        expect(getFirstName("Елизавета")).toBe("Елизавета")
    })

    it("ignores extra spaces", () => {
        expect(getFirstName("  Петрова   Елизавета  ")).toBe("Елизавета")
    })

    it("returns an empty string for empty input", () => {
        expect(getFirstName("   ")).toBe("")
        expect(getFirstName(undefined)).toBe("")
    })
})
