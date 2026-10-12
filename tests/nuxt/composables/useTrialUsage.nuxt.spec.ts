import { mockNuxtImport } from "@nuxt/test-utils/runtime"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { ref } from "vue"
import { useTrialUsage } from "~/composables/useTrialUsage"
import type { TrialUsage } from "~/types"
import { withSetup } from "../fixtures/with-setup"

const mocks = vi.hoisted(() => ({
    getTrialUsages: vi.fn<() => Promise<TrialUsage[]>>()
}))

mockNuxtImport("useMeService", () => () => ({ getTrialUsages: mocks.getTrialUsages }))

beforeEach(() => {
    clearNuxtData()
    mocks.getTrialUsages.mockReset().mockResolvedValue([{ studentId: 11, activityId: 1 }])
})

describe("useTrialUsage", () => {
    it("does not ask a guest", async () => {
        const usage = await withSetup(() =>
            useTrialUsage({ isAuthed: ref(false), studentId: ref(11), activityId: ref(1) })
        )
        await new Promise((r) => setTimeout(r, 0))

        expect(mocks.getTrialUsages).not.toHaveBeenCalled()
        expect(usage.isUsed.value).toBe(false)
    })

    it("loads the bookings once the parent is known and flags a used trial", async () => {
        const isAuthed = ref(false)
        const activityId = ref<number | undefined>(2)
        const usage = await withSetup(() =>
            useTrialUsage({ isAuthed, studentId: ref(11), activityId })
        )

        isAuthed.value = true
        await vi.waitFor(() => expect(mocks.getTrialUsages).toHaveBeenCalledOnce())
        expect(usage.isUsed.value).toBe(false)

        activityId.value = 1
        await vi.waitFor(() => expect(usage.isUsed.value).toBe(true))
        expect(mocks.getTrialUsages).toHaveBeenCalledOnce()
    })

    it("can be reloaded after the checkout said the trial was used", async () => {
        mocks.getTrialUsages.mockResolvedValueOnce([])
        const usage = await withSetup(() =>
            useTrialUsage({ isAuthed: ref(true), studentId: ref(11), activityId: ref(1) })
        )
        await vi.waitFor(() => expect(mocks.getTrialUsages).toHaveBeenCalledOnce())
        expect(usage.isUsed.value).toBe(false)

        await usage.refresh()
        expect(usage.isUsed.value).toBe(true)
    })
})
