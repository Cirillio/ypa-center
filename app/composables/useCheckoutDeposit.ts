// Депозит в оформлении абонемента: баланс только родителю и после монтирования, честный расчёт списания.
export function useCheckoutDeposit(getPrice: () => number | null) {
    const authStore = useAuthStore()
    const me = useMeService()

    // ПОЧЕМУ ключ как в кабинете: один вызов – один ключ, баланс общий с шапкой /me
    const { data, execute } = useAsyncData("me-deposit", () => me.getDepositBalance(), {
        server: false,
        immediate: false
    })

    const useDeposit = ref<boolean>(false)

    const balance = computed<number>(() => data.value ?? 0)
    // Бэк списывает min(баланс, цена) – повторяем ту же формулу, чтобы сводка не врала
    const applied = computed<number>(() => {
        const price = getPrice()
        return useDeposit.value && price !== null ? Math.min(balance.value, price) : 0
    })
    const toPay = computed<number | null>(() => {
        const price = getPrice()
        return price !== null ? price - applied.value : null
    })

    // ПОЧЕМУ после монтирования: гость без токена получил бы 401 и редирект на /login с публичной страницы
    onMounted(() => {
        authStore.hydrate()
        if (authStore.isAuthed) void execute()
    })

    return { balance, useDeposit, applied, toPay }
}
