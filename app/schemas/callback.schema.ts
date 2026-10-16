import { z } from "zod"
import { fields } from "~/schemas/fields"

// Заявка на звонок: имя необязательно, но если введено – не короче 2 букв
export const callbackSchema = z.object({
    name: z
        .string()
        .trim()
        .refine((v) => v.length === 0 || v.length >= 2, "Имя – от 2 букв")
        .optional(),
    phone: fields.phone,
    consent: fields.consent
})
