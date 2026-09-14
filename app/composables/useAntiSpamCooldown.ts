import { useStorage } from "@vueuse/core"

/**
 * Anti-Spam кулдаун между отправками формы, переживает reload (localStorage).
 * storageKey должен быть уникален на форму — иначе кулдаун одной формы
 * заблокирует другую.
 */
export function useAntiSpamCooldown(storageKey: string, minutes = 5) {
    const cooldownUntil = useStorage<number>(storageKey, 0)
    const isSpamBlocked = computed(() => Date.now() < cooldownUntil.value)

    const triggerCooldown = () => {
        cooldownUntil.value = Date.now() + minutes * 60 * 1000
    }

    return { isSpamBlocked, triggerCooldown }
}
