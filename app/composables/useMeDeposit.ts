// Баланс депозита сразу, история движений – лениво, при первом открытии поповера.
export function useMeDeposit() {
    const me = useMeService()

    const balance = useAsyncData("me-deposit", () => me.getDepositBalance(), { server: false })
    const entries = usePagedList("me-deposit-entries", (query) => me.getDepositEntriesPage(query), {
        pageSize: 10,
        immediate: false
    })

    // Первое открытие грузит историю, повторные берут уже загруженное.
    async function ensureEntries(): Promise<void> {
        if (entries.status.value === "idle") await entries.execute()
    }

    return { balance, entries, ensureEntries }
}
