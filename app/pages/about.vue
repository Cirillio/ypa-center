<script lang="ts" setup>
// ПОЧЕМУ педагоги здесь: страница /teachers слита с «О нас» (301 на /about#partners)
const teachersService = useTeachersService()
const {
    data: teachersData,
    pending: teachersPending,
    error: teachersError,
    refresh: refreshTeachers
} = useAsyncData("teachers", () => teachersService.getAll())
const teachers = computed(() => teachersData.value ?? [])

const { seo } = useAppConfig()
const siteUrl = seo.siteUrl

useSeoMeta({
    title: "О нас",
    description:
        "История центра умного развития «Улица Радости» в Новосибирске: команда, педагоги-партнёры, ценности и подход к развитию детей.",
    ogTitle: "О нас – Улица Радости",
    ogDescription: "Место, где дети учатся думать, творить и верить в себя."
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
                        name: "О нас",
                        item: `${siteUrl}/about`
                    }
                ]
            })
        }
    ]
})
</script>

<template>
    <div class="gradient-bg-ps flex flex-col">
        <AboutSection />
        <AboutStory />
        <AboutOwner />
        <TeachersSection />
        <TeachersGrid
            :teachers="teachers"
            :pending="teachersPending"
            :error="!!teachersError"
            @retry="refreshTeachers"
        />
        <AboutMap />
        <PromoFaq />
        <PromoJoinUs />
    </div>
</template>
