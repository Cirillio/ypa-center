<script lang="ts" setup>
const { subscriptions, contactInfo, seo } = useAppConfig()
const siteUrl = seo.siteUrl
const activities = useActivitiesService()
const schedule = useScheduleService()

const { data: activitiesData } = await useAsyncData("clubs", () => activities.getAll())

const { data: scheduleData } = await useAsyncData("clubs-schedule", () => schedule.getWeek())

const slots = computed(() => scheduleData.value ?? [])

const enrichedClubs = computed(() =>
    (activitiesData.value ?? []).map((activity) => ({
        activity,
        scheduledDays: [...new Set(activity.groups.map((g) => g.day_of_week_display))]
    }))
)

// Минимальный возраст по реальным группам расписания, а не захардкоженное число
const minAge = computed(() => {
    const ages = (activitiesData.value ?? [])
        .flatMap((activity) => activity.groups.map((g) => g.age_min))
        .filter((age): age is number => age != null)
    return ages.length ? Math.min(...ages) : null
})

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
        <ClubsSection :clubs-length="enrichedClubs.length" :min-age="minAge" />

        <section class="bg-default relative z-10 flex w-full py-12 md:py-20 lg:py-24">
            <UContainer class="flex w-full flex-col gap-6 md:gap-8">
                <div class="flex items-center justify-between gap-4">
                    <h2 class="text-secondary text-2xl font-extrabold md:text-3xl">Все кружки</h2>
                    <UButton
                        to="/clubs#schedule"
                        label="Расписание"
                        trailing-icon="ph:calendar-dots-bold"
                        class="text-base"
                        variant="soft"
                    />
                </div>
                <ClubsGrid :enriched-clubs="enrichedClubs" />
                <span class="text-default/95 text-xs font-semibold md:text-sm"
                    >• Узнать какие учителя занимаются направлениями можно на
                    <NuxtLink to="/teachers" class="text-primary">странице учителей</NuxtLink
                    >.</span
                >
            </UContainer>
        </section>

        <ClubsSchedule v-if="slots.length" :slots="slots" />
        <ClubsOtherServices />
        <FaqSection />
        <JoinUsPromo />
    </div>
</template>
