import type { ApiFetch } from "~/composables/useApi"
import type { Teacher } from "~/types"

/**
 * Преподаватели с их кружками.
 * Эндпоинт: GET /api/v1/public/teachers/
 */
export class TeachersService {
    constructor(private readonly fetch: ApiFetch) {}

    getAll(): Promise<Teacher[]> {
        return this.fetch<Teacher[]>("/v1/public/teachers/")
    }
}

export const useTeachersService = () => new TeachersService(useApi().apiFetch)
