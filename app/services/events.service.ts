import type { ApiFetch } from "~/composables/useApi"
import { applyMockEventSeats, type EventWithSeatsDraftDto } from "~/services/mocks/event-seats.mock"
import type { EventItem, EventPublic, EventRegistrationRequest } from "~/types"

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

    /** POST /api/v1/public/events/{eventId}/register/ – бронь без входа; токен, если есть, привяжет её к ЛК */
    async register(eventId: number, payload: EventRegistrationRequest): Promise<void> {
        await this.fetch(`/v1/public/events/${eventId}/register/`, {
            method: "POST",
            body: payload
        })
    }
}

export const useEventsService = () => new EventsService(useApi().apiFetch)
