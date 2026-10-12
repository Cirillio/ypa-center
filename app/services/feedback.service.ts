import type { ApiFetch } from "~/composables/useApi"
import type { FeedbackRequestPayload, FeedbackRequestResponse } from "~/types"

export interface SendFeedbackDto {
    name?: string
    email: string
    message: string
    pd_consent: boolean
    captcha_token: string
}

/**
 * Форма обратной связи.
 * Эндпоинт: POST /api/v1/public/feedback/
 */
export class FeedbackService {
    constructor(private readonly fetch: ApiFetch) {}

    send(dto: SendFeedbackDto): Promise<FeedbackRequestResponse> {
        const payload: FeedbackRequestPayload = {
            name: dto.name?.trim() || undefined,
            email: dto.email,
            message: dto.message,
            pd_consent: dto.pd_consent,
            website_url: "",
            captcha_token: dto.captcha_token
        }

        return this.fetch<FeedbackRequestResponse>("/v1/public/feedback/", {
            method: "POST",
            body: payload
        })
    }
}

export const useFeedbackService = () => new FeedbackService(useApi().apiFetch)
