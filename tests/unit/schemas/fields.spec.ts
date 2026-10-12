import { describe, expect, it } from "vitest"
import { z } from "zod"
import { fields } from "~/schemas/fields"
import { errorsByField, VALID_PHONE } from "./helpers"

const one = (schema: z.ZodType) => (value: unknown) =>
    errorsByField(z.object({ v: schema }), { v: value }).v

describe("fields.fullName", () => {
    const check = one(fields.fullName)

    it.each(["Иванова Анна", "Анна-Мария Петрова", "Anna Smith", "Ёлкина Алёна"])(
        "accepts %j",
        (v) => {
            expect(check(v)).toBeUndefined()
        }
    )

    // Под полем показывается первая ошибка – она и проверяется
    it("requires a value", () => {
        expect(check("")?.[0]).toBe("Поле обязательно")
    })

    it("rejects a name made only of spaces", () => {
        expect(check("   ")?.[0]).toBe("Поле обязательно")
    })

    it("trims surrounding spaces from the parsed value", () => {
        expect(fields.fullName.parse("  Иванова Анна  ")).toBe("Иванова Анна")
    })

    it.each(["Анна1", "Anna_Smith", "Анна!"])("rejects digits and symbols in %j", (v) => {
        expect(check(v)).toEqual(["Допустимы только буквы и тире"])
    })

    it("limits the length to 100 characters", () => {
        expect(check("а".repeat(100))).toBeUndefined()
        expect(check("а".repeat(101))).toEqual(["Слишком длинное значение"])
    })
})

describe("fields.phone", () => {
    const check = one(fields.phone)

    it("accepts a fully masked phone", () => {
        expect(check(VALID_PHONE)).toBeUndefined()
    })

    it("requires a value", () => {
        expect(check("")).toContain("Укажите телефон")
    })

    it.each(["+7 (913) 123-45", "+7 (913) 123-45-678", "79131234567"])(
        "rejects incomplete or unmasked %j",
        (v) => {
            expect(check(v)).toEqual(["Неверно указан телефон"])
        }
    )
})

describe("fields.phoneOptional", () => {
    const check = one(fields.phoneOptional)

    it.each([undefined, "", "   ", VALID_PHONE])("accepts %j", (v) => {
        expect(check(v)).toBeUndefined()
    })

    it("rejects a partially typed phone", () => {
        expect(check("+7 (913)")).toEqual(["Неверно указан телефон"])
    })
})

describe("fields.email", () => {
    const check = one(fields.email)

    it("accepts a valid address", () => {
        expect(check("parent@example.com")).toBeUndefined()
    })

    it("requires a value", () => {
        expect(check("")).toContain("Укажите почту")
    })

    it.each(["parent", "parent@", "@example.com", "parent@example"])("rejects %j", (v) => {
        expect(check(v)).toEqual(["Некорректный адрес почты"])
    })
})

describe("fields.consent", () => {
    const check = one(fields.consent)

    it("accepts only true", () => {
        expect(check(true)).toBeUndefined()
    })

    it("rejects false with a visible message", () => {
        expect(check(false)).toEqual(["Необходимо принять условия"])
    })

    it.each(["true", 1, null, undefined])("rejects a non-boolean %j", (v) => {
        expect(check(v)).toBeDefined()
    })
})
