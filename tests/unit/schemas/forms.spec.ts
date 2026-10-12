import { describe, expect, it } from "vitest"
import { eventContactsSchema } from "~/schemas/event-contacts.schema"
import { feedbackSchema } from "~/schemas/feedback.schema"
import { profileSchema } from "~/schemas/profile.schema"
import { REFERRAL_SOURCES } from "~/constants/referral-sources"
import { errorsByField, VALID_PHONE } from "./helpers"

describe("profileSchema", () => {
    const valid = {
        fullName: "Иванова Анна",
        phone: VALID_PHONE,
        referralSource: "FRIENDS",
        consent: true
    }

    it("accepts a complete form", () => {
        expect(errorsByField(profileSchema, valid)).toEqual({})
    })

    it.each(REFERRAL_SOURCES)("accepts referral source %s", (referralSource) => {
        expect(errorsByField(profileSchema, { ...valid, referralSource })).toEqual({})
    })

    it("requires every field: an empty form reports all four", () => {
        const errors = errorsByField(profileSchema, {
            fullName: "",
            phone: "",
            referralSource: undefined,
            consent: false
        })
        expect(Object.keys(errors).sort()).toEqual([
            "consent",
            "fullName",
            "phone",
            "referralSource"
        ])
        expect(errors.referralSource).toEqual(["Пожалуйста, укажите, откуда вы о нас узнали"])
    })

    it("rejects a referral source the backend does not know", () => {
        expect(
            errorsByField(profileSchema, { ...valid, referralSource: "TV" }).referralSource
        ).toEqual(["Пожалуйста, укажите, откуда вы о нас узнали"])
    })

    it("cannot be submitted without personal-data consent", () => {
        expect(errorsByField(profileSchema, { ...valid, consent: false })).toEqual({
            consent: ["Необходимо принять условия"]
        })
    })
})

describe("feedbackSchema", () => {
    const valid = {
        name: "Анна",
        email: "parent@example.com",
        message: "Подскажите расписание на субботу",
        consent: true
    }

    it("accepts a valid message, name is optional", () => {
        expect(errorsByField(feedbackSchema, valid)).toEqual({})
        expect(errorsByField(feedbackSchema, { ...valid, name: undefined })).toEqual({})
    })

    it("limits the message to 10..1000 characters", () => {
        expect(errorsByField(feedbackSchema, { ...valid, message: "а".repeat(9) }).message).toEqual(
            ["Опишите вопрос чуть подробнее"]
        )
        expect(errorsByField(feedbackSchema, { ...valid, message: "а".repeat(10) })).toEqual({})
        expect(errorsByField(feedbackSchema, { ...valid, message: "а".repeat(1000) })).toEqual({})
        expect(
            errorsByField(feedbackSchema, { ...valid, message: "а".repeat(1001) }).message
        ).toEqual(["Сообщение слишком длинное"])
    })

    it("requires consent", () => {
        expect(errorsByField(feedbackSchema, { ...valid, consent: false })).toEqual({
            consent: ["Необходимо принять условия"]
        })
    })
})

describe("eventContactsSchema", () => {
    const valid = {
        parentName: "Анна",
        childName: "Маша",
        phone: VALID_PHONE,
        email: "parent@example.com",
        consent: true
    }

    it("accepts valid contacts and trims both names", () => {
        const result = eventContactsSchema.safeParse({
            ...valid,
            parentName: "  Анна  ",
            childName: " Маша, Ваня "
        })
        expect(result.success && result.data.parentName).toBe("Анна")
        expect(result.success && result.data.childName).toBe("Маша, Ваня")
    })

    it.each([
        ["", "Введите имя"],
        ["А", "Введите имя"],
        ["   А   ", "Введите имя"],
        ["а".repeat(101), "Слишком длинное значение"]
    ])("rejects parent name %j with %j", (parentName, message) => {
        expect(errorsByField(eventContactsSchema, { ...valid, parentName }).parentName).toEqual([
            message
        ])
    })

    it.each([
        ["", "Введите имя ребёнка"],
        ["М", "Введите имя ребёнка"],
        ["а".repeat(101), "Слишком длинное значение"]
    ])("rejects child name %j with %j", (childName, message) => {
        expect(errorsByField(eventContactsSchema, { ...valid, childName }).childName).toEqual([
            message
        ])
    })

    it("requires phone, email and consent", () => {
        const errors = errorsByField(eventContactsSchema, {
            ...valid,
            phone: "",
            email: "",
            consent: false
        })
        expect(Object.keys(errors).sort()).toEqual(["consent", "email", "phone"])
    })
})
