<script lang="ts" setup>
import { MOCK_CLUBS_FULL, MOCK_WEEKLY_SLOTS } from "~/constants/mock"

const { subscriptions, contactInfo, seo } = useAppConfig()
const siteUrl = seo.siteUrl

// TODO: заменить на useFetch после реализации GET /clubs/ и GET /schedule/ на бэке
const clubs = MOCK_CLUBS_FULL
const slots = MOCK_WEEKLY_SLOTS

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
                    size="xl"
                    label="Посмотреть расписание"
                    trailing-icon="ph:arrow-down-bold"
                    class="floating-element-slow text-base md:text-lg"
                    :ui="{
                        trailingIcon: 'max-md:size-4'
                    }"
                />
            </div>
        </div>

        <section class="bg-default relative z-10 flex w-full py-12 md:py-20 lg:py-24">
            <UContainer class="flex w-full flex-col gap-6 md:gap-8">
                <div class="flex items-center justify-between gap-4">
                    <h2 class="text-secondary text-2xl font-extrabold md:text-3xl">Все кружки</h2>
                    <span class="text-primary text-lg font-bold">{{ clubs.length }}</span>
                </div>
                <ClubsGrid :clubs="clubs" />
            </UContainer>
        </section>

        <ClubsSchedule :slots="slots" />
        <ClubsOtherServices />
        <FaqSection />
    </div>
</template>
