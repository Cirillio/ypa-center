import type { FetchError } from "ofetch"
import type { ProblemDetail } from "~/types"

export type ApiError = { title: string; description?: string }

export function parseApiError(
    err: unknown,
    fallbackMessage = "Не удалось выполнить запрос"
): ApiError {
    const fetchError = err as FetchError<ProblemDetail>
    const problem = fetchError?.data

    if (!problem) {
        return {
            title: "Ошибка сети",
            description: (err as Error)?.message || fallbackMessage
        }
    }

    // Если 422 и есть конкретные поля валидации
    const invalidParams = problem.extensions?.invalid_params
    if (invalidParams && invalidParams.length > 0) {
        return {
            title: problem.detail || "Ошибка заполнения",
            description: invalidParams.map((p) => p.reason).join(" ")
        }
    }

    // Для 429, 400, 500 и прочих
    return {
        title: problem.title || "Ошибка",
        description: problem.detail || fallbackMessage
    }
}

export function getFetchStatus(err: unknown): number | undefined {
    const fetchError = err as FetchError | undefined
    return fetchError?.status ?? fetchError?.statusCode ?? fetchError?.response?.status
}
