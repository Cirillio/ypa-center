import type { ApiFetch } from "~/composables/useApi"
import { getMockTransactionStatus } from "~/services/mocks/tx-status.mock"
import type {
    CheckoutTransaction,
    CheckoutResponse,
    CheckoutSubscriptionRequest,
    CheckoutTrialRequest,
    TransactionStatusDto
} from "~/types"

// ПОЧЕМУ заголовок отдельно от тела: бэк склеивает повтор по ключу и сверяет тело (409 при расхождении)
const IDEMPOTENCY_HEADER = "X-Idempotency-Key"

// Маппит статус транзакции бэка в модель экрана результата (копейки → рубли).
function toCheckoutTransaction(dto: TransactionStatusDto): CheckoutTransaction {
    return {
        id: dto.id,
        status: dto.status,
        type: dto.type,
        amount: kopecksToRubles(dto.amount),
        canceledReason: dto.canceled_reason
    }
}

/**
 * Оформление покупок и статус оплаты.
 * Пути чекаута строго без завершающего слэша – так их объявил бэк.
 */
export class BillingService {
    constructor(private readonly fetch: ApiFetch) {}

    /** POST /api/v1/checkout/subscription */
    checkoutSubscription(
        payload: CheckoutSubscriptionRequest,
        idempotencyKey: string
    ): Promise<CheckoutResponse> {
        return this.fetch<CheckoutResponse>("/v1/checkout/subscription", {
            method: "POST",
            headers: { [IDEMPOTENCY_HEADER]: idempotencyKey },
            body: payload
        })
    }

    /** POST /api/v1/checkout/trial */
    checkoutTrial(
        payload: CheckoutTrialRequest,
        idempotencyKey: string
    ): Promise<CheckoutResponse> {
        return this.fetch<CheckoutResponse>("/v1/checkout/trial", {
            method: "POST",
            headers: { [IDEMPOTENCY_HEADER]: idempotencyKey },
            body: payload
        })
    }

    /** GET /api/v1/checkout/transactions/{txId} */
    async getTransactionStatus(txId: string): Promise<CheckoutTransaction> {
        // MOCK(tx-status): ручки ещё нет на бэке; после выкатки –
        // this.fetch<TransactionStatusDto>(`/v1/checkout/transactions/${txId}`)
        const dto = await getMockTransactionStatus(txId)
        return toCheckoutTransaction(dto)
    }
}

export const useBillingService = () => new BillingService(useApi().apiFetch)
