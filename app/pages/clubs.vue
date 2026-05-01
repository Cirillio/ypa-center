<script lang="ts" setup>
import {
    MOCK_ACTIVITIES,
    MOCK_CLUBS_FULL,
    MOCK_SCHEDULE_SLOTS,
    MOCK_SUBGROUPS,
    MOCK_WEEKDAY_SLOTS,
    MOCK_WEEKLY_SLOTS
} from "~/constants/mock"
import type { Subgroup } from "~/types"

const { subscriptions, contactInfo, seo } = useAppConfig()
const siteUrl = seo.siteUrl

// TODO: заменить на useFetch после реализации GET /clubs/, GET /schedule/, GET /activities/ на бэке
const slots = MOCK_WEEKLY_SLOTS

const DAY_NAMES = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"] as const

function getClubSubgroups(clubId: number): Subgroup[] {
    const subgroupIds = MOCK_ACTIVITIES.filter((a) => a.club_id === clubId).map(
        (a) => a.subgroup_id
    )
    return MOCK_SUBGROUPS.filter((s) => subgroupIds.includes(s.id))
}

function getScheduledDays(clubId: number): string[] {
    const actIds = MOCK_ACTIVITIES.filter((a) => a.club_id === clubId).map((a) => a.id)
    const wdSlotIds = [
        ...new Set(
            MOCK_SCHEDULE_SLOTS.filter((ss) => actIds.includes(ss.activity_id)).map(
                (ss) => ss.weekday_slot_id
            )
        )
    ]
    const dows = [
        ...new Set(
            MOCK_WEEKDAY_SLOTS.filter((ws) => wdSlotIds.includes(ws.id)).map((ws) => ws.dayOfWeek)
        )
    ].sort() as (0 | 1 | 2 | 3 | 4 | 5 | 6)[]
    return dows.map((d) => DAY_NAMES[d])
}

const enrichedClubs = MOCK_CLUBS_FULL.map((club) => ({
    club,
    subgroups: getClubSubgroups(club.id),
    scheduledDays: getScheduledDays(club.id)
}))

useSeoMeta({
    title: "Кружки — Улица Радости",
    description:
        "Каталог кружков центра умного развития «Улица Радости». Настольные игры, рисование, пианино, каникулярные программы и другие занятия для детей в Новосибирске.",
    ogTitle: "Кружки — Улица Радости",
    ogDescription: "Найдите занятие для вашего ребёнка. Внимательные педагоги и уютная атмосфера.",
    ogImage: `${siteUrl}/og/default.jpg`,
    ogUrl: `${siteUrl}/clubs`
})

useHead({
    script: [
        {
            type: "application/ld+json",
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: "Главная",
                        item: siteUrl
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: "Кружки",
                        item: `${siteUrl}/clubs`
                    }
                ]
            })
        },
        {
            type: "application/ld+json",
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                name: "Абонементы центра умного развития «Улица Радости»",
                description:
                    "Абонементы на занятия в кружках центра умного развития «Улица Радости» в Новосибирске.",
                itemListElement: subscriptions.map((tier, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    item: {
                        "@type": "Offer",
                        name: tier.label ?? `Абонемент на ${tier.lessons} занятий`,
                        price: tier.price,
                        priceCurrency: "RUB",
                        availability: "https://schema.org/InStock",
                        seller: {
                            "@type": "LocalBusiness",
                            name: "Улица Радости",
                            address: contactInfo.address,
                            telephone: contactInfo.phone
                        }
                    }
                }))
            })
        }
    ]
})
</script>

<template>
    <div class="flex w-full min-w-0 flex-col">
        <ClubsSection />
        <div class="relative z-20 h-0 w-full">
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <UButton
                    to="/clubs#schedule"
                    size="lg"
                    label="Посмотреть расписание"
                    trailing-icon="ph:arrow-down-bold"
                    class="floating-element-slow text-base md:text-lg"
                />
            </div>
        </div>

        <section class="bg-default relative z-10 flex w-full py-12 md:py-20 lg:py-24">
            <UContainer class="flex w-full flex-col gap-6 md:gap-8">
                <div class="flex items-center justify-between gap-4">
                    <h2 class="text-secondary text-2xl font-extrabold md:text-3xl">Все кружки</h2>
                    <span class="text-primary text-lg font-bold">{{ enrichedClubs.length }}</span>
                </div>
                <ClubsGrid :enriched-clubs="enrichedClubs" />
            </UContainer>
        </section>

        <ClubsSchedule :slots="slots" />
        <ClubsOtherServices />
        <FaqSection />
        <JoinUsPromo />
    </div>
</template>
