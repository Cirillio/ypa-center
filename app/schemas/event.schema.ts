import { z } from "zod"
import { fields } from "~/schemas/fields"

export const eventRegistrationSchema = z.object({
    participantName: fields.fullName,
    parentFullName: fields.fullName,
    phone: fields.phone,
    email: fields.email,
    participants: z.string().min(1, "Укажите количество участников"),
    referralSource: z.string().min(1, "Пожалуйста, укажите, откуда вы о нас узнали"),
    comments: fields.comments
})

export type EventRegistration = z.infer<typeof eventRegistrationSchema>
