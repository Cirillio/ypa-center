import { mountSuspended } from "@nuxt/test-utils/runtime"
import { afterEach, describe, expect, it } from "vitest"
import ChildDeleteConfirm from "~/components/me/parent/ChildDeleteConfirm.vue"
import type { MeChildBlocker } from "~/types"

// UModal рендерится телепортом в body – проверяем документ, а не обёртку
const dialogText = () => document.body.textContent ?? ""
const dialogButtons = () =>
    [...document.body.querySelectorAll("button")].map((b) => b.textContent?.trim() ?? "")

const mountConfirm = (
    props: { blockers?: MeChildBlocker[]; error?: string | null; isDeleting?: boolean } = {}
) =>
    mountSuspended(ChildDeleteConfirm, {
        props: {
            open: true,
            childName: "Петю",
            isDeleting: props.isDeleting ?? false,
            blockers: props.blockers ?? [],
            error: props.error ?? null
        },
        attachTo: document.body
    })

afterEach(() => {
    document.body.innerHTML = ""
})

describe("MeParentChildDeleteConfirm", () => {
    it("asks for confirmation and emits confirm on delete", async () => {
        const wrapper = await mountConfirm()
        expect(dialogText()).toContain("Удалить Петю?")

        const remove = [...document.body.querySelectorAll("button")].find(
            (b) => b.textContent?.trim() === "Удалить"
        )
        remove?.click()
        expect(wrapper.emitted("confirm")).toHaveLength(1)
    })

    it("replaces the delete button with the list of live enrollments on 409", async () => {
        await mountConfirm({
            blockers: [
                { key: "REGULAR-1", title: "Шахматы, Младшая", detail: "Действующий абонемент" },
                {
                    key: "TRIAL-3",
                    title: "Робототехника",
                    detail: "Предстоящее пробное · 05.10.2026"
                }
            ]
        })

        expect(dialogText()).toContain("Удалить пока нельзя")
        expect(dialogText()).toContain("Шахматы, Младшая")
        expect(dialogText()).toContain("Предстоящее пробное · 05.10.2026")
        expect(dialogButtons()).toContain("Понятно")
        expect(dialogButtons()).not.toContain("Удалить")
    })

    it("shows a delete error next to the confirmation", async () => {
        await mountConfirm({ error: "Сервер недоступен" })
        expect(dialogText()).toContain("Сервер недоступен")
    })
})
