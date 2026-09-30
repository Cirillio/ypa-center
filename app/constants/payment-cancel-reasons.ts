// Причины отмены платежа ЮKassa (cancellation_details.reason) человеческим языком; неизвестная – общий текст.
export const PAYMENT_CANCEL_REASONS: Readonly<Record<string, string>> = {
    expired_on_confirmation: "Время на оплату истекло",
    insufficient_funds: "На карте недостаточно средств",
    card_expired: "Срок действия карты истёк",
    "3d_secure_failed": "Не прошло подтверждение 3-D Secure",
    payment_method_rejected: "Банк отклонил способ оплаты",
    bank_declined: "Банк отклонил платёж",
    fraud_suspected: "Платёж отклонён банком",
    internal_timeout: "Технический сбой при оплате",
    general_decline: "Банк отклонил платёж"
}

export const PAYMENT_CANCEL_FALLBACK = "Оплата не прошла или была отменена"
