import type { ApiFetch } from "~/composables/useApi"
import type { Activity, ActivityPopular } from "~/types"

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
}

export const useActivitiesService = () => new ActivitiesService(useApi().apiFetch)
