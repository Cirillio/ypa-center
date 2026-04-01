/**
 * Склонение существительных в зависимости от числительного
 * @param value Число
 * @param words Массив форм [1, 2, 5] (например: ['год', 'года', 'лет'])
 */
export const pluralize = (value: number, words: [string, string, string]): string => {
    const absValue = Math.abs(value)
    const lastDigit = absValue % 10
    const lastTwoDigits = absValue % 100

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return words[2]
    if (lastDigit === 1) return words[0]
    if (lastDigit >= 2 && lastDigit <= 4) return words[1]
    return words[2]
}
