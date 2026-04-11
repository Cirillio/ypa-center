import type { LocationQueryValue } from "vue-router"
import type { FormSubmitEvent } from "@nuxt/ui"
import { type EventRegistration, eventRegistrationSchema } from "~/schemas/event.schema"
import { MOCK_EVENTS } from "~/constants/mock"
import type { EventShort } from "~/types"

const DEFAULT_EVENT_FORM: EventRegistration = {
    participantName: "",
    parentFullName: "",
    phone: "",
    telegram: "",
    participants: "1",
    referralSource: "",
    comments: ""
}

function parseQueryParam(
    value: LocationQueryValue | LocationQueryValue[] | undefined
): string | undefined {
    if (Array.isArray(value)) return value.find((v): v is string => v !== null) ?? undefined
    return value ?? undefined
}

export function useEventEnrollment() {
    const route = useRoute()
    const router = useRouter()

    // TODO: заменить на $fetch<EventShort[]>('/api/events')
    const { data: eventsData, status: eventsStatus } = useAsyncData(
        "enrollment:events",
        async (): Promise<EventShort[]> => {
            // Имитация задержки сети
            await new Promise((resolve) => setTimeout(resolve, 1000))
            return MOCK_EVENTS
        }
    )

    const events = computed(() => eventsData.value ?? [])

    const eventFormState = reactive<EventRegistration>({ ...DEFAULT_EVENT_FORM })
    const selectedEventId = ref<string | undefined>(parseQueryParam(route.query.eventId))
    const isSubmitting = ref(false)

    const selectedEvent = computed(
        () => events.value.find((e) => e.id === selectedEventId.value) ?? null
    )

    watch(selectedEventId, (id) => {
        if (!events.value.length) return
        router.push({ query: { eventId: id } })
    })

    onBeforeUnmount(() => {
        selectedEventId.value = undefined
    })

    async function onSubmit(event: FormSubmitEvent<EventRegistration>) {
        isSubmitting.value = true
        try {
            console.log("Форма отправлена:", event.data)
            // TODO: $fetch('/api/events/register', { method: 'POST', body: event.data })
        } finally {
            isSubmitting.value = false
        }
    }

    return {
        events,
        eventsStatus,
        eventFormState,
        eventRegistrationSchema,
        selectedEventId,
        selectedEvent,
        isSubmitting,
        onSubmit
    }
}
