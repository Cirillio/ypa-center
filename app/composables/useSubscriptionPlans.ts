import type { PlanTier } from "~/types"

const LESSONS_PER_SLOT = 4

export function useSubscriptionPlans() {
    const plans = usePlansService()
    const { subscriptions } = useAppConfig()

    // ПОЧЕМУ: в конфиге нет slots_count – обычный тариф считаем из занятий, безлимит – сразу за самым большим
    const maxLimitedSlots = Math.max(
        0,
        ...subscriptions.map((t) => (t.lessons === null ? 0 : t.lessons / LESSONS_PER_SLOT))
    )

    // Фолбэк на статичный конфиг, если /public/plans/ недоступен или пуст
    const fallback: PlanTier[] = subscriptions.map((t) => ({
        id: null,
        slotsCount: t.lessons === null ? maxLimitedSlots + 1 : t.lessons / LESSONS_PER_SLOT,
        lessons: t.lessons,
        price: t.price,
        label: t.label ?? null,
        highlight: t.highlight ?? false
    }))

    const { data, error } = useAsyncData("plans", () => plans.getAll())

    const tiers = computed<PlanTier[]>(() => (data.value?.length ? data.value : fallback))

    return { tiers, error }
}
