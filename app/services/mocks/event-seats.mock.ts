// Мок-обогащение афиши событий свободными местами до появления поля в EventPublic на бэке.
import type { EventPublic } from "~/types"

export interface EventWithSeatsDraftDto extends EventPublic {
    available_seats: number
}

const MOCK_SEATS_BY_ID: Record<number, number> = {
    1: 3,
    2: 7,
    3: 14,
    4: 14,
    5: 0
}

const FALLBACK_SEATS = [7, 3, 14, 0]

// Подставляет детерминированное число свободных мест для каждого события афиши.
export function applyMockEventSeats(events: EventPublic[]): EventWithSeatsDraftDto[] {
    return events.map((event, index) => {
        const rawSeats =
            MOCK_SEATS_BY_ID[event.id] ?? FALLBACK_SEATS[index % FALLBACK_SEATS.length] ?? 0
        return {
            ...event,
            available_seats: Math.min(Math.max(0, rawSeats), event.capacity)
        }
    })
}
