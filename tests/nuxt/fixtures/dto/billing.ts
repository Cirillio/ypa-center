import type { CheckoutTransactionDto, EventCheckoutTransactionDto } from "~/types"

// Транзакция абонемента/пробного – как её отдаёт GET /checkout/transactions/{id}
export const transactionDto = (
    overrides: Partial<CheckoutTransactionDto> = {}
): CheckoutTransactionDto => ({
    id: "11111111-2222-4333-8444-555555555555",
    type: "TRIAL",
    status: "SUCCEEDED",
    reason: null,
    amount: 120_000,
    created_at: "2026-10-05T16:00:00+07:00",
    expires_at: "2026-10-05T16:15:00+07:00",
    order: {
        title: "Пробное: Шахматы",
        student_name: "Маша",
        trial_date: "2026-10-12",
        slots: [
            {
                schedule_id: 7,
                activity_name: "Шахматы",
                group_name: "Младшая",
                day_of_week: 0,
                start_time: "16:00:00",
                end_time: "17:00:00"
            }
        ]
    },
    ...overrides
})

// Оплата события – как её отдаёт публичный GET /public/events/payments/{id}/
export const eventTransactionDto = (
    overrides: Partial<EventCheckoutTransactionDto> = {}
): EventCheckoutTransactionDto => ({
    id: "a1b2c3d4-e5f6-4890-9234-56789abcdef0",
    type: "EVENT",
    status: "SUCCEEDED",
    reason: null,
    amount: 160_000,
    created_at: "2026-10-05T16:00:00+07:00",
    expires_at: "2026-10-05T16:15:00+07:00",
    order: {
        event_id: 2,
        title: "Мастер-класс по мышлению",
        starts_at: "2026-10-29T18:00:00+07:00",
        attendees_count: 2
    },
    ...overrides
})
