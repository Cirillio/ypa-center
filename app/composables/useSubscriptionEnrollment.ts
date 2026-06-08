import type { FormSubmitEvent } from "@nuxt/ui"
import type { RegistrationForm } from "~/schemas/registration.schema"
import { MOCK_WEEKLY_SLOTS } from "~/constants/mock"

const DEFAULT_FORM: RegistrationForm = {
    childFullName: "",
    birthDate: "",
    grade: "",
    parentFullName: "",
    email: "",
    phone: "",
    referralSource: "",
    comments: ""
}

export function useSubscriptionEnrollment() {
    const { subscriptions, pricing } = useAppConfig()

    const formState = reactive<RegistrationForm>({ ...DEFAULT_FORM })
    const selectedSlotIds = ref<Set<number>>(new Set())

    const allSlots = MOCK_WEEKLY_SLOTS

    // Словарь для моментального доступа к слоту за O(1)
    const slotsById = new Map(allSlots.map((s) => [s.id, s]))

    const selectedSlots = computed(() =>
        Array.from(selectedSlotIds.value)
            .map((id) => slotsById.get(id))
            .filter((s): s is (typeof MOCK_WEEKLY_SLOTS)[0] => !!s)
    )

    const totalMonthlyLessons = computed(() => selectedSlots.value.length * 4)

    const currentTierIndex = computed(() => {
        const total = totalMonthlyLessons.value
        if (total === 0) return -1
        const idx = subscriptions.findIndex((t) => t.lessons === null || t.lessons >= total)
        return idx === -1 ? subscriptions.length - 1 : idx
    })

    const currentTier = computed(() => {
        const i = currentTierIndex.value
        return i >= 0 ? (subscriptions[i] ?? null) : null
    })

    const nextTier = computed(() => {
        const i = currentTierIndex.value
        if (i < 0 || i >= subscriptions.length - 1) return null
        return subscriptions[i + 1] ?? null
    })

    const tierProgress = computed(() => {
        const total = subscriptions.length
        const i = currentTierIndex.value
        if (i < 0) return 0
        return (i + 1) / total
    })

    const savings = computed(() => {
        if (!currentTier.value || totalMonthlyLessons.value === 0) return 0
        return pricing.trialLesson * totalMonthlyLessons.value - currentTier.value.price
    })

    const pricePerLesson = computed(() => {
        if (!currentTier.value || totalMonthlyLessons.value === 0) return null
        return Math.round(currentTier.value.price / totalMonthlyLessons.value)
    })

    function toggleSlot(id: number) {
        if (selectedSlotIds.value.has(id)) {
            removeSlot(id)
        } else {
            selectedSlotIds.value.add(id)
        }
    }

    function removeSlot(id: number) {
        selectedSlotIds.value.delete(id)
    }

    async function onSubmit(event: FormSubmitEvent<RegistrationForm>) {
        console.log("Форма отправлена:", event.data, "Слоты:", selectedSlotIds.value)
    }

    return {
        allSlots,
        formState,
        selectedSlotIds,
        selectedSlots,
        totalMonthlyLessons,
        currentTier,
        nextTier,
        tierProgress,
        savings,
        pricePerLesson,
        toggleSlot,
        removeSlot,
        onSubmit
    }
}
