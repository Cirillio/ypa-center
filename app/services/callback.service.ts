import type { CallbackRequestPayload, CallbackRequestResponse, PreferredTimeWindow } from "~/types"

export interface SendCallbackDto {
    phone: string
    preferred_time_window: PreferredTimeWindow
    name: string
    captcha_token: string
}

export function useCallbackService() {
    const { apiFetch } = useApi()

    /**
     * Отправка заявки на обратный звонок.
     * Эндпоинт: POST /api/v1/public/callback/
     */
    async function sendCallbackRequest(dto: SendCallbackDto): Promise<CallbackRequestResponse> {
        // Нормализация номера в формат E.164 (+79991234567) для бэкенда
        const normalizedPhone = dto.phone.replace(/[^\d+]/g, "")

        const payload: CallbackRequestPayload = {
            name: dto.name,
            phone: normalizedPhone,
            preferred_time_window: dto.preferred_time_window,
            website_url: "",
            captcha_token: dto.captcha_token
        }

        return apiFetch<CallbackRequestResponse>("/v1/public/callback/", {
            method: "POST",
            body: payload
        })
    }

    return {
        sendCallbackRequest
    }
}
