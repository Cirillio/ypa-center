// Собирает подпись возрастного диапазона («от 6 до 13 лет»); null, если возраст не известен.
export const formatAgeRange = (min: number | null, max: number | null): string | null => {
    if (min !== null && max !== null) {
        return min === max ? `${min} ${pluralize(min)}` : `от ${min} до ${max} ${pluralize(max)}`
    }
    if (min !== null) return `от ${min} ${pluralize(min)}`
    if (max !== null) return `до ${max} ${pluralize(max)}`
    return null
}
