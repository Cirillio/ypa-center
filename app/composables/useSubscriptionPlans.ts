import type { PlanTier } from "~/types"

export function useSubscriptionPlans() {
    const plans = usePlansService()
    const { subscriptions } = useAppConfig()

    // Фолбэк на статичный конфиг, если /public/plans/ недоступен или пуст
    const fallback: PlanTier[] = subscriptions.map((t) => ({
        id: null,
        lessons: t.lessons,
        price: t.price,
        label: t.label ?? null,
        highlight: t.highlight ?? false
    }))

    const { data, error } = useAsyncData("public-plans", () => plans.getAll())

    const tiers = computed<PlanTier[]>(() => (data.value?.length ? data.value : fallback))

    return { tiers, error }
}
