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
        { charset: "utf-16" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "format-detection", content: "telephone=no" }
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
