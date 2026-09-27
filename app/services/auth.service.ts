import type { ApiFetch } from "~/composables/useApi"
import type { OtpRequestResult, OtpVerifyResponse, OtpVerifyResult } from "~/types"

interface OtpRequestResponse {
    status: string
    resend_available_in: number
    code_ttl: number
}

/**
 * Пассвордлесс-вход по OTP на email.
 * Эндпоинты: POST /auth/otp/request/, /auth/otp/verify/, /auth/logout/
 *
 * WHY здесь нет refresh: обновление access живёт внутри useApi как сырой $fetch –
 * он намеренно минует перехватчик, иначе 401 на самом refresh уйдёт в рекурсию.
 */
export class AuthService {
    constructor(private readonly fetch: ApiFetch) {}

    async requestOtp(email: string): Promise<OtpRequestResult> {
        const res = await this.fetch<OtpRequestResponse>("/v1/auth/otp/request/", {
            method: "POST",
            body: { email: email.trim() }
        })
        return {
            resendAvailableIn: res.resend_available_in,
            codeTtl: res.code_ttl
        }
    }

    /** Кроме токенов отдаёт флаг анкеты – отдельный GET /me/profile/ после входа не нужен */
    async verifyOtp(email: string, code: string): Promise<OtpVerifyResult> {
        const res = await this.fetch<OtpVerifyResponse>("/v1/auth/otp/verify/", {
            method: "POST",
            body: { email: email.trim(), code: code.trim() }
        })
        return {
            access: res.access,
            refresh: res.refresh,
            profileCompleted: res.profile_completed
        }
    }

    async logout(refresh: string): Promise<void> {
        await this.fetch("/v1/auth/logout/", {
            method: "POST",
            body: { refresh }
        })
    }
}

export const useAuthService = () => new AuthService(useApi().apiFetch)
