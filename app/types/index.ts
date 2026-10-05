// Глобальные типы приложения
import type { components } from "./api.d.ts"

// Публичный каталог кружков – GET /public/activities/ (список = ActivityDetail[])
export type Activity = components["schemas"]["ActivityDetail"]
// GET /public/activities/popular/ – урезанная форма без groups/description
export type ActivityPopular = components["schemas"]["ActivityCard"]
export type ActivityGroup = components["schemas"]["ScheduleGroupPublic"]

// GET /public/events/
export type EventPublic = components["schemas"]["EventPublic"]

export interface EventItem extends EventPublic {
    availableSeats: number
}

// GET /public/gallery/
export type GalleryPhoto = components["schemas"]["GalleryImagePublic"]
export type GalleryPage = components["schemas"]["PaginatedGalleryImagePublicList"]

// GET /public/teachers/
export type Teacher = components["schemas"]["TeacherPublic"]
export type TeacherActivity = components["schemas"]["TeacherActivityNested"]

// GET /public/schedule/ – недельная сетка (сырой ответ бэка, до маппинга в WeeklySlot)
export type WeekGridResponse = components["schemas"]["WeekGridResponse"]
export type WeekScheduleSlot = components["schemas"]["WeekSlot"]

// GET /public/plans/ – тарифы абонементов (сырой ответ, до маппинга в PlanTier)
export type SubscriptionPlanPublic = components["schemas"]["SubscriptionPlanPublic"]

/**
 * UI-модель карточки тарифа. Совместима по форме с фолбэком из app.config
 * (subscriptions), чтобы шаблоны карточек не менялись при недоступности API.
 */
export interface PlanTier {
    id: number | null
    slotsCount: number // у безлимита – минимум слотов, с которого он продаётся
    lessons: number | null // null = безлимит
    price: number // рубли (API отдаёт копейки)
    label: string | null // задан только для безлимита; иначе шаблон показывает число занятий
    highlight: boolean
}

export interface WeeklySlot {
    id: number
    activity: {
        id: number
        name: string
    }
    dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6
    startTime: string
    endTime: string
    groupName: string
    maxCapacity: number
    available: number
}

export enum SchoolClasses {
    C1 = "1",
    C2 = "2",
    C3 = "3",
    C4 = "4",
    C5 = "5",
    C6 = "6",
    C7 = "7",
    C8 = "8",
    C9 = "9",
    C10 = "10",
    C11 = "11"
}

export type EnrollPurchaseType = "trial" | "subscription" | "event"

// GET /public/activities/{id}/next-slots/ – только свободные слоты, без счётчика мест
export type TrialSlotsResponse = components["schemas"]["TrialSlotsResponse"]
export type TrialSlotDto = components["schemas"]["TrialSlot"]

// Календарный слот пробного: своего id у слота нет, уникальна пара «расписание + дата»
export interface TrialCheckoutSlot {
    key: string // `${scheduleId}_${date}` – для выбора, :key и query
    scheduleId: number
    date: string // YYYY-MM-DD, уходит в checkout как trial_date
    startTime: string
    endTime: string
    groupName: string
    displayDate: string
    displayTime: string
}

// POST /checkout/subscription, /checkout/trial
export type CheckoutSubscriptionRequest = components["schemas"]["CheckoutSubscriptionRequest"]
export type CheckoutTrialRequest = components["schemas"]["CheckoutTrialRequest"]
export type CheckoutResponse = components["schemas"]["CheckoutResponse"]

// POST /public/events/{id}/register/
export type EventRegistrationRequest = components["schemas"]["EventRegistrationCreateRequest"]

// Принятая бронь для экрана подтверждения
export interface EventRegistrationResult {
    eventTitle: string
    startDatetime: string
    seats: number
    isFree: boolean
}

// GET /checkout/transactions/{id} – исход оплаты для родителя
export type CheckoutTransactionDto = components["schemas"]["CheckoutTransaction"]
export type CheckoutTransactionStatus = components["schemas"]["CheckoutOutcomeStatusEnum"]
export type CheckoutTransactionReason = components["schemas"]["RefundReasonEnum"]

// Слот из состава заказа; день недели 0=Пн, как в getDayName
export interface CheckoutOrderSlot {
    scheduleId: number
    activityName: string
    groupName: string
    dayOfWeek: number
    startTime: string
    endTime: string
}

// Статус оплаты для экрана результата; сумма в рублях
export interface CheckoutTransaction {
    id: string
    status: CheckoutTransactionStatus
    type: CheckoutTransactionDto["type"]
    reason: CheckoutTransactionReason | null
    amount: number
    expiresAt: string
    order: {
        title: string
        studentName: string
        trialDate: string | null
        slots: CheckoutOrderSlot[]
    }
}

// Экран результата оплаты: одно состояние из шести
export type TransactionViewState =
    | "pending"
    | "success"
    | "canceled"
    | "refund"
    | "timeout"
    | "error"

// Ошибка оформления заказа для блока под кнопкой «Продолжить»
export interface CheckoutError {
    code: ProblemCode | undefined
    title: string
    description: string
    requestId?: string // X-Request-ID ответа – родитель диктует его администратору
}

export interface ScheduleWeekDay {
    dow: number
    dayShort: string
    isToday: boolean
}

// Строка сводки «Итого»: пустое value выводится заглушкой empty
export interface EnrollSummaryRow {
    label: string
    value: string | null
    empty?: string
}

export interface SubscriptionSlotConflict {
    first: WeeklySlot
    second: WeeklySlot
}

// value связан с PreferredTimeWindow через CONTACT_TIME_TO_WINDOW в useCallbackForm
export type ContactTimeValue = "morning" | "afternoon" | "evening"

export interface ContactTimeOption {
    label: string
    time: string
    value: ContactTimeValue
}

// POST /public/callback/ – заявка на обратный звонок
export type CallbackRequestPayload = components["schemas"]["CallbackRequestCreateRequest"]
export type CallbackRequestResponse = components["schemas"]["SubmissionAccepted"]
export type PreferredTimeWindow = components["schemas"]["PreferredTimeWindowEnum"]

// POST /public/feedback/ – форма обратной связи
export type FeedbackRequestPayload = components["schemas"]["FeedbackRequestCreateRequest"]
export type FeedbackRequestResponse = components["schemas"]["SubmissionAccepted"]

// ─── Пагинация ────────────────────────────────────────────────────────────────
// Конверт списка при ?limit (без limit бэк отдаёт голый массив); в OpenAPI не описан
export interface Page<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}

export interface PageQuery {
    limit: number
    offset: number
}

// ─── Личный кабинет ───────────────────────────────────────────────────────────
// Сырые ответы бэка (до маппинга в Me*-модели внутри me.service)
export type Profile = components["schemas"]["Profile"]
export type ProfileChild = components["schemas"]["Child"]
export type SubscriptionView = components["schemas"]["SubscriptionView"]
export type SubscriptionSlotView = components["schemas"]["SubscriptionSlotView"]
export type UpcomingItem = components["schemas"]["UpcomingItem"]
export type SubscriptionStatus = components["schemas"]["SubscriptionViewStatusEnum"]
export type BookingDto = components["schemas"]["Booking"]
export type BookingStatus = components["schemas"]["BookingStatusEnum"]
export type DepositBalanceDto = components["schemas"]["DepositBalance"]
export type DepositEntryDto = components["schemas"]["DepositEntryView"]
export type DepositReason = components["schemas"]["DepositEntryViewReasonEnum"]
export type ReferralSource = components["schemas"]["ReferralSourceEnum"]

export interface MeParent {
    name: string
    phone: string
    email: string
}

export interface MeChild {
    id: string
    name: string
    birthdate: string
}

export interface MeProfile {
    parent: MeParent
    children: MeChild[]
    isComplete: boolean
}

export interface ProfileCompletionPayload {
    fullName: string
    phone: string
    referralSource: ReferralSource
}

// Живая запись, из-за которой ребёнка нельзя удалить (из 409 CHILD_HAS_ACTIVE_ENROLLMENTS)
export interface MeChildBlocker {
    key: string
    title: string
    detail: string
}

// POST /me/children/ – входная модель добавления ребёнка
export interface NewChild {
    name: string
    birthdate: string
}

export interface MeSubscriptionSlot {
    scheduleId: number
    activityName: string
    groupName: string
    schedule: string // готовая строка вида "СБ 16:00-17:00"
    remaining: number
    total: number
}

export interface MeSubscription {
    id: number
    displayId: string
    status: SubscriptionStatus
    createdAt: string
    formattedCreatedAt: string
    studentName: string
    sum: number // рубли (API отдаёт копейки)
    totalRemaining: number
    totalMax: number
    slots: MeSubscriptionSlot[]
}

export interface MeUpcoming {
    id: string
    type: "subscription" | "event"
    title: string
    subtitle: string
    displayDate: string // "31.12.2001"
    displayTime: string // "16:00-17:00"
    participant: string
    metaLabel?: string
}

export interface MeBooking {
    key: string // id уникален только внутри своей таблицы – ключ из kind + id
    kind: "trial" | "event"
    title: string
    subtitle: string
    participant: string
    displayDate: string
    displayTime: string
    price: number | null // рубли; null – цены нет (запись заведена вручную)
    status: BookingStatus
    statusLabel: string
    isPast: boolean
}

export interface MeDepositEntry {
    id: number
    amount: number // рубли со знаком: + пришло, − потрачено
    reason: DepositReason
    reasonLabel: string
    subscriptionDisplayId: string | null
    createdAt: string
}

// ─── Авторизация ──────────────────────────────────────────────────────────────
export interface OtpRequestResult {
    resendAvailableIn: number
    codeTtl: number
}

export type OtpVerifyResponse = components["schemas"]["OTPVerifyResponse"]

export interface OtpVerifyResult {
    access: string
    refresh: string
    profileCompleted: boolean
}

// ─── Ошибки (RFC 9457) ────────────────────────────────────────────────────────
// Каталог кодов из api-core-contracts.md §0.3; в OpenAPI не описан. switch – только по code
export type ProblemCode =
    | "MALFORMED_REQUEST"
    | "AUTH_REQUIRED"
    | "OTP_INVALID"
    | "FORBIDDEN_RESOURCE"
    | "PROFILE_INCOMPLETE"
    | "NOT_FOUND"
    | "NO_AVAILABLE_SEATS"
    | "TRIAL_LIMIT_EXCEEDED"
    | "STUDENT_ALREADY_ENROLLED"
    | "CHILD_HAS_ACTIVE_ENROLLMENTS"
    | "SUBSCRIPTION_EXPIRED"
    | "IDEMPOTENCY_KEY_REUSED"
    | "PAYMENT_IN_PROGRESS"
    | "PAYMENT_GATEWAY_UNAVAILABLE"
    | "PLAN_UNAVAILABLE"
    | "EVENT_PRICE_CHANGED"
    | "VALIDATION_ERROR"
    | "RATE_LIMITED"
    | "INTERNAL_SERVER_ERROR"

// Элемент extensions.active_enrollments у 409 CHILD_HAS_ACTIVE_ENROLLMENTS
export interface ActiveEnrollmentDto {
    id: number
    type: "REGULAR" | "TRIAL"
    status: string
    activity_name: string
    group_name: string
    subscription_id: number | null
    trial_date: string | null
}

export interface ProblemDetail {
    type: string // "urn:problem-type:validationerror" – строится из имени класса, нестабилен
    title: string
    status: number
    detail: string // Человекочитаемое сообщение на русском
    code?: string // сырое значение; сужение до ProblemCode – getProblemCode()
    instance?: string
    extensions?: {
        request_id?: string
        invalid_params?: Array<{
            name: string
            reason: string
        }>
        active_enrollments?: ActiveEnrollmentDto[]
    }
}
