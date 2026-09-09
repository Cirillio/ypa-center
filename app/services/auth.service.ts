import type { ApiFetch } from "~/composables/useApi"
import type { OtpRequestResult } from "~/types"
import type { AuthTokens } from "~/utils/auth-tokens"

interface OtpRequestResponse {
    status: string
    resend_available_in: number
    code_ttl: number
}

/**
 * Пассвордлесс-вход по OTP на email.
 * Эндпоинты: POST /auth/otp/request/, /auth/otp/verify/, /auth/logout/
 *
 * WHY здесь нет refresh: обновление access живёт внутри useApi как сырой $fetch —
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

    verifyOtp(email: string, code: string): Promise<AuthTokens> {
        return this.fetch<AuthTokens>("/v1/auth/otp/verify/", {
            method: "POST",
            body: { email: email.trim(), code: code.trim() }
        })
    }

    async logout(refresh: string): Promise<void> {
        await this.fetch("/v1/auth/logout/", {
            method: "POST",
            body: { refresh }
        })
    }
}

export const useAuthService = () => new AuthService(useApi().apiFetch)
