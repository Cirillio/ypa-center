import type {
    CheckoutError,
    CheckoutResultKind,
    CheckoutTransaction,
    CheckoutTransactionStatus,
    TransactionViewState
} from "~/types"

const POLL_INTERVAL_MS = 2000
// ПОЧЕМУ запас: зависший заказ снимает свипер раз в 5 минут после expires_at (checkout-flow.md §7)
const GRACE_AFTER_EXPIRY_MS = 5 * 60_000
// Пока статус ни разу не получен (сеть, 5xx), дедлайна от бэка нет – ограничиваемся этим окном
const NO_RESPONSE_LIMIT_MS = 60_000

// Экран для каждого окончательного статуса транзакции
const FINAL_VIEW: Readonly<
    Record<Exclude<CheckoutTransactionStatus, "PENDING">, TransactionViewState>
> = {
    SUCCEEDED: "success",
    CANCELED: "canceled",
    REFUND: "refund"
}

// Статусы, при которых опрашивать бессмысленно: транзакции нет или она не наша
const TERMINAL_HTTP_STATUSES: ReadonlySet<number> = new Set([403, 404])

// Опрос статуса оплаты для экрана результата; txId и источник берутся один раз, страница живёт под одну транзакцию.
export function useTransactionStatus(txId: string, kind: CheckoutResultKind = "purchase") {
    const billing = useBillingService()
    // ПОЧЕМУ два источника: оплату события делает гость, её статус – на публичной ручке без ПД
    const fetchStatus = (id: string) =>
        kind === "event" ? billing.getEventPaymentStatus(id) : billing.getTransactionStatus(id)

    const viewState = ref<TransactionViewState>("pending")
    const transaction = ref<CheckoutTransaction | null>(null)
    const error = ref<CheckoutError | null>(null)

    let deadline = Date.now() + NO_RESPONSE_LIMIT_MS
    let timer: ReturnType<typeof setTimeout> | null = null
    let isDisposed = false

    // Планирует следующий опрос или объявляет таймаут, когда дедлайн прошёл.
    function scheduleNext(delayMs: number) {
        if (isDisposed) return
        if (Date.now() + delayMs > deadline) {
            viewState.value = "timeout"
            return
        }
        timer = setTimeout(() => void poll(), delayMs)
    }

    // Один опрос: терминальный статус останавливает цикл, PENDING и временные сбои – продолжают.
    async function poll() {
        try {
            const tx = await fetchStatus(txId)
            if (isDisposed) return
            transaction.value = tx
            if (tx.status !== "PENDING") {
                viewState.value = FINAL_VIEW[tx.status]
                return
            }
            const expiresAt = Date.parse(tx.expiresAt)
            if (!Number.isNaN(expiresAt)) deadline = expiresAt + GRACE_AFTER_EXPIRY_MS
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
            // ПОЧЕМУ: сеть и 5xx временные – ждём, сколько просит бэк, в пределах дедлайна
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
