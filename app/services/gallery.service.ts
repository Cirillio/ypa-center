import type { ApiFetch } from "~/composables/useApi"
import type { GalleryPage, GalleryPhoto } from "~/types"

/**
 * Публичная галерея.
 * Эндпоинт: GET /api/v1/public/gallery/
 *
 * WHY два метода: бэк отдаёт голый массив без query-параметров (обратная
 * совместимость) и конверт {count, next, previous, results} при ?limit.
 */
export class GalleryService {
    constructor(private readonly fetch: ApiFetch) {}

    /** Весь список массивом — для блоков с фиксированным числом фото */
    getAll(): Promise<GalleryPhoto[]> {
        return this.fetch<GalleryPhoto[]>("/v1/public/gallery/")
    }

    /** Постраничная выдача — для подгрузки по кнопке */
    getPage(limit: number, offset = 0): Promise<GalleryPage> {
        return this.fetch<GalleryPage>("/v1/public/gallery/", {
            query: offset ? { limit, offset } : { limit }
        })
    }
}

export const useGalleryService = () => new GalleryService(useApi().apiFetch)
