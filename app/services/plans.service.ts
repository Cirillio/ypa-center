import type { ApiFetch } from "~/composables/useApi"
import type { PlanTier, SubscriptionPlanPublic } from "~/types"

// WHY slots_count * 4: 1 слот абонемента = 4 занятия в месяц (см. project-context)
const LESSONS_PER_SLOT = 4

function toTier(plan: SubscriptionPlanPublic): PlanTier {
    return {
        id: plan.id,
        lessons: plan.is_unlimited ? null : plan.slots_count * LESSONS_PER_SLOT,
        price: Math.round(plan.price / 100),
        label: plan.is_unlimited ? plan.name : null,
        highlight: Boolean(plan.is_unlimited)
    }
}

/**
 * Тарифные планы абонементов.
 * Эндпоинт: GET /api/v1/public/plans/
 */
export class PlansService {
    constructor(private readonly fetch: ApiFetch) {}

    async getAll(): Promise<PlanTier[]> {
        const plans = await this.fetch<SubscriptionPlanPublic[]>("/v1/public/plans/")
        return plans.map(toTier)
    }
}

export const usePlansService = () => new PlansService(useApi().apiFetch)
