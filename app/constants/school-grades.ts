// Варианты поля «Класс» ребёнка; бэк хранит строку до 20 символов, список держит значения единообразными.
export const SCHOOL_GRADES = [
    "Дошкольник",
    ...Array.from({ length: 11 }, (_, i) => `${i + 1} класс`)
] as const

export const SCHOOL_GRADE_ITEMS = SCHOOL_GRADES.map((grade) => ({ label: grade, value: grade }))
