import type { ActiveEnrollmentDto, ProblemCode, ProblemDetail } from "~/types"

export type ApiError = { title: string; description?: string }

const PROBLEM_CODES: ReadonlySet<string> = new Set<ProblemCode>([
    "MALFORMED_REQUEST",
    "AUTH_REQUIRED",
    "OTP_INVALID",
    "FORBIDDEN_RESOURCE",
    "PROFILE_INCOMPLETE",
    "NOT_FOUND",
    "NO_AVAILABLE_SEATS",
    "TRIAL_LIMIT_EXCEEDED",
    "STUDENT_ALREADY_ENROLLED",
    "CHILD_HAS_ACTIVE_ENROLLMENTS",
    "SUBSCRIPTION_EXPIRED",
    "IDEMPOTENCY_KEY_REUSED",
    "PAYMENT_IN_PROGRESS",
    "PAYMENT_GATEWAY_UNAVAILABLE",
    "PLAN_UNAVAILABLE",
    "EVENT_PRICE_CHANGED",
    "VALIDATION_ERROR",
    "RATE_LIMITED",
    "INTERNAL_SERVER_ERROR"
])

// ПОЧЕМУ: ProfileIncomplete пока приходит без code, только с type (api-core-contracts.md, Сценарий 3)
const PROFILE_INCOMPLETE_TYPE = "urn:problem-type:profileincomplete"

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null

const isProblemCode = (value: unknown): value is ProblemCode =>
    typeof value === "string" && PROBLEM_CODES.has(value)

type InvalidParam = NonNullable<NonNullable<ProblemDetail["extensions"]>["invalid_params"]>[number]

const isInvalidParam = (value: unknown): value is InvalidParam =>
    isRecord(value) && typeof value.name === "string" && typeof value.reason === "string"

const isActiveEnrollment = (value: unknown): value is ActiveEnrollmentDto =>
    isRecord(value) &&
    typeof value.id === "number" &&
    (value.type === "REGULAR" || value.type === "TRIAL") &&
    typeof value.status === "string" &&
    typeof value.activity_name === "string" &&
    typeof value.group_name === "string" &&
    (value.subscription_id === null || typeof value.subscription_id === "number") &&
    (value.trial_date === null || typeof value.trial_date === "string")

// Разбирает extensions по полям: мусор от бэка отбрасывается, а не протекает в UI.
function parseExtensions(raw: unknown): ProblemDetail["extensions"] {
    if (!isRecord(raw)) return undefined
    return {
        request_id: typeof raw.request_id === "string" ? raw.request_id : undefined,
        invalid_params: Array.isArray(raw.invalid_params)
            ? raw.invalid_params.filter(isInvalidParam)
            : undefined,
        active_enrollments: Array.isArray(raw.active_enrollments)
            ? raw.active_enrollments.filter(isActiveEnrollment)
            : undefined
    }
}

// Достаёт тело RFC 9457 из ошибки ofetch, проверяя форму вместо слепого приведения.
export function getProblem(err: unknown): ProblemDetail | null {
    if (!isRecord(err) || !isRecord(err.data)) return null
    const data = err.data
    if (typeof data.status !== "number" || typeof data.title !== "string") return null
    return {
        type: typeof data.type === "string" ? data.type : "",
        title: data.title,
        status: data.status,
        detail: typeof data.detail === "string" ? data.detail : "",
        code: typeof data.code === "string" ? data.code : undefined,
        instance: typeof data.instance === "string" ? data.instance : undefined,
        extensions: parseExtensions(data.extensions)
    }
}

// Машинный код ошибки для switch; неизвестный или отсутствующий код – undefined.
export function getProblemCode(err: unknown): ProblemCode | undefined {
    const problem = getProblem(err)
    if (!problem) return undefined
    if (isProblemCode(problem.code)) return problem.code
    if (problem.type === PROFILE_INCOMPLETE_TYPE) return "PROFILE_INCOMPLETE"
    return undefined
}

// Список живых записей ребёнка из 409 CHILD_HAS_ACTIVE_ENROLLMENTS.
export function getActiveEnrollments(err: unknown): ActiveEnrollmentDto[] {
    return getProblem(err)?.extensions?.active_enrollments ?? []
}

export function parseApiError(
    err: unknown,
    fallbackMessage = "Не удалось выполнить запрос"
): ApiError {
    const problem = getProblem(err)

    if (!problem) {
        return {
            title: "Ошибка сети",
            description: err instanceof Error && err.message ? err.message : fallbackMessage
        }
    }

    const invalidParams = problem.extensions?.invalid_params
    if (invalidParams && invalidParams.length > 0) {
        return {
            title: problem.detail || "Ошибка заполнения",
            description: invalidParams.map((p) => p.reason).join(" ")
        }
    }

    return {
        title: problem.title || "Ошибка",
        description: problem.detail || fallbackMessage
    }
}

// Пауза перед повтором из заголовка Retry-After (секунды); HTTP-дата и мусор – null.
export function getRetryAfter(err: unknown): number | null {
    if (!isRecord(err) || !isRecord(err.response)) return null
    const headers = err.response.headers
    if (!(headers instanceof Headers)) return null
    const raw = headers.get("Retry-After")
    if (raw === null || !/^\d+$/.test(raw.trim())) return null
    return Number(raw.trim())
}

export function getFetchStatus(err: unknown): number | undefined {
    if (!isRecord(err)) return undefined
    if (typeof err.status === "number") return err.status
    if (typeof err.statusCode === "number") return err.statusCode
    const response = err.response
    return isRecord(response) && typeof response.status === "number" ? response.status : undefined
}
