import { nextTick } from "vue"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useAntiSpamCooldown } from "~/composables/useAntiSpamCooldown"
import { useOtpTimer } from "~/composables/useOtpTimer"

beforeEach(() => {
    vi.useFakeTimers({ now: new Date("2026-09-28T10:00:00Z") })
    localStorage.clear()
})

afterEach(() => {
    vi.useRealTimers()
})

describe("useAntiSpamCooldown", () => {
    it("is not blocked before the first submit", () => {
        expect(useAntiSpamCooldown("test_cooldown_a").isSpamBlocked.value).toBe(false)
    })

    it("blocks right after a submit", () => {
        const { isSpamBlocked, triggerCooldown } = useAntiSpamCooldown("test_cooldown_b", 5)
        triggerCooldown()
        expect(isSpamBlocked.value).toBe(true)
    })

    it("unblocks by itself when the cooldown runs out, without a reload", async () => {
        const { isSpamBlocked, triggerCooldown } = useAntiSpamCooldown("test_cooldown_c", 5)
        triggerCooldown()
        expect(isSpamBlocked.value).toBe(true)

        await vi.advanceTimersByTimeAsync(5 * 60 * 1000 + 1_000)
        expect(isSpamBlocked.value).toBe(false)
    })

    it("survives a reload (the deadline lives in localStorage)", async () => {
        useAntiSpamCooldown("test_cooldown_d", 5).triggerCooldown()
        // useStorage пишет в localStorage после тика
        await nextTick()
        expect(useAntiSpamCooldown("test_cooldown_d", 5).isSpamBlocked.value).toBe(true)
    })

    it("keeps forms independent", () => {
        useAntiSpamCooldown("test_cooldown_e", 5).triggerCooldown()
        expect(useAntiSpamCooldown("test_cooldown_f", 5).isSpamBlocked.value).toBe(false)
    })
})

describe("useOtpTimer", () => {
    it("allows a resend before the timer starts", () => {
        const timer = useOtpTimer(60)
        expect(timer.secondsLeft.value).toBe(0)
        expect(timer.canResend.value).toBe(true)
    })

    it("counts down once per second and unlocks the resend at zero", async () => {
        const timer = useOtpTimer(60)
        timer.startTimer(3)
        expect(timer.canResend.value).toBe(false)

        await vi.advanceTimersByTimeAsync(1_000)
        expect(timer.secondsLeft.value).toBe(2)

        await vi.advanceTimersByTimeAsync(2_000)
        expect(timer.secondsLeft.value).toBe(0)
        expect(timer.canResend.value).toBe(true)

        await vi.advanceTimersByTimeAsync(5_000)
        expect(timer.secondsLeft.value).toBe(0)
    })

    it("uses the default duration when none is given", () => {
        const timer = useOtpTimer(60)
        timer.startTimer()
        expect(timer.secondsLeft.value).toBe(60)
    })

    it("resets immediately", async () => {
        const timer = useOtpTimer(60)
        timer.startTimer(10)
        timer.resetTimer()
        expect(timer.canResend.value).toBe(true)
        await vi.advanceTimersByTimeAsync(3_000)
        expect(timer.secondsLeft.value).toBe(0)
    })
})
