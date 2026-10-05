import { useEventListener } from "@vueuse/core"

import type {
    CheckoutError,
    CheckoutResponse,
    CheckoutSubscriptionRequest,
    CheckoutTrialRequest,
    ProblemCode
} from "~/types"

// Тексты по коду; коды без записи показывают detail бэка
const ERROR_MESSAGES: Partial<Record<ProblemCode, Omit<CheckoutError, "code">>> = {
    FORBIDDEN_RESOURCE: {
        title: "Ребёнок не найден",
        description: "Возможно, профиль ребёнка удалён. Список обновлён – выберите ребёнка ещё раз."
    },
    NOT_FOUND: {
        title: "Занятие больше недоступно",
        description: "Расписание изменилось. Мы обновили список – выберите время заново."
    },
    NO_AVAILABLE_SEATS: {
        title: "Места закончились",
        description: "Пока вы выбирали, место заняли. Список обновлён – выберите другое время."
    },
    PLAN_UNAVAILABLE: {
        title: "Тариф изменился",
        description: "Мы обновили тарифы – проверьте новую цену и нажмите ещё раз."
    },
    STUDENT_ALREADY_ENROLLED: {
        title: "Ребёнок уже записан",
        description: "Ребёнок уже занимается в одной из выбранных групп. Уберите её из состава."
    },
    TRIAL_LIMIT_EXCEEDED: {
        title: "Пробное уже было",
        description:
            "У ребёнка уже было пробное по этому кружку. Выберите другой кружок или оформите абонемент."
    },
    IDEMPOTENCY_KEY_REUSED: {
        title: "Не удалось отправить заказ",
        description: "Попробуйте нажать «Продолжить» ещё раз."
    },
    PAYMENT_IN_PROGRESS: {
        title: "Платёж уже обрабатывается",
        description: "Подождите несколько секунд и попробуйте снова."
    },
    PAYMENT_GATEWAY_UNAVAILABLE: {
        title: "Платёжный сервис недоступен",
        description: "Попробуйте через полминуты – заказ не создан, деньги не списаны."
    }
}

// Повтор безопасен: тот же состав уйдёт с тем же Idempotency-Key
const NETWORK_ERROR: Omit<CheckoutError, "code"> = {
    title: "Нет связи с сервером",
    description: "Проверьте интернет и нажмите ещё раз – второй заказ не создастся."
}

// Пробное на уже начавшееся занятие: бэк отвечает 422 с ошибкой в поле trial_date
const LESSON_STARTED: Omit<CheckoutError, "code"> = {
    title: "Запись на это занятие закрыта",
    description: "Занятие уже началось. Мы обновили список – выберите другое время."
}

// Число слотов не подошло тарифу: бэк отвечает 422 с ошибкой в поле slot_ids
const SLOT_COUNT_MISMATCH: Omit<CheckoutError, "code"> = {
    title: "Число кружков не подходит тарифу",
    description: "Тарифы обновились. Мы перезагрузили их – проверьте состав и цену."
}

// Ошибка валидации пришла в указанном поле
const hasInvalidParam = (err: unknown, name: string): boolean =>
    getProblem(err)?.extensions?.invalid_params?.some((p) => p.name === name) ?? false

// Ошибка валидации пришла именно по дате пробного
const isTrialDateClosed = (err: unknown): boolean => hasInvalidParam(err, "trial_date")

// Коды, после которых выбор на странице устарел и данные нужно перезапросить
const SLOTS_STALE_CODES: ReadonlySet<ProblemCode> = new Set(["NOT_FOUND", "NO_AVAILABLE_SEATS"])

interface CheckoutPaymentOptions {
    onSlotsStale?: () => unknown
    onPlansStale?: () => unknown
    onChildrenStale?: () => unknown
}

// Отправка заказа абонемента или пробного: ключ идемпотентности, переход к оплате, разбор ошибок.
export function useCheckoutPayment(options: CheckoutPaymentOptions = {}) {
    const billing = useBillingService()
    const authStore = useAuthStore()
    const route = useRoute()
    const { secondsLeft: cooldownSeconds, startTimer: startCooldown } = useOtpTimer()

    const isSubmitting = ref<boolean>(false)
    const error = ref<CheckoutError | null>(null)

    // ПОЧЕМУ: «назад» с ЮКассы достаёт страницу из bfcache с замершей кнопкой – оживляем её.
    // Ключ при этом прежний, повторный клик вернёт тот же заказ, а не создаст второй
    useEventListener("pageshow", (event: PageTransitionEvent) => {
        if (event.persisted) isSubmitting.value = false
    })

    // ПОЧЕМУ не ref: пара нужна только внутри submit и в шаблоне не участвует
    let lastAttempt: { fingerprint: string; key: string } | null = null

    // Тот же состав – тот же ключ (повтор после сбоя сети не создаёт второй заказ), иначе новый.
    function resolveIdempotencyKey(fingerprint: string): string {
        if (lastAttempt?.fingerprint !== fingerprint) {
            lastAttempt = { fingerprint, key: crypto.randomUUID() }
        }
        return lastAttempt.key
    }

    // Уводит на ЮКассу или сразу на экран результата, если оплачивать деньгами нечего.
    async function proceed(res: CheckoutResponse) {
        if (res.payment_url) {
            window.location.href = res.payment_url
            return
        }
        await navigateTo({ path: "/checkout/result", query: { tx: res.transaction_id } })
    }

    // Превращает ошибку бэка в текст под кнопкой и побочные действия по коду.
    function handleError(err: unknown) {
        const code = getProblemCode(err)
        // ПОЧЕМУ: без тела RFC 9457 parseApiError отдаёт сырое сообщение ofetch с URL – родителю оно ни к чему
        const problem = getProblem(err)
        const lessonStarted = isTrialDateClosed(err)
        const slotCountMismatch = hasInvalidParam(err, "slot_ids")
        const known = lessonStarted
            ? LESSON_STARTED
            : slotCountMismatch
              ? SLOT_COUNT_MISMATCH
              : code
                ? ERROR_MESSAGES[code]
                : problem
                  ? undefined
                  : NETWORK_ERROR
        const parsed = parseApiError(err, "Не удалось оформить заказ")
        error.value = {
            code,
            title: known?.title ?? parsed.title,
            description: known?.description ?? parsed.description ?? "",
            requestId: problem?.extensions?.request_id
        }

        if (code === "IDEMPOTENCY_KEY_REUSED") lastAttempt = null
        if (lessonStarted || (code && SLOTS_STALE_CODES.has(code))) void options.onSlotsStale?.()
        if (code === "FORBIDDEN_RESOURCE") void options.onChildrenStale?.()
        if (code === "PLAN_UNAVAILABLE" || slotCountMismatch) void options.onPlansStale?.()

        const retryAfter = getRetryAfter(err)
        if (retryAfter) startCooldown(retryAfter)
    }

    // Общий цикл отправки: гейт входа, ключ, запрос, переход или ошибка.
    async function submit(
        payload: CheckoutSubscriptionRequest | CheckoutTrialRequest,
        request: (key: string) => Promise<CheckoutResponse>
    ) {
        if (isSubmitting.value || cooldownSeconds.value > 0) return
        if (!authStore.isAuthed) {
            await navigateTo({ path: "/login", query: { redirectFrom: route.fullPath } })
            return
        }

        isSubmitting.value = true
        error.value = null
        try {
            const res = await request(resolveIdempotencyKey(createOrderFingerprint(payload)))
            await proceed(res)
            // ПОЧЕМУ isSubmitting не сбрасывается при успехе: страница уходит, кнопка не должна «оживать»
        } catch (err) {
            // ПОЧЕМУ до разбора: сбой в handleError не должен оставить кнопку в вечной загрузке
            isSubmitting.value = false
            handleError(err)
        }
    }

    const submitSubscription = (payload: CheckoutSubscriptionRequest) =>
        submit(payload, (key) => billing.checkoutSubscription(payload, key))

    const submitTrial = (payload: CheckoutTrialRequest) =>
        submit(payload, (key) => billing.checkoutTrial(payload, key))

    return {
        isSubmitting: readonly(isSubmitting),
        error: readonly(error),
        cooldownSeconds,
        submitSubscription,
        submitTrial
    }
}
