import type {
    BookingDto,
    DepositEntryDto,
    Page,
    Profile,
    ProfileChild,
    SubscriptionView,
    UpcomingItem
} from "~/types"

// Фабрики DTO типизированы из ~/types: изменение контракта бэка ломает их на typecheck

export const childDto = (overrides: Partial<ProfileChild> = {}): ProfileChild => ({
    id: 11,
    full_name: "Иванов Петя",
    dob: "2018-05-20",
    ...overrides
})

export const profileDto = (overrides: Partial<Profile> = {}): Profile => ({
    id: 1,
    full_name: "Иванова Анна",
    phone: "+79131234567",
    email: "anna@example.com",
    referral_source: "FRIENDS",
    pd_consent_at: "2026-09-27T10:00:00Z",
    profile_completed: true,
    children: [childDto()],
    ...overrides
})

export const subscriptionDto = (overrides: Partial<SubscriptionView> = {}): SubscriptionView => ({
    id: 5,
    display_id: "SUB-0005",
    status: "ACTIVE",
    student_name: "Иванов Петя",
    purchase_price: 700_000,
    created_at: "2026-09-30T20:00:00Z",
    start_date: "2026-10-01",
    expires_at: "2026-10-31",
    total_remaining: 6,
    slots: [
        {
            schedule_id: 100,
            activity_name: "Шахматы",
            group_name: "Младшая",
            schedule: "Пн 16:00",
            remaining_sessions: 2,
            total_sessions: 4
        },
        {
            schedule_id: 101,
            activity_name: "Робототехника",
            group_name: "Старшая",
            schedule: "Ср 17:00",
            remaining_sessions: 4,
            total_sessions: 4
        }
    ],
    ...overrides
})

export const bookingDto = (overrides: Partial<BookingDto> = {}): BookingDto => ({
    kind: "TRIAL",
    id: 3,
    title: "Шахматы",
    group_name: "Младшая",
    date: "2026-10-03",
    start_time: "16:00:00",
    end_time: "16:45:00",
    cost: 120_000,
    child_name: "Иванов Петя",
    student_id: 11,
    attendees_count: null,
    status: "CONFIRMED",
    status_display: "Подтверждена",
    is_past: false,
    activity_id: 1,
    event_id: null,
    ...overrides
})

export const depositEntryDto = (overrides: Partial<DepositEntryDto> = {}): DepositEntryDto => ({
    id: 9,
    amount: 250_000,
    reason: "SUBSCRIPTION_EXPIRY_CREDIT",
    reason_display: "Возврат за неиспользованные занятия",
    subscription_id: 5,
    subscription_display_id: "SUB-0005",
    created_at: "2026-09-30T20:00:00Z",
    ...overrides
})

export const upcomingDto = (overrides: Partial<UpcomingItem> = {}): UpcomingItem => ({
    kind: "LESSON",
    date: "2026-10-05",
    time: "16:00",
    student_id: 11,
    student_name: "Иванов Петя",
    activity_name: "Шахматы",
    group_name: "Младшая",
    title: null,
    source_type: "subscription_slot",
    source_id: 100,
    is_rescheduled: false,
    ...overrides
})

export const pageOf = <T>(results: T[], overrides: Partial<Page<T>> = {}): Page<T> => ({
    count: results.length,
    next: null,
    previous: null,
    results,
    ...overrides
})
