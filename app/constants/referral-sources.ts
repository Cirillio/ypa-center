// Список каналов привлечения для анкет регистрации и записи на мероприятия.
export const REFERRAL_SOURCES = [
    "ВКонтакте",
    "Telegram",
    "От друзей / знакомых",
    "Поисковик (Google, Яндекс)",
    "Флаер / баннер",
    "Другое"
] as const

export type ReferralSource = (typeof REFERRAL_SOURCES)[number]

export const REFERRAL_ITEMS: string[] = [...REFERRAL_SOURCES]
