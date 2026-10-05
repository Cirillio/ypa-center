import { toE164Phone } from "~/utils/masks"
import type { EventContacts } from "~/schemas/event-contacts.schema"
import type { CheckoutSubscriptionRequest, CheckoutTrialRequest } from "~/types"

// Детерминированная строка состава заказа: совпала – повтор той же попытки, тот же Idempotency-Key.
export function createOrderFingerprint(
    payload: CheckoutSubscriptionRequest | CheckoutTrialRequest
): string {
    if ("slot_ids" in payload) {
        // ПОЧЕМУ сортировка: порядок кликов по слотам не меняет заказ, бэк сверяет множество
        const slots = [...payload.slot_ids].sort((a, b) => a - b).join(",")
        return `sub|${payload.plan_id}|${payload.student_id}|${slots}|${payload.use_deposit}`
    }
    return `trial|${payload.student_id}|${payload.schedule_id}|${payload.trial_date}`
}

// Отпечаток формы брони события: та же форма – тот же ключ, согласие в него не входит.
export function createEventOrderFingerprint(
    eventId: number,
    seats: number,
    contacts: EventContacts
): string {
    return [
        "event",
        eventId,
        seats,
        toE164Phone(contacts.phone),
        contacts.email.trim(),
        contacts.parentName.trim(),
        contacts.childName.trim()
    ].join("|")
}
