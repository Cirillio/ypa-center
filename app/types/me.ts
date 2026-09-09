import type { components } from "~/types/api"

export type ApiProfile = components["schemas"]["Profile"]
export type ApiChild = components["schemas"]["Child"]
export type ApiSubscriptionView = components["schemas"]["SubscriptionView"]
export type ApiSubscriptionSlotView = components["schemas"]["SubscriptionSlotView"]
export type ApiUpcomingItem = components["schemas"]["UpcomingItem"]
export type ApiSubscriptionStatus = components["schemas"]["SubscriptionViewStatusEnum"]

export interface MeParentVM {
    name: string
    phone: string
    email: string
}

export interface MeChildVM {
    id: string
    name: string
    birthdate: string
    isLinked: boolean
}

export interface MeSubscriptionSlotVM {
    scheduleId: number
    activityName: string
    groupName: string
    schedule: string
    remaining: number
    total: number
}

export interface MeSubscriptionVM {
    id: number
    displayId: string
    status: ApiSubscriptionStatus
    createdAt: string
    formattedCreatedAt: string
    studentName: string
    sum: number
    totalRemaining: number
    totalMax: number
    slots: MeSubscriptionSlotVM[]
}

export interface MeUpcomingVM {
    id: string
    type: "subscription" | "event"
    title: string
    subtitle: string
    displayDate: string
    displayTime: string
    participant: string
    metaLabel?: string
}

export function toParentVM(dto: ApiProfile): MeParentVM {
    return {
        name: dto.full_name ?? "",
        phone: dto.phone ?? "",
        email: dto.email
    }
}

export function toChildVM(
    dto: ApiChild,
    subscriptions?: readonly ApiSubscriptionView[]
): MeChildVM {
    const isLinked = subscriptions?.some((s) => s.student_name === dto.full_name) ?? false
    return {
        id: String(dto.id),
        name: dto.full_name,
        birthdate: dto.dob,
        isLinked
    }
}

export function toSubscriptionVM(dto: ApiSubscriptionView): MeSubscriptionVM {
    const slots: MeSubscriptionSlotVM[] = dto.slots.map((s) => ({
        scheduleId: s.schedule_id,
        activityName: s.activity_name,
        groupName: s.group_name,
        schedule: s.schedule,
        remaining: s.remaining_sessions,
        total: s.total_sessions
    }))

    const totalMax = slots.reduce((acc, s) => acc + s.total, 0)
    const formattedCreatedAt = new Date(dto.created_at).toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric"
    })

    return {
        id: dto.id,
        displayId: dto.display_id,
        status: dto.status,
        createdAt: dto.created_at,
        formattedCreatedAt,
        studentName: dto.student_name,
        sum: Math.round(dto.purchase_price / 100),
        totalRemaining: dto.total_remaining,
        totalMax,
        slots
    }
}

export function toUpcomingVM(dto: ApiUpcomingItem): MeUpcomingVM {
    return {
        id: `${dto.source_type}-${dto.source_id}-${dto.date}-${dto.time}`,
        type: dto.kind === "EVENT" ? "event" : "subscription",
        title: dto.activity_name ?? dto.title ?? "",
        subtitle: dto.group_name ?? "",
        displayDate: dto.date,
        displayTime: dto.time,
        participant: dto.student_name ?? "",
        metaLabel: dto.is_rescheduled ? "Перенос" : undefined
    }
}
