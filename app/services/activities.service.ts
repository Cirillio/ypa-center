import type { ApiFetch } from "~/composables/useApi"
import type {
    Activity,
    ActivityPopular,
    TrialCheckoutSlot,
    TrialSlotDto,
    TrialSlotsResponse
} from "~/types"

// Маппит календарный слот бэка в модель выбора пробного с готовыми подписями.
function toTrialCheckoutSlot(slot: TrialSlotDto): TrialCheckoutSlot {
    return {
        key: `${slot.schedule_id}_${slot.date}`,
        scheduleId: slot.schedule_id,
        date: slot.date,
        startTime: slot.start_time,
        endTime: slot.end_time,
        groupName: slot.group_name,
        displayDate: formatEventDate(slot.date),
        displayTime: `${slot.start_time}–${slot.end_time}`
    }
}

/**
 * Публичный каталог кружков.
 * Эндпоинты: GET /api/v1/public/activities/, /public/activities/popular/
 */
export class ActivitiesService {
    constructor(private readonly fetch: ApiFetch) {}

    getAll(): Promise<Activity[]> {
        return this.fetch<Activity[]>("/v1/public/activities/")
    }

    getPopular(): Promise<ActivityPopular[]> {
        return this.fetch<ActivityPopular[]>("/v1/public/activities/popular/")
    }

    /**
     * GET /api/v1/public/activities/{activityId}/next-slots/
     * Свободные календарные слоты кружка на сегодня + 13 дней, с учётом отмен и переносов.
     */
    async getNextTrialSlots(activityId: number): Promise<TrialCheckoutSlot[]> {
        const res = await this.fetch<TrialSlotsResponse>(
            `/v1/public/activities/${activityId}/next-slots/`
        )
        return res.slots.map(toTrialCheckoutSlot)
    }
}

export const useActivitiesService = () => new ActivitiesService(useApi().apiFetch)
