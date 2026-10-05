<script lang="ts" setup>
import type { GalleryPhoto } from "~/types"

const { seo } = useAppConfig()
const { siteUrl } = seo

useSeoMeta({
    title: "Галерея",
    description:
        "Фотографии нашего центра: учебные классы, игровые зоны и моменты с наших занятий.",
    ogTitle: "Галерея – Улица Радости",
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

const PAGE_SIZE = 12

const gallery = useGalleryService()
const toast = useToast()

// Первая страница – в SSR-HTML (без await: переход по клику не ждёт API, сетка показывает скелетон)
const { items, hasMore, isLoadingMore, loadMoreError, loadMore, pending, error, refresh } =
    usePagedList("gallery:page", ({ limit, offset }) => gallery.getPage(limit, offset), {
        pageSize: PAGE_SIZE,
        server: true
    })

const photos = computed<GalleryPhoto[]>(() => items.value ?? [])

watch(loadMoreError, (err) => {
    if (!err) return
    toast.add({
        title: "Не удалось загрузить фотографии",
        description: "Проверьте подключение к сети и попробуйте снова.",
        icon: "ph:x-circle-bold",
        color: "error"
    })
})
</script>

<template>
    <div class="gradient-bg-ps">
        <GallerySection />
        <GalleryGrid
            :photos="photos"
            :pending="pending && !photos.length"
            :error="!!error && !photos.length"
            :has-more="hasMore"
            :loading-more="isLoadingMore"
            :load-more-error="!!loadMoreError"
            @load-more="loadMore"
            @retry="refresh"
        />
    </div>
</template>
