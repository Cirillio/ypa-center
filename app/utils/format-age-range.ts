// ПОЧЕМУ: после «от»/«до» число управляет родительным падежом («от 1 года», «до 4 лет»),
// именительные формы pluralize по умолчанию дали бы «до 4 года»
const GENITIVE_YEARS: [string, string, string] = ["года", "лет", "лет"]

// Собирает подпись возрастного диапазона («от 6 до 13 лет»); null, если возраст не известен.
export const formatAgeRange = (min: number | null, max: number | null): string | null => {
    if (min !== null && max !== null) {
        return min === max
            ? `${min} ${pluralize(min)}`
            : `от ${min} до ${max} ${pluralize(max, GENITIVE_YEARS)}`
    }
    if (min !== null) return `от ${min} ${pluralize(min, GENITIVE_YEARS)}`
    if (max !== null) return `до ${max} ${pluralize(max, GENITIVE_YEARS)}`
    return null
}
