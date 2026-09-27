import type { ReferralSource } from "~/types"

// Подписи каналов привлечения; satisfies ловит новый код ReferralSourceEnum без подписи.
export const REFERRAL_SOURCE_LABELS = {
    FRIENDS: "От друзей или знакомых",
    SOCIAL: "Из соцсетей",
    MAPS: "Яндекс Карты / 2ГИС",
    SEARCH: "Поиск в интернете",
    SIGN: "Увидели вывеску",
    SCHOOL: "В школе или детском саду",
    OTHER: "Другое"
} as const satisfies Record<ReferralSource, string>

export const REFERRAL_SOURCES = [
    "FRIENDS",
    "SOCIAL",
    "MAPS",
    "SEARCH",
    "SIGN",
    "SCHOOL",
    "OTHER"
] as const satisfies readonly ReferralSource[]

export const REFERRAL_ITEMS = REFERRAL_SOURCES.map((value) => ({
    value,
    label: REFERRAL_SOURCE_LABELS[value]
}))
