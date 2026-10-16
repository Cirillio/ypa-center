import { mountSuspended } from "@nuxt/test-utils/runtime"
import { afterEach, describe, expect, it, vi } from "vitest"
import ChildForm from "~/components/me/ChildForm.vue"
import Children from "~/components/me/parent/Children.vue"
import Header from "~/components/me/parent/Header.vue"

afterEach(() => {
    vi.useRealTimers()
})

describe("MeParentHeader", () => {
    it("greets by the given name according to the Novosibirsk time of day", async () => {
        // 02:00 UTC = 09:00 в Новосибирске
        vi.useFakeTimers({ toFake: ["Date"] })
        vi.setSystemTime(new Date("2026-10-16T02:00:00Z"))
        const wrapper = await mountSuspended(Header, {
            props: { parentName: "Петрова Елизавета Михайловна" }
        })

        expect(wrapper.get("h1").text()).toBe("Доброе утро, Елизавета")
    })

    it("falls back to the plain title without a name", async () => {
        const wrapper = await mountSuspended(Header, { props: { parentName: "" } })
        expect(wrapper.get("h1").text()).toBe("Личный кабинет")
    })

    it("asks to confirm the logout instead of logging out at once", async () => {
        const wrapper = await mountSuspended(Header, { props: { parentName: "Анна" } })
        const logout = wrapper.findAll("button").find((b) => b.text().includes("Выйти"))
        await logout?.trigger("click")

        expect(wrapper.emitted("logout")).toHaveLength(1)
    })
})

describe("MeChildForm", () => {
    it("shows field errors on save and does not emit an empty child", async () => {
        const wrapper = await mountSuspended(ChildForm, { props: { isSaving: false } })
        await wrapper.get("form").trigger("submit")

        await vi.waitFor(() => expect(wrapper.text()).toContain("Укажите имя"))
        expect(wrapper.text()).toContain("Укажите дату рождения")
        expect(wrapper.emitted("submit")).toBeUndefined()
    })

    it("emits the trimmed name and the birth date when the grade is skipped", async () => {
        const wrapper = await mountSuspended(ChildForm, { props: { isSaving: false } })
        await wrapper.get('input[type="text"]').setValue("  Петя ")
        await wrapper.get('input[type="date"]').setValue("2018-05-20")
        await wrapper.get("form").trigger("submit")

        await vi.waitFor(() =>
            expect(wrapper.emitted("submit")).toEqual([[{ name: "Петя", birthdate: "2018-05-20" }]])
        )
    })

    it("lets the parent cancel", async () => {
        const wrapper = await mountSuspended(ChildForm, { props: { isSaving: false } })
        await wrapper.get('button[aria-label="Отмена"]').trigger("click")
        expect(wrapper.emitted("cancel")).toHaveLength(1)
    })
})

describe("MeParentChildren", () => {
    it("shows the grade next to the child's name when it is known", async () => {
        const wrapper = await mountSuspended(Children, {
            props: {
                isProcessing: false,
                isSaving: false,
                children: [
                    { id: "1", name: "Петя", birthdate: "2018-05-20", schoolGrade: "2 класс" },
                    { id: "2", name: "Маша", birthdate: "2020-01-01" }
                ]
            }
        })

        const text = wrapper.text().replace(/\s+/g, " ")
        expect(text).toContain("Петя · 2 класс")
        expect(text).not.toContain("Маша ·")
    })
})
