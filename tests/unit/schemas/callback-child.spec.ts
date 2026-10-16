import { describe, expect, it } from "vitest"
import { callbackSchema } from "~/schemas/callback.schema"
import { childSchema } from "~/schemas/child.schema"
import { errorsByField, VALID_PHONE } from "./helpers"

describe("callbackSchema", () => {
    const valid = { name: "", phone: VALID_PHONE, consent: true }

    it("accepts an anonymous request with a full phone", () => {
        expect(errorsByField(callbackSchema, valid)).toEqual({})
    })

    it("reports the phone and the consent on an empty form", () => {
        const errors = errorsByField(callbackSchema, { name: "", phone: "", consent: false })
        // Под полем UForm показывает первую ошибку
        expect(errors.phone?.[0]).toBe("Укажите телефон")
        expect(errors.consent).toEqual(["Необходимо принять условия"])
        expect(Object.keys(errors).sort()).toEqual(["consent", "phone"])
    })

    it("rejects a half-typed phone", () => {
        expect(errorsByField(callbackSchema, { ...valid, phone: "+7 (913) 12" })).toEqual({
            phone: ["Неверно указан телефон"]
        })
    })

    it("lets the name be empty but not a single letter", () => {
        expect(errorsByField(callbackSchema, { ...valid, name: "   " })).toEqual({})
        expect(errorsByField(callbackSchema, { ...valid, name: "А" })).toEqual({
            name: ["Имя – от 2 букв"]
        })
    })
})

describe("childSchema", () => {
    const valid = { name: "Петя", birthdate: "2018-05-20" }

    it("accepts a child without a grade", () => {
        expect(errorsByField(childSchema, valid)).toEqual({})
    })

    it("accepts every listed grade", () => {
        expect(errorsByField(childSchema, { ...valid, schoolGrade: "Дошкольник" })).toEqual({})
        expect(errorsByField(childSchema, { ...valid, schoolGrade: "11 класс" })).toEqual({})
    })

    it("rejects a grade outside the list", () => {
        expect(
            Object.keys(errorsByField(childSchema, { ...valid, schoolGrade: "12 класс" }))
        ).toEqual(["schoolGrade"])
    })

    it("requires the name and the birth date", () => {
        expect(errorsByField(childSchema, { name: "  ", birthdate: "" })).toEqual({
            name: ["Укажите имя"],
            birthdate: ["Укажите дату рождения"]
        })
    })
})
