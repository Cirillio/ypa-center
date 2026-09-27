import type { z } from "zod"

// Сообщения ошибок по имени поля – ровно то, что пользователь увидит под инпутом
export function errorsByField(schema: z.ZodType, input: unknown): Record<string, string[]> {
    const result = schema.safeParse(input)
    if (result.success) return {}
    const errors: Record<string, string[]> = {}
    for (const issue of result.error.issues) {
        const key = issue.path.map(String).join(".") || "_root"
        errors[key] = [...(errors[key] ?? []), issue.message]
    }
    return errors
}

export const VALID_PHONE = "+7 (913) 123-45-67"
