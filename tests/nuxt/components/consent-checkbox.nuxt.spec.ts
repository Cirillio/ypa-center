import { mountSuspended } from "@nuxt/test-utils/runtime"
import { describe, expect, it } from "vitest"
import ConsentCheckbox from "~/components/ui/ConsentCheckbox.vue"

describe("UiConsentCheckbox", () => {
    it("links the consent text to /consent and the policy text to /privacy", async () => {
        const wrapper = await mountSuspended(ConsentCheckbox, { props: { modelValue: false } })
        const links = wrapper.findAll("a").map((a) => [a.text(), a.attributes("href")])

        expect(links).toEqual([
            ["обработку персональных данных", "/consent"],
            ["политику обработки", "/privacy"]
        ])
        for (const a of wrapper.findAll("a")) expect(a.attributes("target")).toBe("_blank")
    })

    it("is unchecked by default and reports true only when ticked", async () => {
        const wrapper = await mountSuspended(ConsentCheckbox, { props: { modelValue: false } })
        const box = wrapper.get('[role="checkbox"]')
        expect(box.attributes("aria-checked")).toBe("false")

        await box.trigger("click")
        expect(wrapper.emitted("update:modelValue")).toEqual([[true]])
    })
})
