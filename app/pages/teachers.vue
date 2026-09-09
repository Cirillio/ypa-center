<script lang="ts" setup>
const teachersService = useTeachersService()
const { data, pending, error } = await useAsyncData("teachers", () => teachersService.getAll())

const teachers = computed(() => data.value ?? [])

const { seo } = useAppConfig()
const siteUrl = seo.siteUrl

useSeoMeta({
    title: "Команда — Улица Радости",
    description:
        "Познакомьтесь с педагогами центра умного развития «Улица Радости». Внимательные специалисты, которые любят детей и своё дело.",
    ogTitle: "Наша команда — Улица Радости",
    ogDescription: "Педагоги, которые вдохновляют детей учиться, творить и верить в себя.",
    ogImage: `${siteUrl}/og/default.jpg`,
    ogUrl: `${siteUrl}/teachers`
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
                        name: "Команда",
                        item: `${siteUrl}/teachers`
                    }
                ]
            })
        }
    ]
})
</script>

<template>
    <div class="gradient-bg-ps">
        <TeachersSection />
        <TeachersGrid :teachers="teachers" :pending="pending" :error="!!error" />
    </div>
</template>
