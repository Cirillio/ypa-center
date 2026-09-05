import type { FeedbackRequestPayload, FeedbackRequestResponse } from "~/types"

export interface SendFeedbackDto {
    name?: string
    email: string
    message: string
    captcha_token: string
}

export function useFeedbackService() {
    const { apiFetch } = useApi()

    /**
     * Отправка формы обратной связи.
     * Эндпоинт: POST /api/v1/public/feedback/
     */
    async function sendFeedbackRequest(dto: SendFeedbackDto): Promise<FeedbackRequestResponse> {
        const payload: FeedbackRequestPayload = {
            name: dto.name?.trim() || undefined,
            email: dto.email,
            message: dto.message,
            website_url: "",
            captcha_token: dto.captcha_token
        }

        return apiFetch<FeedbackRequestResponse>("/v1/public/feedback/", {
            method: "POST",
            body: payload
        })
    }

    return {
        sendFeedbackRequest
    }
}
