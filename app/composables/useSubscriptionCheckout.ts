import type { PlanTier, SubscriptionSlotConflict, WeeklySlot } from "~/types"

const LESSONS_PER_SLOT = 4

// Управляет состоянием конструктора абонемента: день недели, снимки выбранных слотов, подбор тарифа и конфликты.
export function useSubscriptionCheckout() {
    const scheduleService = useScheduleService()
    const { tiers } = useSubscriptionPlans()
    const { weekDays, selectedDay } = useSchedule()

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

    const slotsForSelectedDay = computed<WeeklySlot[]>(() =>
        (weekSlots.value ?? [])
            .filter((slot) => slot.dayOfWeek === selectedDay.value.dow)
            .slice()
            .sort((a, b) => a.startTime.localeCompare(b.startTime))
    )

    const conflicts = computed<SubscriptionSlotConflict[]>(() =>
        findSlotConflicts(selectedSlots.value)
    )

    const totalMonthlyLessons = computed(() => selectedSlots.value.length * LESSONS_PER_SLOT)

    const currentTierIndex = computed(() => {
        const total = totalMonthlyLessons.value
        if (total === 0 || tiers.value.length === 0) return -1
        const idx = tiers.value.findIndex((tier) => tier.lessons === null || tier.lessons >= total)
        return idx === -1 ? tiers.value.length - 1 : idx
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

    // Вычисляет порог кружков для безлимитного тарифа из последнего лимитного тарифа без хардкода.
    const unlimitedHint = computed<string | null>(() => {
        const limitedLessons = tiers.value
            .map((tier) => tier.lessons)
            .filter((lessons): lessons is number => lessons !== null && lessons > 0)
        if (limitedLessons.length === 0) return null
        const maxLimitedLessons = Math.max(...limitedLessons)
        const minUnlimitedClubs = Math.floor(maxLimitedLessons / LESSONS_PER_SLOT) + 1
        return `при ${minUnlimitedClubs}+ кружках`
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
        selectedDay,
        slotsForSelectedDay,
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
