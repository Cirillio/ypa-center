import type { CheckoutTransactionReason } from "~/types"

// Почему оплаченный заказ не оформился – уточнение под заголовком; NOT_FULFILLED и неизвестное – без уточнения.
export const REFUND_REASONS: Readonly<Partial<Record<CheckoutTransactionReason, string>>> = {
    SEATS_TAKEN: "Место в группе успели занять, пока шла оплата.",
    GROUP_CLOSED: "Группа закрыта.",
    PAID_AFTER_EXPIRY: "Оплата пришла после того, как бронь истекла.",
    AMOUNT_MISMATCH: "Сумма оплаты не совпала с заказом.",
    CANCELED_BY_CENTER: "Центр отменил запись на событие."
}
