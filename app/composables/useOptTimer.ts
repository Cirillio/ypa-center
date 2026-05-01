import { useIntervalFn } from "@vueuse/core"

export const useOtpTimer = (initialSeconds = 5) => {
    const secondsLeft = ref(0)

    const canResend = computed(() => secondsLeft.value === 0)

    const { pause, resume } = useIntervalFn(
        () => {
            if (secondsLeft.value > 0) {
                secondsLeft.value--
            } else {
                pause()
            }
        },
        1000,
        { immediate: false }
    )

    const startTimer = () => {
        secondsLeft.value = initialSeconds
        resume()
    }

    const resetTimer = () => {
        secondsLeft.value = 0
        pause()
    }

    return {
        secondsLeft: readonly(secondsLeft),
        canResend,
        startTimer,
        resetTimer
    }
}
