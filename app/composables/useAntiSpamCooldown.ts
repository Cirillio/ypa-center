import { useIntervalFn, useStorage } from "@vueuse/core"

/**
 * Anti-Spam кулдаун между отправками формы, переживает reload (localStorage).
 * storageKey должен быть уникален на форму – иначе кулдаун одной формы
 * заблокирует другую.
 */
export function useAntiSpamCooldown(storageKey: string, minutes = 5) {
    const cooldownUntil = useStorage<number>(storageKey, 0)

    // ПОЧЕМУ: Date.now() не реактивен – без тика computed закэширует «заблокировано»
    // и кнопка останется в «Ожидайте...» до перезагрузки. На сервере интервал не стартует.
    const now = ref<number>(Date.now())
    useIntervalFn(() => {
        now.value = Date.now()
    }, 1000)

    const isSpamBlocked = computed(() => now.value < cooldownUntil.value)

    const triggerCooldown = () => {
        cooldownUntil.value = Date.now() + minutes * 60 * 1000
    }

    return { isSpamBlocked, triggerCooldown }
}
