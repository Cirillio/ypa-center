<script lang="ts" setup>
const { seo } = useAppConfig()

useHead({
    htmlAttrs: {
        lang: "ru"
    },
    titleTemplate: (titleChunk) => {
        return titleChunk ? `${titleChunk} — ${seo.siteName}` : seo.siteName
    },
    meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "format-detection", content: "telephone=no" },
        { name: "geo.region", content: "RU-NVS" },
        { name: "geo.placename", content: "Новосибирск" },
        { name: "geo.position", content: `${seo.geo.lat};${seo.geo.lng}` },
        { name: "ICBM", content: `${seo.geo.lat}, ${seo.geo.lng}` }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
})

useSeoMeta({
    ogSiteName: seo.siteName,
    ogImage: seo.ogImage,
    twitterCard: "summary_large_image"
})
</script>

<template>
    <UApp>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </UApp>
</template>
