import type { ApiFetch } from "~/composables/useApi"

export type ApiFetchOptions = Parameters<ApiFetch>[1]

export interface ApiCall {
    path: string
    opts: ApiFetchOptions
}

// Фейковый транспорт для сервисов: записывает вызовы и отдаёт заранее заданный ответ
export function createFakeFetch(respond: (path: string, opts: ApiFetchOptions) => unknown) {
    const calls: ApiCall[] = []
    const fetch: ApiFetch = async <T>(path: string, opts?: ApiFetchOptions): Promise<T> => {
        calls.push({ path, opts })
        // ПОЧЕМУ приведение: ApiFetch обобщён по T, а ответ задаёт сам тест типизированной фикстурой
        return (await respond(path, opts)) as T
    }
    return { fetch, calls }
}

// Транспорт, который всегда падает – для проверки, что сервис не глотает ошибки
export function createFailingFetch(error: unknown): ApiFetch {
    return async () => {
        throw error
    }
}
