import type { ActivityGroup } from "~/types"

export interface AgeBucket {
    key: string
    ageMin: number | null
    label: string
    groupCount: number
    // Вместимость, общая для всех групп диапазона; null, если различается
    maxCapacity: number | null
}

// Сворачивает группы в возрастные диапазоны: для родителя группы различаются возрастом, а не именем.
export const groupByAge = (groups: ActivityGroup[]): AgeBucket[] => {
    const buckets = new Map<string, AgeBucket>()

    for (const g of groups) {
        const min = g.age_min ?? null
        const max = g.age_max ?? null
        const key = `${min}|${max}`
        const capacity = g.max_capacity ?? null
        const bucket = buckets.get(key)

        if (bucket) {
            bucket.groupCount++
            if (bucket.maxCapacity !== capacity) bucket.maxCapacity = null
        } else {
            buckets.set(key, {
                key,
                ageMin: min,
                label: formatAgeRange(min, max) ?? "Любой возраст",
                groupCount: 1,
                maxCapacity: capacity
            })
        }
    }

    return [...buckets.values()].sort((a, b) => {
        if (a.ageMin === null) return 1
        if (b.ageMin === null) return -1
        return a.ageMin - b.ageMin
    })
}

// Общий возрастной охват набора групп: минимум из age_min, максимум из age_max.
export const getAgeBounds = (
    groups: ActivityGroup[]
): { min: number | null; max: number | null } => {
    const mins = groups.map((g) => g.age_min).filter((age): age is number => age != null)
    const maxs = groups.map((g) => g.age_max).filter((age): age is number => age != null)
    return {
        min: mins.length ? Math.min(...mins) : null,
        max: maxs.length ? Math.max(...maxs) : null
    }
}

// Вместимость, если она одинакова у всех групп; иначе null.
export const getCommonCapacity = (groups: ActivityGroup[]): number | null => {
    const values = new Set(groups.map((g) => g.max_capacity ?? null))
    const [only] = values
    return values.size === 1 && only != null ? only : null
}
