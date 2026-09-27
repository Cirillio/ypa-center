import { mockNuxtImport } from "@nuxt/test-utils/runtime"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useCabinetChildren } from "~/composables/useCabinetChildren"
import type { ActiveEnrollmentDto, MeChild, MeProfile, NewChild } from "~/types"
import { withSetup } from "../fixtures/with-setup"

const mocks = vi.hoisted(() => ({
    addChild: vi.fn<(dto: NewChild) => Promise<MeChild>>(),
    deleteChild: vi.fn<(id: string) => Promise<void>>()
}))

mockNuxtImport("useMeService", () => () => ({
    addChild: mocks.addChild,
    deleteChild: mocks.deleteChild
}))

const profile: MeProfile = {
    parent: { name: "Анна", phone: "+79131234567", email: "anna@example.com" },
    children: [{ id: "11", name: "Петя", birthdate: "2018-05-20" }],
    isComplete: true
}

const enrollment = (overrides: Partial<ActiveEnrollmentDto>): ActiveEnrollmentDto => ({
    id: 1,
    type: "REGULAR",
    status: "ACTIVE",
    activity_name: "Шахматы",
    group_name: "Младшая",
    subscription_id: 5,
    trial_date: null,
    ...overrides
})

const conflict = (enrollments: ActiveEnrollmentDto[]) => ({
    status: 409,
    data: {
        status: 409,
        title: "Conflict",
        code: "CHILD_HAS_ACTIVE_ENROLLMENTS",
        extensions: { active_enrollments: enrollments }
    }
})

beforeEach(() => {
    mocks.addChild
        .mockReset()
        .mockResolvedValue({ id: "12", name: "Маша", birthdate: "2019-01-01" })
    mocks.deleteChild.mockReset().mockResolvedValue(undefined)
})

describe("useCabinetChildren", () => {
    it("derives the list from the profile", async () => {
        const { children } = await withSetup(() => useCabinetChildren(() => profile))
        expect(children.value).toEqual(profile.children)
        const empty = await withSetup(() => useCabinetChildren(() => null))
        expect(empty.children.value).toEqual([])
    })

    it("adds a child and refreshes the profile", async () => {
        const refresh = vi.fn(async () => {})
        const api = await withSetup(() => useCabinetChildren(() => profile, refresh))
        await api.addChild({ name: "Маша", birthdate: "2019-01-01" })

        expect(mocks.addChild).toHaveBeenCalledWith({ name: "Маша", birthdate: "2019-01-01" })
        expect(refresh).toHaveBeenCalledOnce()
        expect(api.isSaving.value).toBe(false)
    })

    it("rethrows an add error and keeps the message", async () => {
        mocks.addChild.mockRejectedValue(new Error("Нет связи"))
        const api = await withSetup(() => useCabinetChildren(() => profile))
        await expect(api.addChild({ name: "Маша", birthdate: "2019-01-01" })).rejects.toThrow(
            "Нет связи"
        )
        expect(api.error.value).toBe("Нет связи")
    })

    it("deletes a child", async () => {
        const refresh = vi.fn(async () => {})
        const api = await withSetup(() => useCabinetChildren(() => profile, refresh))
        await expect(api.deleteChild("11")).resolves.toBe(true)
        expect(refresh).toHaveBeenCalledOnce()
    })

    it("turns a 409 into readable blockers instead of an error", async () => {
        mocks.deleteChild.mockRejectedValue(
            conflict([
                enrollment({}),
                enrollment({ id: 2, status: "HELD" }),
                enrollment({
                    id: 3,
                    type: "TRIAL",
                    status: "ACTIVE",
                    trial_date: "2026-10-05",
                    group_name: ""
                }),
                enrollment({ id: 4, type: "TRIAL", status: "HELD", trial_date: null })
            ])
        )
        const api = await withSetup(() => useCabinetChildren(() => profile))

        await expect(api.deleteChild("11")).resolves.toBe(false)
        expect(api.deleteError.value).toBeNull()
        expect(api.deleteBlockers.value).toEqual([
            { key: "REGULAR-1", title: "Шахматы, Младшая", detail: "Действующий абонемент" },
            { key: "REGULAR-2", title: "Шахматы, Младшая", detail: "Абонемент ждёт оплаты" },
            { key: "TRIAL-3", title: "Шахматы", detail: "Предстоящее пробное · 05.10.2026" },
            { key: "TRIAL-4", title: "Шахматы, Младшая", detail: "Пробное ждёт оплаты" }
        ])
    })

    it("shows other delete errors as text", async () => {
        mocks.deleteChild.mockRejectedValue({
            status: 500,
            data: { status: 500, title: "Ошибка", detail: "Сервер недоступен" }
        })
        const api = await withSetup(() => useCabinetChildren(() => profile))

        await expect(api.deleteChild("11")).resolves.toBe(false)
        expect(api.deleteError.value).toBe("Сервер недоступен")
        expect(api.deleteBlockers.value).toEqual([])
    })

    it("clears the previous result on a new attempt and on reset", async () => {
        mocks.deleteChild.mockRejectedValueOnce(conflict([enrollment({})]))
        const api = await withSetup(() => useCabinetChildren(() => profile))
        await api.deleteChild("11")
        expect(api.deleteBlockers.value).toHaveLength(1)

        api.resetDeleteState()
        expect(api.deleteBlockers.value).toEqual([])
    })

    it("ignores a second delete while the first is running", async () => {
        let release: () => void = () => {}
        mocks.deleteChild.mockImplementation(
            () => new Promise<void>((resolve) => (release = resolve))
        )
        const api = await withSetup(() => useCabinetChildren(() => profile))

        const first = api.deleteChild("11")
        await expect(api.deleteChild("11")).resolves.toBe(false)
        release()
        await expect(first).resolves.toBe(true)
        expect(mocks.deleteChild).toHaveBeenCalledOnce()
    })
})
