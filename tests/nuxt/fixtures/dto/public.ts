import type { EventPublic, SubscriptionPlanPublic, WeekScheduleSlot } from "~/types"

export const planDto = (
    overrides: Partial<SubscriptionPlanPublic> = {}
): SubscriptionPlanPublic => ({
    id: 1,
    name: "1 направление",
    slots_count: 1,
    price: 700_000,
    price_per_session: 175_000,
    is_unlimited: false,
    ...overrides
})

// Бэк нумерует дни по ISO: 0 = понедельник
export const weekSlotDto = (overrides: Partial<WeekScheduleSlot> = {}): WeekScheduleSlot => ({
    schedule_id: 100,
    date: "2026-09-28",
    day_of_week: 0,
    start_time: "16:00",
    end_time: "16:45",
    group_name: "Младшая",
    activity: { id: 1, name: "Шахматы", slug: "chess" },
    teacher: null,
    room: null,
    capacity: { max: 8, taken: 3, free: 5 },
    is_rescheduled: false,
    is_cancelled: false,
    override: null,
    ...overrides
})

export const eventDto = (overrides: Partial<EventPublic> = {}): EventPublic => ({
    id: 1,
    title: "Хэллоуин",
    start_datetime: "2026-10-31T11:00:00+07:00",
    price: 50_000,
    is_free: false,
    capacity: 20,
    is_upcoming: true,
    ...overrides
})
