import { z } from "zod"
import { fields } from "~/schemas/fields"

// Контакты гостя для подтверждения записи на событие (без входа в кабинет).
export const eventContactsSchema = z.object({
    parentName: z.string().trim().min(2, "Введите имя").max(100, "Слишком длинное значение"),
    childName: z.string().trim().min(2, "Введите имя ребёнка").max(100, "Слишком длинное значение"),
    phone: fields.phone,
    email: fields.email,
    consent: fields.consent
})

export type EventContacts = z.infer<typeof eventContactsSchema>
