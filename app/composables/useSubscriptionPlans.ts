import type { SubscriptionPlanPublic } from "~/types"

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

export function useSubscriptionPlans() {
    const { apiFetch } = useApi()
    const { subscriptions } = useAppConfig()

    // Фолбэк на статичный конфиг, если /public/plans/ недоступен или пуст
    const fallback: PlanTier[] = subscriptions.map((t) => ({
        id: null,
        lessons: t.lessons,
        price: t.price,
        label: t.label ?? null,
        highlight: t.highlight ?? false
    }))

    const { data, error } = useAsyncData("public-plans", () =>
        apiFetch<SubscriptionPlanPublic[]>("/v1/public/plans/")
    )

    const tiers = computed<PlanTier[]>(() =>
        data.value?.length ? data.value.map(toTier) : fallback
    )

    return { tiers, error }
}
