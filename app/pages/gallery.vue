<script lang="ts" setup>
import type { GalleryPhoto } from "~/types"
import { MOCK_GALLERY_PHOTOS } from "~/constants/mock"

const { seo } = useAppConfig()
const { siteUrl } = seo

useSeoMeta({
    title: "Галерея — Улица Радости",
    description:
        "Фотографии нашего центра: учебные классы, игровые зоны и моменты с наших занятий.",
    ogTitle: "Галерея — Улица Радости",
    ogDescription:
        "Фотографии нашего центра: учебные классы, игровые зоны и моменты с наших занятий.",
    ogImage: `${siteUrl}/og/default.jpg`,
    ogUrl: `${siteUrl}/gallery`
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
                        name: "Галерея",
                        item: `${siteUrl}/gallery`
                    }
                ]
            })
        }
    ]
})

// Получение данных с бэка
const { data, pending, error } = await useFetch<GalleryPhoto[]>("/api/gallery/photos/")

// Используем данные с бэка или моки
const photos = computed(() =>
    data.value && data.value.length > 0 ? data.value : MOCK_GALLERY_PHOTOS
)
</script>

<template>
    <div class="gradient-bg-ps">
        <GallerySection />
        <GalleryGrid :photos="photos" :pending="pending" :error="!!error" />
    </div>
</template>
