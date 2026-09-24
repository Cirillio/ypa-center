<script lang="ts" setup>
const { subscriptions, contactInfo, seo } = useAppConfig()

const siteUrl = seo.siteUrl

// Fetching Clubs and schedule
const activities = useActivitiesService()
const schedule = useScheduleService()

const { data: activitiesData, error: activitiesError } = await useAsyncData("clubs", () =>
    activities.getAll()
)
const { data: scheduleData, error: scheduleError } = await useAsyncData("clubs-schedule", () =>
    schedule.getWeek()
)

const clubsLength = computed(() => activitiesData.value?.length || 0)

// Минимальный возраст по реальным группам расписания, а не захардкоженное число
const minAge = computed(() => {
    const ages = (activitiesData.value ?? [])
        .flatMap((activity) => activity.groups.map((g) => g.age_min))
        .filter((age): age is number => age != null)
    return ages.length ? Math.min(...ages) : null
})

useSeoMeta({
    title: "Кружки – Улица Радости",
    description:
        "Каталог кружков центра умного развития «Улица Радости». Настольные игры, рисование, пианино, каникулярные программы и другие занятия для детей в Новосибирске.",
    ogTitle: "Кружки – Улица Радости",
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
        <ClubsHero :clubs-length="clubsLength" :min-age="minAge" />

        <ClubsList v-if="activitiesData && !activitiesError" :activities="activitiesData" />

        <ClubsSchedule v-if="scheduleData && !scheduleError" :slots="scheduleData" />

        <ClubsOtherServices />

        <PromoFaq />

        <PromoJoinUs />
    </div>
</template>
