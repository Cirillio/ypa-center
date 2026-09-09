import type { ApiFetch } from "~/composables/useApi"
import type { EventItem } from "~/types"

/**
 * Афиша событий.
 * Эндпоинт: GET /api/v1/public/events/
 */
export class EventsService {
    constructor(private readonly fetch: ApiFetch) {}

    getAll(): Promise<EventItem[]> {
        return this.fetch<EventItem[]>("/v1/public/events/")
    }

    // TODO: POST /v1/public/events/{event_id}/register/ — гостевая регистрация,
    // подключается вместе с расмокиванием useEventEnrollment.onSubmit
}

export const useEventsService = () => new EventsService(useApi().apiFetch)
