import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime"
import { describe, expect, it } from "vitest"
import { computed } from "vue"
import ConsentCheckbox from "~/components/ui/ConsentCheckbox.vue"

// Вошедший родитель уже дал согласие при регистрации
mockNuxtImport("useStoredConsent", () => () => computed(() => true))

describe("UiConsentCheckbox with consent from registration", () => {
    it("hides the checkbox and reports the stored consent to the form", async () => {
        const wrapper = await mountSuspended(ConsentCheckbox, { props: { modelValue: false } })

        expect(wrapper.find('[role="checkbox"]').exists()).toBe(false)
        expect(wrapper.emitted("update:modelValue")).toEqual([[true]])
    })
})
