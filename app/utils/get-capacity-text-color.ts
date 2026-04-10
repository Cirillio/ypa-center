export function getCapacityTextColor(capacity: number) {
    switch (true) {
        case capacity === 0:
            return "text-default/95"
        case capacity <= 3:
            return "text-amber-500"
        default:
            return "text-emerald-600"
    }
}
