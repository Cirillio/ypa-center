import { describe, expect, it } from "vitest"
import type { ActiveEnrollmentDto } from "~/types"
import {
    getActiveEnrollments,
    getFetchStatus,
    getProblem,
    getProblemCode,
    parseApiError
} from "~/utils/parse-error"

// Форма ошибки ofetch (FetchError): тело RFC 9457 лежит в data, статус – в status/statusCode
const fetchError = (data: unknown, status = 400) => ({ status, statusCode: status, data })

const problemBody = (overrides: Record<string, unknown> = {}) => ({
    type: "urn:problem-type:validationerror",
    title: "Validation Error",
    status: 400,
    detail: "Проверьте поля формы",
    ...overrides
})

const enrollment: ActiveEnrollmentDto = {
    id: 7,
    type: "TRIAL",
    status: "ACTIVE",
    activity_name: "Шахматы",
    group_name: "Младшая",
    subscription_id: null,
    trial_date: "2026-10-01"
}

describe("getProblem", () => {
    it("parses a valid RFC 9457 body", () => {
        expect(
            getProblem(fetchError(problemBody({ code: "VALIDATION_ERROR", instance: "/x" })))
        ).toEqual({
            type: "urn:problem-type:validationerror",
            title: "Validation Error",
            status: 400,
            detail: "Проверьте поля формы",
            code: "VALIDATION_ERROR",
            instance: "/x",
            extensions: undefined
        })
    })

    it("fills missing optional string fields with safe defaults", () => {
        expect(getProblem(fetchError({ title: "Oops", status: 500 }))).toMatchObject({
            type: "",
            detail: "",
            code: undefined
        })
    })

    it.each([
        ["not an object", "boom"],
        ["null", null],
        ["no data", { status: 500 }],
        ["data without status", fetchError({ title: "x" })],
        ["data without title", fetchError({ status: 400 })],
        ["status of wrong type", fetchError({ title: "x", status: "400" })]
    ])("returns null for %s", (_label, err) => {
        expect(getProblem(err)).toBeNull()
    })

    it("drops malformed extension entries instead of leaking them into the UI", () => {
        const problem = getProblem(
            fetchError(
                problemBody({
                    extensions: {
                        request_id: 123,
                        invalid_params: [
                            { name: "phone", reason: "Неверный номер" },
                            { name: 1 },
                            "x"
                        ],
                        active_enrollments: [enrollment, { id: "7" }, null]
                    }
                })
            )
        )
        expect(problem?.extensions).toEqual({
            request_id: undefined,
            invalid_params: [{ name: "phone", reason: "Неверный номер" }],
            active_enrollments: [enrollment]
        })
    })
})

describe("getProblemCode", () => {
    it("returns a known code", () => {
        expect(getProblemCode(fetchError(problemBody({ code: "TRIAL_LIMIT_EXCEEDED" }), 409))).toBe(
            "TRIAL_LIMIT_EXCEEDED"
        )
    })

    it("returns undefined for an unknown code", () => {
        expect(getProblemCode(fetchError(problemBody({ code: "SOMETHING_NEW" })))).toBeUndefined()
    })

    it("returns undefined when there is no problem body", () => {
        expect(getProblemCode(new Error("Network down"))).toBeUndefined()
    })

    it("recognises PROFILE_INCOMPLETE by type when the backend omits code", () => {
        const err = fetchError(problemBody({ type: "urn:problem-type:profileincomplete" }), 403)
        expect(getProblemCode(err)).toBe("PROFILE_INCOMPLETE")
    })

    it("prefers code over type", () => {
        const err = fetchError(
            problemBody({ type: "urn:problem-type:profileincomplete", code: "AUTH_REQUIRED" }),
            401
        )
        expect(getProblemCode(err)).toBe("AUTH_REQUIRED")
    })
})

describe("getActiveEnrollments", () => {
    it("returns enrollments from a 409 CHILD_HAS_ACTIVE_ENROLLMENTS", () => {
        const err = fetchError(
            problemBody({
                code: "CHILD_HAS_ACTIVE_ENROLLMENTS",
                status: 409,
                extensions: { active_enrollments: [enrollment] }
            }),
            409
        )
        expect(getActiveEnrollments(err)).toEqual([enrollment])
    })

    it("returns an empty list when there are none or the error is not a problem", () => {
        expect(getActiveEnrollments(fetchError(problemBody()))).toEqual([])
        expect(getActiveEnrollments(new Error("x"))).toEqual([])
    })
})

describe("parseApiError", () => {
    it("reports a network error with the Error message", () => {
        expect(parseApiError(new Error("Failed to fetch"))).toEqual({
            title: "Ошибка сети",
            description: "Failed to fetch"
        })
    })

    it("uses the fallback message for a non-Error without a body", () => {
        expect(parseApiError("boom", "Не удалось отправить")).toEqual({
            title: "Ошибка сети",
            description: "Не удалось отправить"
        })
    })

    it("joins invalid_params reasons under the detail", () => {
        const err = fetchError(
            problemBody({
                extensions: {
                    invalid_params: [
                        { name: "phone", reason: "Неверный номер." },
                        { name: "email", reason: "Неверная почта." }
                    ]
                }
            })
        )
        expect(parseApiError(err)).toEqual({
            title: "Проверьте поля формы",
            description: "Неверный номер. Неверная почта."
        })
    })

    it("uses title and detail for an ordinary problem", () => {
        expect(
            parseApiError(
                fetchError(problemBody({ title: "Нет мест", detail: "Группа заполнена" }))
            )
        ).toEqual({
            title: "Нет мест",
            description: "Группа заполнена"
        })
    })

    it("falls back when detail is empty", () => {
        expect(
            parseApiError(fetchError({ title: "Ошибка сервера", status: 500 }), "Попробуйте позже")
        ).toEqual({
            title: "Ошибка сервера",
            description: "Попробуйте позже"
        })
    })
})

describe("getFetchStatus", () => {
    it.each([
        ["status", { status: 404 }, 404],
        ["statusCode", { statusCode: 409 }, 409],
        ["response.status", { response: { status: 401 } }, 401],
        ["nothing", { message: "x" }, undefined],
        ["non-object", "x", undefined],
        ["null", null, undefined]
    ])("reads %s", (_label, err, expected) => {
        expect(getFetchStatus(err)).toBe(expected)
    })
})
