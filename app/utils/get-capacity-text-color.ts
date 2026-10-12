// Возвращает семантический класс цвета для индикатора оставшихся мест в группе.
export function getCapacityTextColor(capacity: number) {
    switch (true) {
        case capacity === 0:
            return "text-muted"
        case capacity <= 3:
            return "text-amber-500"
        default:
            return "text-emerald-600"
    }
}
