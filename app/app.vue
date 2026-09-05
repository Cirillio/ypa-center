<script lang="ts" setup>
import type { ToasterProps } from "@nuxt/ui"

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
    link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }]
})

useSeoMeta({
    ogSiteName: seo.siteName,
    ogImage: seo.ogImage,
    twitterCard: "summary_large_image"
})

const toaster: ToasterProps = { position: "top-center" }
</script>

<template>
    <UApp :toaster="toaster">
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </UApp>
</template>
