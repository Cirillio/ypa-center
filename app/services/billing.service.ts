import type { ApiFetch } from "~/composables/useApi"
import type {
    CheckoutTransaction,
    CheckoutResponse,
    CheckoutSubscriptionRequest,
    CheckoutTransactionDto,
    CheckoutTrialRequest,
    EventCheckoutTransactionDto
} from "~/types"

// ПОЧЕМУ заголовок отдельно от тела: бэк склеивает повтор по ключу и сверяет тело (409 при расхождении)
const IDEMPOTENCY_HEADER = "X-Idempotency-Key"

// Маппит статус транзакции бэка в модель экрана результата (копейки → рубли, camelCase).
function toCheckoutTransaction(dto: CheckoutTransactionDto): CheckoutTransaction {
    return {
        id: dto.id,
        status: dto.status,
        type: dto.type,
        // ПОЧЕМУ гард по статусу: причина осмысленна только у REFUND
        reason: dto.status === "REFUND" ? dto.reason : null,
        amount: kopecksToRubles(dto.amount),
        expiresAt: dto.expires_at,
        order: {
            kind: "purchase",
            title: dto.order.title,
            studentName: dto.order.student_name,
            trialDate: dto.order.trial_date,
            slots: dto.order.slots.map((slot) => ({
                scheduleId: slot.schedule_id,
                activityName: slot.activity_name,
                groupName: slot.group_name,
                dayOfWeek: slot.day_of_week,
                startTime: slot.start_time.slice(0, 5),
                endTime: slot.end_time.slice(0, 5)
            }))
        }
    }
}

// Маппит публичный статус оплаты события: та же модель экрана, заказ – вариант event.
function toEventTransaction(dto: EventCheckoutTransactionDto): CheckoutTransaction {
    return {
        id: dto.id,
        status: dto.status,
        type: dto.type,
        reason: dto.status === "REFUND" ? dto.reason : null,
        amount: kopecksToRubles(dto.amount),
        expiresAt: dto.expires_at,
        order: {
            kind: "event",
            eventId: dto.order.event_id,
            title: dto.order.title,
            startsAt: dto.order.starts_at,
            attendeesCount: dto.order.attendees_count
        }
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
        const dto = await this.fetch<CheckoutTransactionDto>(
            `/v1/checkout/transactions/${encodeURIComponent(txId)}`
        )
        return toCheckoutTransaction(dto)
    }

    /** GET /api/v1/public/events/payments/{txId}/ – без входа: оплату события делает гость */
    async getEventPaymentStatus(txId: string): Promise<CheckoutTransaction> {
        const dto = await this.fetch<EventCheckoutTransactionDto>(
            `/v1/public/events/payments/${encodeURIComponent(txId)}/`
        )
        return toEventTransaction(dto)
    }
}

export const useBillingService = () => new BillingService(useApi().apiFetch)
