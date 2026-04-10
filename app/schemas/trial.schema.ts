import { z } from "zod"
import { Maskas } from "~/constants/masks"

export const trialRegistrationSchema = z.object({
    childFullName: z
        .string()
        .min(1, "ФИО ребенка обязательно")
        .max(100, "ФИО слишком длинное")
        .regex(/^[a-zA-Zа-яА-ЯёЁ\s-]+$/, "ФИО может содержать только буквы и тире"),
    birthDate: z.string().optional(),
    grade: z.union([
        z.enum(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]),
        z.string().min(1, "Укажите класс или выберите 'Другое'")
    ]),
    parentFullName: z
        .string()
        .min(1, "ФИО родителя обязательно")
        .max(100, "ФИО слишком длинное")
        .regex(/^[a-zA-Zа-яА-ЯёЁ\s-]+$/, "ФИО может содержать только буквы и тире"),
    phone: z
        .string()
        .refine((v) => v.length > 0, "Пожалуйста, укажите телефон")
        .refine((v) => {
            return v.length === Maskas.Phone.length
        }, "Неверно указан телефон"),

    telegram: z
        .string()
        .nonempty("Пожалуйста, укажите Telegram")
        .min(6, "Никнейм должен быть длиннее 5 символов")
        .max(33, "Telegram должен быть короче 32 символов")
        .startsWith("@", "Никнейм должен начинаться с @"),
    referralSource: z.string().min(1, "Пожалуйста, укажите, откуда вы о нас узнали"),
    comments: z.string().max(500, "Комментарий слишком длинный").optional(),
    consent: z.boolean().refine((v) => v === true, "Необходимо принять условия")
})

export type TrialRegistration = z.infer<typeof trialRegistrationSchema>
