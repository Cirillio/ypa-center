import type { ApiFetch } from "~/composables/useApi"
import type {
    MeChild,
    MeProfile,
    MeSubscription,
    MeSubscriptionSlot,
    MeUpcoming,
    NewChild,
    Profile,
    ProfileChild,
    SubscriptionView,
    UpcomingItem
} from "~/types"

function toChild(dto: ProfileChild): MeChild {
    return {
        id: String(dto.id),
        name: dto.full_name,
        birthdate: dto.dob
    }
}

function toProfile(dto: Profile): MeProfile {
    return {
        parent: {
            name: dto.full_name ?? "",
            phone: dto.phone ?? "",
            email: dto.email
        },
        children: dto.children.map(toChild)
    }
}

function toSubscription(dto: SubscriptionView): MeSubscription {
    const slots: MeSubscriptionSlot[] = dto.slots.map((slot) => ({
        scheduleId: slot.schedule_id,
        activityName: slot.activity_name,
        groupName: slot.group_name,
        schedule: slot.schedule,
        remaining: slot.remaining_sessions,
        total: slot.total_sessions
    }))

    return {
        id: dto.id,
        displayId: dto.display_id,
        status: dto.status,
        createdAt: dto.created_at,
        formattedCreatedAt: new Date(dto.created_at).toLocaleDateString("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric"
        }),
        studentName: dto.student_name,
        sum: kopecksToRubles(dto.purchase_price),
        totalRemaining: dto.total_remaining,
        totalMax: slots.reduce((acc, slot) => acc + slot.total, 0),
        slots
    }
}

function toUpcoming(dto: UpcomingItem): MeUpcoming {
    return {
        // source_id повторяется от недели к неделе — ключ собирается из даты и времени
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

/**
 * Личный кабинет родителя. Требует авторизации (Bearer подставляет useApi).
 * Эндпоинты: GET /me/profile/, /me/subscriptions/, /me/upcoming/, POST /me/children/
 */
export class MeService {
    constructor(private readonly fetch: ApiFetch) {}

    async getProfile(): Promise<MeProfile> {
        return toProfile(await this.fetch<Profile>("/v1/me/profile/"))
    }

    async getSubscriptions(): Promise<MeSubscription[]> {
        const subscriptions = await this.fetch<SubscriptionView[]>("/v1/me/subscriptions/")
        return subscriptions.map(toSubscription)
    }

    /** Лента предсортирована бэком по реальным дате и времени */
    async getUpcoming(params?: { weeks?: number; childId?: number }): Promise<MeUpcoming[]> {
        const items = await this.fetch<UpcomingItem[]>("/v1/me/upcoming/", {
            query: {
                ...(params?.weeks ? { weeks: params.weeks } : {}),
                ...(params?.childId ? { child_id: params.childId } : {})
            }
        })
        return items.map(toUpcoming)
    }

    async addChild(dto: NewChild): Promise<MeChild> {
        const created = await this.fetch<ProfileChild>("/v1/me/children/", {
            method: "POST",
            body: {
                full_name: dto.name.trim(),
                dob: dto.birthdate
            }
        })
        return toChild(created)
    }

    // TODO backend: нет DELETE /api/v1/me/children/{id}/, удаление не поддерживается
}

export const useMeService = () => new MeService(useApi().apiFetch)
