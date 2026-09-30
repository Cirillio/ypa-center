import type { CheckoutError, CheckoutTransaction, TransactionViewState } from "~/types"

const POLL_INTERVAL_MS = 2000
const MAX_ATTEMPTS = 10

// Статусы, при которых опрашивать бессмысленно: транзакции нет или она не наша
const TERMINAL_HTTP_STATUSES: ReadonlySet<number> = new Set([403, 404])

// Опрос статуса оплаты для экрана результата; txId берётся один раз, страница живёт под одну транзакцию.
export function useTransactionStatus(txId: string) {
    const billing = useBillingService()

    const viewState = ref<TransactionViewState>("pending")
    const transaction = ref<CheckoutTransaction | null>(null)
    const error = ref<CheckoutError | null>(null)

    let attempts = 0
    let timer: ReturnType<typeof setTimeout> | null = null
    let isDisposed = false

    // Планирует следующий опрос или объявляет таймаут, когда попытки кончились.
    function scheduleNext(delayMs: number) {
        if (isDisposed) return
        if (attempts >= MAX_ATTEMPTS) {
            viewState.value = "timeout"
            return
        }
        timer = setTimeout(() => void poll(), delayMs)
    }

    // Один опрос: терминальный статус останавливает цикл, PENDING и временные сбои – продолжают.
    async function poll() {
        attempts++
        try {
            const tx = await billing.getTransactionStatus(txId)
            if (isDisposed) return
            transaction.value = tx
            if (tx.status === "SUCCEEDED") {
                viewState.value = "success"
                return
            }
            if (tx.status === "CANCELED") {
                viewState.value = "canceled"
                return
            }
            scheduleNext(POLL_INTERVAL_MS)
        } catch (err) {
            if (isDisposed) return
            const status = getFetchStatus(err)
            if (status !== undefined && TERMINAL_HTTP_STATUSES.has(status)) {
                const parsed = parseApiError(err, "Транзакция не найдена")
                error.value = {
                    code: getProblemCode(err),
                    title: parsed.title,
                    description: parsed.description ?? ""
                }
                viewState.value = "error"
                return
            }
            // ПОЧЕМУ: сеть и 5xx временные – тратим попытку и ждём, сколько просит бэк
            const retryAfterMs = (getRetryAfter(err) ?? 0) * 1000
            scheduleNext(Math.max(POLL_INTERVAL_MS, retryAfterMs))
        }
    }

    onScopeDispose(() => {
        isDisposed = true
        if (timer) clearTimeout(timer)
    })

    // ПОЧЕМУ только клиент: экран под ssr: false, а таймер на сервере пережил бы запрос
    if (import.meta.client) void poll()

    return {
        viewState: readonly(viewState),
        transaction: readonly(transaction),
        error: readonly(error)
    }
}
