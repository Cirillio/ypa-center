<script lang="ts" setup>
const { seo } = useAppConfig()
const siteUrl = seo.siteUrl

useSeoMeta({
    title: "О нас — Улица Радости",
    description:
        "История центра умного развития «Улица Радости» в Новосибирске. Узнайте о нашей команде, ценностях и подходе к развитию детей.",
    ogTitle: "О нас — Улица Радости",
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
        <AboutMap />
        <FaqSection />
    </div>
</template>
