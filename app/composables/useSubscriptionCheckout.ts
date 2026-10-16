import type { PlanTier, SubscriptionSlotConflict, WeeklySlot } from "~/types"

const LESSONS_PER_SLOT = 4

// Управляет состоянием конструктора абонемента: расписание недели по дням, снимки выбранных слотов, подбор тарифа и конфликты.
export function useSubscriptionCheckout() {
    const scheduleService = useScheduleService()
    const { tiers } = useSubscriptionPlans()
    const { weekDays } = useSchedule()

    const selectedSlots = ref<WeeklySlot[]>([])

    const {
        data: weekSlots,
        status: slotsStatus,
        error: slotsError,
        refresh: refreshSlots
    } = useAsyncData("enrollment:subscription-schedule", () => scheduleService.getWeek())

    const isSlotsPending = computed(() => slotsStatus.value === "pending")

    const selectedSlotIds = computed<Set<number>>(
        () => new Set(selectedSlots.value.map((slot) => slot.id))
    )

    const selectedCountByDow = computed<Record<number, number>>(() => {
        const counts: Record<number, number> = {}
        for (const slot of selectedSlots.value) {
            counts[slot.dayOfWeek] = (counts[slot.dayOfWeek] ?? 0) + 1
        }
        return counts
    })

    // ПОЧЕМУ вся неделя сразу: родитель собирает абонемент из разных дней – вкладки прятали шесть из семи
    const slotsByDow = computed<Record<number, WeeklySlot[]>>(() => {
        const byDow: Record<number, WeeklySlot[]> = {}
        const sorted = (weekSlots.value ?? [])
            .slice()
            .sort((a, b) => a.startTime.localeCompare(b.startTime))
        for (const slot of sorted) {
            ;(byDow[slot.dayOfWeek] ??= []).push(slot)
        }
        return byDow
    })

    const conflicts = computed<SubscriptionSlotConflict[]>(() =>
        findSlotConflicts(selectedSlots.value)
    )

    const totalMonthlyLessons = computed(() => selectedSlots.value.length * LESSONS_PER_SLOT)

    // -1 – тарифа под выбор нет: ничего не выбрано, пропуск в линейке или больше 10 слотов
    const currentTierIndex = computed(() => {
        const plan = pickPlan(tiers.value, selectedSlots.value.length)
        return plan ? tiers.value.indexOf(plan) : -1
    })

    const currentTier = computed<PlanTier | null>(() => {
        const idx = currentTierIndex.value
        return idx >= 0 ? (tiers.value[idx] ?? null) : null
    })

    const nextTier = computed<PlanTier | null>(() => {
        const idx = currentTierIndex.value
        if (idx < 0 || idx >= tiers.value.length - 1) return null
        return tiers.value[idx + 1] ?? null
    })

    // Порог безлимита – из самого тарифа, без хардкода.
    const unlimitedHint = computed<string | null>(() => {
        const unlimited = tiers.value.find((tier) => tier.lessons === null)
        return unlimited ? `при ${unlimited.slotsCount}+ кружках` : null
    })

    // Добавляет снимок слота в корзину или снимает выбор при повторном нажатии.
    function toggleSlot(slot: WeeklySlot) {
        if (selectedSlotIds.value.has(slot.id)) {
            selectedSlots.value = selectedSlots.value.filter((item) => item.id !== slot.id)
            return
        }
        if (slot.available <= 0) return
        selectedSlots.value = [
            ...selectedSlots.value,
            {
                ...slot,
                activity: { ...slot.activity }
            }
        ]
    }

    return {
        weekDays,
        slotsByDow,
        isSlotsPending,
        slotsError,
        refreshSlots,
        selectedSlots,
        selectedSlotIds,
        selectedCountByDow,
        toggleSlot,
        conflicts,
        tiers,
        currentTierIndex,
        currentTier,
        nextTier,
        totalMonthlyLessons,
        unlimitedHint
    }
}
