// Схема валидации формы первичного заполнения анкеты профиля родителя.
import { z } from "zod"
import { fields } from "~/schemas/fields"

export const profileSchema = z.object({
    fullName: fields.fullName,
    phone: fields.phoneOptional,
    referralSource: z.string().min(1, "Пожалуйста, укажите, откуда вы о нас узнали"),
    consent: fields.consent
})

export type ProfileCompletion = z.infer<typeof profileSchema>
