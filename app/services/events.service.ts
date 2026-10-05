import type { ApiFetch } from "~/composables/useApi"
import { applyMockEventSeats, type EventWithSeatsDraftDto } from "~/services/mocks/event-seats.mock"
import type {
    EventItem,
    EventPublic,
    EventRegistrationOutcome,
    EventRegistrationRequest,
    EventRegistrationResultDto
} from "~/types"

const IDEMPOTENCY_HEADER = "X-Idempotency-Key"

// Различает ответ брони: у платного события есть transaction_id, у бесплатного – только status.
function toRegistrationOutcome(dto: EventRegistrationResultDto): EventRegistrationOutcome {
    if (!("transaction_id" in dto)) return { kind: "accepted" }
    return {
        kind: "payment",
        transactionId: dto.transaction_id,
        paymentUrl: dto.payment_url,
        expiresAt: dto.expires_at
    }
}

// Маппит черновик DTO события со свободными местами в доменную модель EventItem.
function toEventItem(dto: EventWithSeatsDraftDto): EventItem {
    const { available_seats, ...rest } = dto
    return {
        ...rest,
        availableSeats: available_seats
    }
}

/**
 * Афиша событий.
 * Эндпоинт: GET /api/v1/public/events/
 */
export class EventsService {
    constructor(private readonly fetch: ApiFetch) {}

    /** GET /api/v1/public/events/ */
    async getAll(): Promise<EventItem[]> {
        const events = await this.fetch<EventPublic[]>("/v1/public/events/")
        // MOCK(event-seats): в EventPublic пока нет остатка мест, обогащаем моком
        return applyMockEventSeats(events).map(toEventItem)
    }

    /**
     * POST /api/v1/public/events/{eventId}/register/ – бронь без входа; токен, если есть, привяжет её к ЛК.
     * Ключ идемпотентности передаётся только для платного события.
     */
    async register(
        eventId: number,
        payload: EventRegistrationRequest,
        idempotencyKey?: string
    ): Promise<EventRegistrationOutcome> {
        const dto = await this.fetch<EventRegistrationResultDto>(
            `/v1/public/events/${eventId}/register/`,
            {
                method: "POST",
                body: payload,
                ...(idempotencyKey ? { headers: { [IDEMPOTENCY_HEADER]: idempotencyKey } } : {})
            }
        )
        return toRegistrationOutcome(dto)
    }
}

export const useEventsService = () => new EventsService(useApi().apiFetch)
