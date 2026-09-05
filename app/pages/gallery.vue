<script lang="ts" setup>
import type { GalleryPage, GalleryPhoto } from "~/types"

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

const PAGE_SIZE = 12

const { apiFetch } = useApi()
const toast = useToast()

const { data, pending, error } = await useAsyncData("gallery", () =>
    apiFetch<GalleryPage>(`/v1/public/gallery/?limit=${PAGE_SIZE}`)
)

const photos = ref<GalleryPhoto[]>([...(data.value?.results ?? [])])
const total = ref(data.value?.count ?? 0)
const loadingMore = ref(false)
const loadMoreError = ref(false)

const hasMore = computed(() => photos.value.length < total.value)

const loadMore = async () => {
    if (loadingMore.value || !hasMore.value) return

    loadingMore.value = true
    loadMoreError.value = false

    try {
        const res = await apiFetch<GalleryPage>(
            `/v1/public/gallery/?limit=${PAGE_SIZE}&offset=${photos.value.length}`
        )
        photos.value.push(...(res.results ?? []))
        total.value = res.count
    } catch {
        loadMoreError.value = true
        toast.add({
            title: "Не удалось загрузить фотографии",
            description: "Проверьте подключение к сети и попробуйте снова.",
            icon: "ph:x-circle-bold",
            color: "error"
        })
    } finally {
        loadingMore.value = false
    }
}
</script>

<template>
    <div class="gradient-bg-ps">
        <GallerySection />
        <GalleryGrid
            :photos="photos"
            :pending="pending && !photos.length"
            :error="!!error && !photos.length"
            :has-more="hasMore"
            :loading-more="loadingMore"
            :load-more-error="loadMoreError"
            @load-more="loadMore"
        />
    </div>
</template>
