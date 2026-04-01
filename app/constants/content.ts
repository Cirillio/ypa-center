const START_YEAR = 2023
const currentYears = new Date().getFullYear() - START_YEAR

export interface CenterStat {
    icon: string
    textColor: string
    label: string
    value: string
}

export const CENTER_STATS: CenterStat[] = [
    {
        icon: "ph:mask-happy-duotone",
        textColor: "text-amber-400",
        label: "Счастливых ребят",
        value: "300+"
    },
    {
        icon: "ph:shooting-star-duotone",
        textColor: "text-emerald-500",
        label: `Работаем с ${START_YEAR}`,
        value:
            currentYears === 0
                ? "Меньше года"
                : `${currentYears} ${pluralize(currentYears, ["год", "года", "лет"])}`
    },
    {
        icon: "ph:book-bookmark-duotone",
        textColor: "text-cyan-500",
        label: "Пробное занятие",
        value: "1200р"
    }
]
