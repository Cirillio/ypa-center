import type { EventContacts } from "~/schemas/event-contacts.schema"
import type { CheckoutError, EventItem, EventRegistrationResult } from "~/types"

// Тексты по полю, в котором бэк вернул 422: бронь отклоняется валидацией, а не кодом
const FIELD_ERRORS: Readonly<Record<string, Omit<CheckoutError, "code">>> = {
    phone: {
        title: "Вы уже записаны",
        description: "На это событие с этим номером уже есть запись. Ждите звонка менеджера."
    },
    attendees_count: {
        title: "Мест меньше, чем нужно",
        description:
            "Пока вы заполняли форму, места заняли. Афиша обновлена – уменьшите число мест."
    },
    event: {
        title: "Запись закрыта",
        description: "Событие уже началось или прошло. Выберите другое в афише."
    }
}

const NOT_FOUND: Omit<CheckoutError, "code"> = {
    title: "Событие недоступно",
    description: "Его сняли с афиши. Список обновлён – выберите другое."
}

const NETWORK_ERROR: Omit<CheckoutError, "code"> = {
    title: "Нет связи с сервером",
    description: "Проверьте интернет и нажмите ещё раз."
}

// Поля, после ошибки по которым афиша устарела и её надо перезапросить
const STALE_FIELDS: ReadonlySet<string> = new Set(["attendees_count", "event"])

interface EventRegistrationOptions {
    onEventsStale?: () => unknown
}

// Отправка брони на событие: сборка тела, разбор 422 по полю, кулдаун по Retry-After.
export function useEventRegistration(options: EventRegistrationOptions = {}) {
    const eventsService = useEventsService()
    const { secondsLeft: cooldownSeconds, startTimer: startCooldown } = useOtpTimer()

    const isSubmitting = ref<boolean>(false)
    const error = ref<CheckoutError | null>(null)
    const result = ref<EventRegistrationResult | null>(null)

    // Превращает ошибку бэка в текст под кнопкой и побочные действия.
    function handleError(err: unknown) {
        const problem = getProblem(err)
        const code = getProblemCode(err)
        const field = problem?.extensions?.invalid_params?.find((p) => p.name in FIELD_ERRORS)?.name
        const known = field
            ? FIELD_ERRORS[field]
            : code === "NOT_FOUND"
              ? NOT_FOUND
              : problem
                ? undefined
                : NETWORK_ERROR
        const parsed = parseApiError(err, "Не удалось отправить заявку")
        error.value = {
            code,
            title: known?.title ?? parsed.title,
            description: known?.description ?? parsed.description ?? "",
            requestId: problem?.extensions?.request_id
        }

        if ((field && STALE_FIELDS.has(field)) || code === "NOT_FOUND")
            void options.onEventsStale?.()

        const retryAfter = getRetryAfter(err)
        if (retryAfter) startCooldown(retryAfter)
    }

    // Отправляет бронь; при успехе фиксирует итог для экрана подтверждения.
    async function submit(event: EventItem, seats: number, contacts: EventContacts) {
        if (isSubmitting.value || cooldownSeconds.value > 0) return
        isSubmitting.value = true
        error.value = null
        try {
            await eventsService.register(event.id, {
                child_name: contacts.childName.trim(),
                parent_name: contacts.parentName.trim(),
                phone: toE164Phone(contacts.phone),
                email: contacts.email.trim(),
                attendees_count: seats,
                pd_consent: contacts.consent,
                website_url: ""
            })
            result.value = {
                eventTitle: event.title,
                startDatetime: event.start_datetime,
                seats,
                isFree: event.is_free
            }
        } catch (err) {
            handleError(err)
        } finally {
            isSubmitting.value = false
        }
    }

    return {
        submit,
        isSubmitting: readonly(isSubmitting),
        cooldownSeconds,
        error: readonly(error),
        result: readonly(result)
    }
}
