import { z } from "zod"
import { fields } from "~/schemas/fields"

export const feedbackSchema = z.object({
    name: z.string().max(100, "Слишком длинное имя").optional(),
    email: fields.email,
    message: z
        .string()
        .min(10, "Опишите вопрос чуть подробнее")
        .max(1000, "Сообщение слишком длинное")
})

export type FeedbackFormState = z.infer<typeof feedbackSchema>
