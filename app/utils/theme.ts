const CARD_STYLES = [
    { bg: "bg-rose-100", ring: "ring-rose-200", title: "text-rose-600", fullBg: "bg-rose-600" },
    {
        bg: "bg-fuchsia-100",
        ring: "ring-fuchsia-200",
        title: "text-fuchsia-600",
        fullBg: "bg-fuchsia-600"
    },
    {
        bg: "bg-indigo-100",
        ring: "ring-indigo-200",
        title: "text-indigo-600",
        fullBg: "bg-indigo-600"
    },
    {
        bg: "bg-emerald-100",
        ring: "ring-emerald-200",
        title: "text-emerald-700",
        fullBg: "bg-emerald-700"
    },
    {
        bg: "bg-violet-100",
        ring: "ring-violet-200",
        title: "text-violet-600",
        fullBg: "bg-violet-600"
    },
    { bg: "bg-sky-100", ring: "ring-sky-200", title: "text-sky-600", fullBg: "bg-sky-600" },
    { bg: "bg-blue-100", ring: "ring-blue-200", title: "text-blue-600", fullBg: "bg-blue-600" },
    { bg: "bg-amber-100", ring: "ring-amber-200", title: "text-amber-700", fullBg: "bg-amber-700" },
    { bg: "bg-lime-100", ring: "ring-lime-200", title: "text-lime-700", fullBg: "bg-lime-700" },
    {
        bg: "bg-orange-100",
        ring: "ring-orange-200",
        title: "text-orange-700",
        fullBg: "bg-orange-700"
    }
] as const

export function getActivityTheme(activityId: number) {
    const index = CARD_STYLES[(activityId - 1) % CARD_STYLES.length]!
    return index
}
