import { type EventContacts, eventContactsSchema } from "~/schemas/event-contacts.schema"
import type { EventItem } from "~/types"

// Управляет загрузкой афиши, выбором доступного события и синхронизацией с query-параметром eventId.
export function useEventCheckout() {
    const route = useRoute()
    const router = useRouter()
    const eventsService = useEventsService()

    const {
        data: eventsData,
        status: eventsStatus,
        error: eventsError,
        refresh: refreshEvents
    } = useAsyncData("events", () => eventsService.getAll())

    const events = computed<EventItem[]>(() => eventsData.value ?? [])
    const isLoading = computed(() => eventsStatus.value === "pending")

    const rawQueryEventId = parseQueryParam(route.query.eventId)
    const parsedInitialId =
        rawQueryEventId !== undefined && /^\d+$/.test(rawQueryEventId)
            ? Number(rawQueryEventId)
            : undefined

    const requestedEventId = ref<number | undefined>(parsedInitialId)

    // Выбор выводится из афиши, а не чинится watch'ем: на SSR watch не реагирует на
    // догрузку данных, и сервер с клиентом расходились (hydration mismatch).
    const selectedEventId = computed<number | undefined>({
        get: () => {
            const id = requestedEventId.value
            return events.value.some((e) => e.id === id && e.availableSeats > 0) ? id : undefined
        },
        set: (id) => {
            requestedEventId.value = id
        }
    })

    const selectedEvent = computed<EventItem | null>(
        () => events.value.find((event) => event.id === selectedEventId.value) ?? null
    )

    // Отражает фактический выбор в query без новых записей в истории.
    function syncQuery(id: number | undefined) {
        void router.replace({
            query: { ...route.query, eventId: id !== undefined ? String(id) : undefined }
        })
    }

    watch(selectedEventId, syncQuery)

    // Убирает из URL невалидный eventId из ссылки (нет такого события или нет мест).
    onMounted(() => {
        if (events.value.length > 0 && route.query.eventId && selectedEventId.value === undefined) {
            syncQuery(undefined)
        }
    })

    // Места: запрошенное число хранится как есть, фактическое ограничено остатком события.
    const requestedSeats = ref<number>(1)
    const maxSeats = computed(() => selectedEvent.value?.availableSeats ?? 1)
    const seats = computed(() => Math.max(1, Math.min(requestedSeats.value, maxSeats.value)))

    // Меняет число мест на шаг в пределах 1..остаток.
    function changeSeats(delta: number) {
        requestedSeats.value = Math.max(1, Math.min(seats.value + delta, maxSeats.value))
    }

    const contacts = ref<EventContacts>({ name: "", phone: "", email: "", consent: false })
    const isContactsValid = computed(() => eventContactsSchema.safeParse(contacts.value).success)

    const isFree = computed(() => !!selectedEvent.value?.is_free)
    // Сумма в копейках, как цена в API; для показа – formatRub.
    const totalKopecks = computed(() => (selectedEvent.value?.price ?? 0) * seats.value)
    const isReady = computed(() => !!selectedEvent.value && isContactsValid.value)

    return {
        events,
        isLoading,
        eventsError,
        refreshEvents,
        selectedEventId,
        selectedEvent,
        seats,
        maxSeats,
        changeSeats,
        contacts,
        isContactsValid,
        isFree,
        totalKopecks,
        isReady
    }
}
