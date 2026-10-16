import { z } from "zod"
import { SCHOOL_GRADES } from "~/constants/school-grades"

// Новый ребёнок: имя и дата рождения обязательны, класс – по желанию
export const childSchema = z.object({
    name: z.string().trim().min(1, "Укажите имя").max(40, "Слишком длинное имя"),
    birthdate: z.string().min(1, "Укажите дату рождения"),
    schoolGrade: z.enum(SCHOOL_GRADES).optional()
})

export type ChildFormState = z.input<typeof childSchema>
