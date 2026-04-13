import { z } from "zod"
import { fields } from "~/schemas/fields"

export const RegistrationSchema = z.object({
    childFullName: fields.fullName,
    birthDate: fields.birthDate,
    grade: z.union([
        z.enum(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]),
        z.string().min(1, "Укажите класс или выберите 'Другое'")
    ]),
    parentFullName: fields.fullName,
    phone: fields.phone,
    telegram: fields.telegram,
    referralSource: z.string().min(1, "Пожалуйста, укажите, откуда вы о нас узнали"),
    comments: fields.comments
})

export type RegistrationForm = z.infer<typeof RegistrationSchema>
