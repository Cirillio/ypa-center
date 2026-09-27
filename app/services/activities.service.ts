import type { ApiFetch } from "~/composables/useApi"
import { generateMockTrialSlots } from "~/services/mocks/trial-slots.mock"
import type { Activity, ActivityPopular, TrialCheckoutSlot } from "~/types"

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
     * Календарные слоты кружка на 2 недели вперёд с остатком мест для пробного занятия.
     */
    async getNextTrialSlots(
        activityId: number,
        activityName?: string
    ): Promise<TrialCheckoutSlot[]> {
        // MOCK(trial-next-slots): эндпоинт слотов пробного в разработке на бэке, обогащаем моком
        return generateMockTrialSlots(activityId, activityName)
    }
}

export const useActivitiesService = () => new ActivitiesService(useApi().apiFetch)
