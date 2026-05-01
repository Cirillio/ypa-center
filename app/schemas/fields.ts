import { z } from "zod"
import { Maskas } from "~/constants/masks"

/**
 * Переиспользуемые Zod-поля для форм.
 * Используй как строительные блоки в схемах: z.object({ name: fields.fullName, ... })
 */
export const fields = {
    fullName: z
        .string()
        .min(1, "Поле обязательно")
        .max(100, "Слишком длинное значение")
        .regex(/^[a-zA-Zа-яА-ЯёЁ\s-]+$/, "Допустимы только буквы и тире"),

    phone: z
        .string()
        .min(1, "Укажите телефон")
        .refine((v) => v.length === Maskas.Phone.length, "Неверно указан телефон"),

    email: z.string().min(1, "Укажите почту").email("Некорректный адрес почты"),

    comments: z.string().max(500, "Комментарий слишком длинный").optional(),

    consent: z.boolean().refine((v) => v === true, "Необходимо принять условия"),

    birthDate: z.string().optional()
}
