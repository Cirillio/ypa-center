import { useEventListener } from "@vueuse/core"

import type { EventContacts } from "~/schemas/event-contacts.schema"
import type {
    CheckoutError,
    EventItem,
    EventRegistrationOutcome,
    EventRegistrationResult,
    ProblemCode
} from "~/types"

// Тексты по полю, в котором бэк вернул 422: бронь отклоняется валидацией, а не кодом
const FIELD_ERRORS: Readonly<Record<string, Omit<CheckoutError, "code">>> = {
    phone: {
        title: "Бронь уже есть",
        description:
            "На это событие с этим номером уже есть запись. Если вы её не оплатили, она снимется сама примерно через 20 минут – тогда запишитесь снова."
    },
    attendees_count: {
        title: "Мест меньше, чем нужно",
        description:
            "Пока вы заполняли форму, места заняли. Афиша обновлена – уменьшите число мест."
    },
    event: {
        title: "Запись закрыта",
        description: "Событие уже началось или прошло. Выберите другое в афише."
    },
    email: {
        title: "Нужна почта",
        description: "На неё придёт чек, а если бронь снимется – письмо и возврат денег."
    }
}

// Тексты по коду; коды без записи показывают detail бэка
const CODE_ERRORS: Partial<Record<ProblemCode, Omit<CheckoutError, "code">>> = {
    NOT_FOUND: {
        title: "Событие недоступно",
        description: "Его сняли с афиши. Список обновлён – выберите другое."
    },
    EVENT_PRICE_CHANGED: {
        title: "Цена изменилась",
        description:
            "Пока вы заполняли форму, цену события поменяли. Афиша обновлена – проверьте сумму."
    },
    IDEMPOTENCY_KEY_REUSED: {
        title: "Не удалось отправить заявку",
        description: "Нажмите «Перейти к оплате» ещё раз."
    },
    PAYMENT_IN_PROGRESS: {
        title: "Платёж уже обрабатывается",
        description: "Подождите несколько секунд и попробуйте снова."
    },
    PAYMENT_GATEWAY_UNAVAILABLE: {
        title: "Платёжный сервис недоступен",
        description: "Попробуйте через полминуты – бронь не создана, деньги не списаны."
    },
    RATE_LIMITED: {
        title: "Слишком много попыток",
        description: "Подождите минуту и отправьте заявку ещё раз."
    }
}

// Повтор безопасен: та же форма уйдёт с тем же ключом
const NETWORK_ERROR: Omit<CheckoutError, "code"> = {
    title: "Нет связи с сервером",
    description: "Проверьте интернет и нажмите ещё раз – вторая бронь не создастся."
}

// Поля и коды, после которых афиша устарела и её надо перезапросить
const STALE_FIELDS: ReadonlySet<string> = new Set(["attendees_count", "event"])
const STALE_CODES: ReadonlySet<ProblemCode> = new Set(["NOT_FOUND", "EVENT_PRICE_CHANGED"])

interface EventRegistrationOptions {
    onEventsStale?: () => unknown
}

// Бронь на событие: ключ идемпотентности у платного, переход к оплате, разбор ошибок.
export function useEventRegistration(options: EventRegistrationOptions = {}) {
    const eventsService = useEventsService()
    const { secondsLeft: cooldownSeconds, startTimer: startCooldown } = useOtpTimer()

    const isSubmitting = ref<boolean>(false)
    const error = ref<CheckoutError | null>(null)
    const result = ref<EventRegistrationResult | null>(null)

    // ПОЧЕМУ: «назад» с ЮKassa достаёт страницу из bfcache с замершей кнопкой – оживляем её
    useEventListener("pageshow", (event: PageTransitionEvent) => {
        if (event.persisted) isSubmitting.value = false
    })

    // ПОЧЕМУ не ref: пара нужна только внутри submit и в шаблоне не участвует
    let lastAttempt: { fingerprint: string; key: string } | null = null

    // Та же форма – тот же ключ (повтор после сбоя не создаёт вторую бронь), иначе новый.
    function resolveIdempotencyKey(fingerprint: string): string {
        if (lastAttempt?.fingerprint !== fingerprint) {
            lastAttempt = { fingerprint, key: crypto.randomUUID() }
        }
        return lastAttempt.key
    }

    // Превращает ошибку бэка в текст под кнопкой и побочные действия.
    function handleError(err: unknown) {
        const problem = getProblem(err)
        const code = getProblemCode(err)
        const field = problem?.extensions?.invalid_params?.find((p) => p.name in FIELD_ERRORS)?.name
        const known = field
            ? FIELD_ERRORS[field]
            : code
              ? CODE_ERRORS[code]
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

        if (code === "IDEMPOTENCY_KEY_REUSED") lastAttempt = null
        if ((field && STALE_FIELDS.has(field)) || (code && STALE_CODES.has(code)))
            void options.onEventsStale?.()

        const retryAfter = getRetryAfter(err)
        if (retryAfter) startCooldown(retryAfter)
    }

    // Платное – уводит на ЮKassa (или на экран результата без внешней страницы), бесплатное – экран подтверждения.
    async function proceed(outcome: EventRegistrationOutcome, event: EventItem, seats: number) {
        if (outcome.kind === "accepted") {
            result.value = { eventTitle: event.title, startDatetime: event.start_datetime, seats }
            return
        }
        if (outcome.paymentUrl) {
            await navigateTo(outcome.paymentUrl, { external: true })
            return
        }
        await navigateTo({
            path: "/checkout/result",
            query: { tx: outcome.transactionId, kind: "event" }
        })
    }

    // Отправляет бронь; ключ – только у платного события, бесплатному бэк его не требует.
    async function submit(event: EventItem, seats: number, contacts: EventContacts) {
        if (isSubmitting.value || cooldownSeconds.value > 0) return
        isSubmitting.value = true
        error.value = null
        const key = event.is_free
            ? undefined
            : resolveIdempotencyKey(createEventOrderFingerprint(event.id, seats, contacts))
        try {
            const outcome = await eventsService.register(
                event.id,
                {
                    child_name: contacts.childName.trim(),
                    parent_name: contacts.parentName.trim(),
                    phone: toE164Phone(contacts.phone),
                    email: contacts.email.trim(),
                    attendees_count: seats,
                    pd_consent: contacts.consent,
                    website_url: ""
                },
                key
            )
            await proceed(outcome, event, seats)
            // ПОЧЕМУ кнопка не «оживает» после ухода на оплату: страница уходит
            if (outcome.kind === "accepted") isSubmitting.value = false
        } catch (err) {
            // ПОЧЕМУ до разбора: сбой в handleError не должен оставить кнопку в вечной загрузке
            isSubmitting.value = false
            handleError(err)
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
