import type { ApiFetch } from "~/composables/useApi"
import type { CallbackRequestPayload, CallbackRequestResponse, PreferredTimeWindow } from "~/types"

export interface SendCallbackDto {
    phone: string
    preferred_time_window: PreferredTimeWindow
    name: string
    captcha_token: string
}

/**
 * Заявка на обратный звонок.
 * Эндпоинт: POST /api/v1/public/callback/
 */
export class CallbackService {
    constructor(private readonly fetch: ApiFetch) {}

    send(dto: SendCallbackDto): Promise<CallbackRequestResponse> {
        const payload: CallbackRequestPayload = {
            name: dto.name,
            // Нормализация номера в формат E.164 (+79991234567) для бэкенда
            phone: dto.phone.replace(/[^\d+]/g, ""),
            preferred_time_window: dto.preferred_time_window,
            website_url: "",
            captcha_token: dto.captcha_token
        }

        return this.fetch<CallbackRequestResponse>("/v1/public/callback/", {
            method: "POST",
            body: payload
        })
    }
}

export const useCallbackService = () => new CallbackService(useApi().apiFetch)
