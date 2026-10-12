// Схема валидации формы первичного заполнения анкеты профиля родителя.
import { z } from "zod"
import { REFERRAL_SOURCES } from "~/constants/referral-sources"
import { fields } from "~/schemas/fields"

export const profileSchema = z.object({
    fullName: fields.fullName,
    // ПОЧЕМУ обязателен: без телефона бэк не считает анкету заполненной (profile_completed)
    phone: fields.phone,
    referralSource: z.enum(REFERRAL_SOURCES, {
        error: "Пожалуйста, укажите, откуда вы о нас узнали"
    }),
    consent: fields.consent
})

export type ProfileCompletion = z.infer<typeof profileSchema>

// Состояние формы до валидации: канал ещё не выбран
export type ProfileFormState = Omit<ProfileCompletion, "referralSource"> & {
    referralSource: ProfileCompletion["referralSource"] | undefined
}
