import type { LocationQueryValue } from "vue-router"
import type { FormSubmitEvent } from "@nuxt/ui"
import type { RegistrationForm } from "~/schemas/registration.schema"
import { MOCK_CLUBS_WITH_SLOTS } from "~/constants/mock"

const DEFAULT_TRIAL_FORM: RegistrationForm = {
    childFullName: "",
    birthDate: "",
    grade: "",
    parentFullName: "",
    telegram: "",
    phone: "",
    referralSource: "",
    comments: ""
}

function parseQueryParam(
    value: LocationQueryValue | LocationQueryValue[] | undefined
): string | undefined {
    if (Array.isArray(value)) return value.find((v): v is string => v !== null) ?? undefined
    return value ?? undefined
}

export function useTrialEnrollment() {
    const route = useRoute()
    const router = useRouter()
    const { formatSlotDate, getClosestDate } = useFormatDate()

    const trialFormState = reactive<RegistrationForm>({ ...DEFAULT_TRIAL_FORM })
    const selectedClubId = ref<string | undefined>(parseQueryParam(route.query.clubId))
    const selectedSlotId = ref<string | undefined>(parseQueryParam(route.query.slotId))
    const pid = ref<string | undefined>(parseQueryParam(route.query.pid))

    const selectedClubSlots = computed(() => {
        const slots = MOCK_CLUBS_WITH_SLOTS.find((c) => c.id === selectedClubId.value)?.slots ?? []
        return [...slots].sort(
            (a, b) =>
                getClosestDate(a.dayOfWeek, a.startTime).valueOf() -
                getClosestDate(b.dayOfWeek, b.startTime).valueOf()
        )
    })

    const selectedVariant = computed(() => {
        if (!selectedClubId.value) return null
        const club = MOCK_CLUBS_WITH_SLOTS.find((c) => c.id === selectedClubId.value) ?? null
        const slot =
            selectedClubSlots.value.find((s) => s.id === Number(selectedSlotId.value)) ?? null
        return {
            name: club?.title ?? null,
            img: club?.img ?? null,
            slot: slot ? formatSlotDate(slot) : null
        }
    })

    watch([selectedClubId, selectedSlotId], ([clubId], [oldClubId]) => {
        if (oldClubId !== undefined && clubId !== oldClubId) {
            selectedSlotId.value = undefined
            pid.value = undefined
        }
        router.push({
            query: {
                clubId,
                slotId: selectedSlotId.value,
                pid: pid.value
            }
        })
    })

    function resetSelection() {
        selectedClubId.value = undefined
        selectedSlotId.value = undefined
        pid.value = undefined
    }

    onBeforeUnmount(() => resetSelection())

    async function onSubmit(event: FormSubmitEvent<RegistrationForm>) {
        console.log("Форма отправлена:", event.data)
        // API-запрос
    }

    return {
        clubs: MOCK_CLUBS_WITH_SLOTS,
        trialFormState,

        selectedClubId,
        selectedSlotId,
        pid,
        selectedClubSlots,
        selectedVariant,
        onSubmit
    }
}
