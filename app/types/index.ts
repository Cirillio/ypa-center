// Глобальные типы приложения
import type { components } from "./api.d.ts"

// Публичный каталог кружков — GET /public/activities/ (список = ActivityDetail[])
export type Activity = components["schemas"]["ActivityDetail"]
// GET /public/activities/popular/ — урезанная форма без groups/description
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

// GET /public/schedule/ — недельная сетка (сырой ответ бэка, до маппинга в WeeklySlot)
export type WeekGridResponse = components["schemas"]["WeekGridResponse"]
export type WeekScheduleSlot = components["schemas"]["WeekSlot"]

// GET /public/plans/ — тарифы абонементов (сырой ответ, до маппинга в PlanTier)
export type SubscriptionPlanPublic = components["schemas"]["SubscriptionPlanPublic"]

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

export interface ContactTimeOption {
    label: string
    time: string
    value: string
}

// POST /public/callback/ — заявка на обратный звонок
export type CallbackRequestPayload = components["schemas"]["CallbackRequestCreateRequest"]
export type CallbackRequestResponse = components["schemas"]["SubmissionAccepted"]
export type PreferredTimeWindow = components["schemas"]["PreferredTimeWindowEnum"]

// POST /public/feedback/ — форма обратной связи
export type FeedbackRequestPayload = components["schemas"]["FeedbackRequestCreateRequest"]
export type FeedbackRequestResponse = components["schemas"]["SubmissionAccepted"]

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
