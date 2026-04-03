<script lang="ts" setup>
import type { GalleryPhoto } from "~/types"
import { MOCK_GALLERY_PHOTOS } from "~/constants/mock"

useSeoMeta({
    title: "Галерея — Улица Радости",
    description: "Фотографии нашего центра: учебные классы, игровые зоны и моменты с наших занятий."
})

// Получение данных с бэка
const { data, pending, error } = await useFetch<GalleryPhoto[]>("/api/gallery/photos/")

// Используем данные с бэка или моки
const photos = computed(() =>
    data.value && data.value.length > 0 ? data.value : MOCK_GALLERY_PHOTOS
)
</script>

<template>
    <main class="gradient-bg-ps">
        <GallerySection />
        <GalleryGrid :photos="photos" :pending="pending" :error="!!error" />
    </main>
</template>
