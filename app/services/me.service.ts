import type { ApiFetch } from "~/composables/useApi"
import type {
    BookingDto,
    TrialUsage,
    DepositBalanceDto,
    DepositEntryDto,
    MeBooking,
    MeChild,
    MeDepositEntry,
    MeProfile,
    MeSubscription,
    MeSubscriptionSlot,
    MeUpcoming,
    NewChild,
    Page,
    PageQuery,
    Profile,
    ProfileChild,
    ProfileCompletionPayload,
    SubscriptionView,
    UpcomingItem
} from "~/types"

// Флаг анкеты считает бэк: ФИО, телефон, «откуда узнали» и согласие на ПД.
export function isProfileComplete(dto: Profile): boolean {
    return dto.profile_completed
}

// Применяет маппер к results, сохраняя счётчик и ссылки страницы.
function mapPage<T, R>(page: Page<T>, map: (item: T) => R): Page<R> {
    return { ...page, results: page.results.map(map) }
}

// "2026-10-03" → "03.10.2026" без Date: не зависит от часового пояса сервера.
function formatIsoDate(iso: string): string {
    const [year, month, day] = iso.split("-")
    return year && month && day ? `${day}.${month}.${year}` : iso
}

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
        children: dto.children.map(toChild),
        isComplete: isProfileComplete(dto)
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
            day: "numeric",
            timeZone: "Asia/Novosibirsk"
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
        // source_id повторяется от недели к неделе – ключ собирается из даты и времени
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

function toBookingParticipant(dto: BookingDto): string {
    if (dto.kind === "TRIAL" || !dto.attendees_count) return dto.child_name
    const seats = `${dto.attendees_count} ${pluralize(dto.attendees_count, ["место", "места", "мест"])}`
    return dto.child_name ? `${dto.child_name} · ${seats}` : seats
}

function toBooking(dto: BookingDto): MeBooking {
    return {
        key: `${dto.kind}-${dto.id}`,
        kind: dto.kind === "TRIAL" ? "trial" : "event",
        title: dto.title,
        subtitle: dto.group_name ?? "",
        participant: toBookingParticipant(dto),
        displayDate: formatIsoDate(dto.date),
        displayTime: `${dto.start_time.slice(0, 5)}-${dto.end_time.slice(0, 5)}`,
        price: dto.cost == null ? null : kopecksToRubles(dto.cost),
        status: dto.status,
        statusLabel: dto.status_display,
        isPast: dto.is_past
    }
}

function toDepositEntry(dto: DepositEntryDto): MeDepositEntry {
    return {
        id: dto.id,
        amount: kopecksToRubles(dto.amount),
        reason: dto.reason,
        reasonLabel: dto.reason_display,
        subscriptionDisplayId: dto.subscription_display_id,
        createdAt: new Date(dto.created_at).toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "Asia/Novosibirsk"
        })
    }
}

/**
 * Личный кабинет родителя. Требует авторизации (Bearer подставляет useApi).
 * Списки ЛК пагинируются бэком: с ?limit приходит конверт Page (api-core-contracts.md §0.5).
 * Всё, кроме профиля и детей, закрыто до заполнения анкеты (403 PROFILE_INCOMPLETE).
 */
export class MeService {
    constructor(private readonly fetch: ApiFetch) {}

    async getProfile(): Promise<MeProfile> {
        return toProfile(await this.fetch<Profile>("/v1/me/profile/"))
    }

    /** Действующие абонементы сверху, внутри группы – новые сверху (порядок бэка) */
    async getSubscriptionsPage(query: PageQuery): Promise<Page<MeSubscription>> {
        const page = await this.fetch<Page<SubscriptionView>>("/v1/me/subscriptions/", {
            query
        })
        return mapPage(page, toSubscription)
    }

    /** period=all: предстоящие по близости, затем прошедшие от свежих (порядок бэка) */
    async getBookingsPage(query: PageQuery): Promise<Page<MeBooking>> {
        const page = await this.fetch<Page<BookingDto>>("/v1/me/bookings/", {
            query: { ...query, period: "all" }
        })
        return mapPage(page, toBooking)
    }

    /** Все пробные родителя одним списком (без limit бэк отдаёт массив) – для предпроверки лимита */
    async getTrialUsages(): Promise<TrialUsage[]> {
        const bookings = await this.fetch<BookingDto[]>("/v1/me/bookings/", {
            query: { kind: "TRIAL", period: "all" }
        })
        // ПОЧЕМУ пропуск: записи, заведённые вручную без ребёнка или кружка, лимит не задают
        return bookings.flatMap((b) =>
            b.student_id !== null && b.activity_id !== null
                ? [{ studentId: b.student_id, activityId: b.activity_id }]
                : []
        )
    }

    /** Лента предсортирована бэком по реальным дате и времени */
    async getUpcoming(params?: { weeks?: number; childId?: number }): Promise<MeUpcoming[]> {
        const items = await this.fetch<UpcomingItem[]>("/v1/me/upcoming/", {
            query: {
                ...(params?.weeks != null ? { weeks: params.weeks } : {}),
                ...(params?.childId != null ? { child_id: params.childId } : {})
            }
        })
        return items.map(toUpcoming)
    }

    /** Баланс в рублях; депозита ещё нет – 0 */
    async getDepositBalance(): Promise<number> {
        const res = await this.fetch<DepositBalanceDto>("/v1/me/deposit/")
        return kopecksToRubles(res.balance)
    }

    async getDepositEntriesPage(query: PageQuery): Promise<Page<MeDepositEntry>> {
        const page = await this.fetch<Page<DepositEntryDto>>("/v1/me/deposit/entries/", {
            query
        })
        return mapPage(page, toDepositEntry)
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

    /** Мягкое удаление; 409 CHILD_HAS_ACTIVE_ENROLLMENTS, пока есть живые записи */
    async deleteChild(id: string): Promise<void> {
        await this.fetch(`/v1/me/children/${encodeURIComponent(id)}/`, { method: "DELETE" })
    }

    /** PATCH /me/profile/: галочка согласия уже проверена схемой формы */
    async completeProfile(payload: ProfileCompletionPayload): Promise<MeProfile> {
        const updated = await this.fetch<Profile>("/v1/me/profile/", {
            method: "PATCH",
            body: {
                full_name: payload.fullName.trim(),
                phone: payload.phone.trim(),
                referral_source: payload.referralSource,
                pd_consent: true
            }
        })
        return toProfile(updated)
    }
}

export const useMeService = () => new MeService(useApi().apiFetch)
