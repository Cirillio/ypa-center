// Глобальные типы приложения
import type { components } from "./api.d.ts"

// Публичный каталог кружков – GET /public/activities/ (список = ActivityDetail[])
export type Activity = components["schemas"]["ActivityDetail"]
// GET /public/activities/popular/ – урезанная форма без groups/description
export type ActivityPopular = components["schemas"]["ActivityCard"]
export type ActivityGroup = components["schemas"]["ScheduleGroupPublic"]

// GET /public/events/
export type EventItem = components["schemas"]["EventPublic"]

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

// Используется только trial-флоу (useTrialEnrollment/ClubPicker), вне текущего захода
export interface ClubWithSlots {
    id: string
    title: string
    shortDesc: string
    img: string
    spotsAvailable?: number
    slots: WeeklySlot[]
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

// ─── Личный кабинет ───────────────────────────────────────────────────────────
// Сырые ответы бэка (до маппинга в Me*-модели внутри me.service)
export type Profile = components["schemas"]["Profile"]
export type ProfileChild = components["schemas"]["Child"]
export type SubscriptionView = components["schemas"]["SubscriptionView"]
export type SubscriptionSlotView = components["schemas"]["SubscriptionSlotView"]
export type UpcomingItem = components["schemas"]["UpcomingItem"]
export type SubscriptionStatus = components["schemas"]["SubscriptionViewStatusEnum"]

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
    phone?: string
    referralSource: string
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

// ─── Авторизация ──────────────────────────────────────────────────────────────
export interface OtpRequestResult {
    resendAvailableIn: number
    codeTtl: number
}

export interface ProblemDetail {
    type: string // "urn:problem-type:validationerror"
    title: string // "Validation Error", "NotFound", "Throttled"
    status: number // HTTP-статус
    detail: string // Человекочитаемое сообщение на русском
    extensions?: {
        request_id?: string // UUID запроса
        invalid_params?: Array<{
            name: string
            reason: string
        }> // Только при 422
    }
}
