<script lang="ts" setup>
import type { GalleryPhoto } from "~/types"

const props = defineProps<{
    photos: GalleryPhoto[]
    pending?: boolean
    error?: boolean
}>()

// Состояние модалки
const activeIndex = ref<number | null>(null)
const isModalOpen = computed({
    get: () => activeIndex.value !== null,
    set: (value) => {
        if (!value) activeIndex.value = null
    }
})

const activePhoto = computed(() => {
    if (activeIndex.value === null) return null
    return props.photos[activeIndex.value] || null
})

// Навигация
const next = () => {
    if (props.photos.length && activeIndex.value !== null) {
        activeIndex.value = (activeIndex.value + 1) % props.photos.length
    }
}

const prev = () => {
    if (props.photos.length && activeIndex.value !== null) {
        activeIndex.value = (activeIndex.value - 1 + props.photos.length) % props.photos.length
    }
}

const openPhoto = (index: number) => {
    activeIndex.value = index
}
</script>

<template>
    <UContainer class="pb-20">
        <!-- Состояние загрузки (если совсем ничего нет) -->
        <div
            v-if="pending && !photos.length"
            class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
        >
            <div
                v-for="i in 8"
                :key="i"
                class="bg-primary/10 aspect-square animate-pulse rounded-lg"
            />
        </div>

        <!-- Ошибка загрузки или пустые данные -->
        <div
            v-else-if="error && !photos.length"
            class="flex flex-col items-center justify-center py-20 text-center"
        >
            <UIcon name="ph:image-break-duotone" class="text-secondary mb-4 size-16 opacity-20" />
            <p class="text-secondary/60 text-lg">
                Пока здесь нет фотографий, но скоро они появятся!
            </p>
        </div>

        <!-- Сетка -->
        <div v-else class="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            <div
                v-for="(photo, index) in photos"
                :key="photo.id"
                class="group relative cursor-pointer overflow-hidden rounded-lg"
                @click="openPhoto(index)"
            >
                <AppPhoto
                    :src="photo.thumbnail || photo.url"
                    :alt="photo.alt"
                    class="aspect-square transition-transform duration-500 group-hover:scale-110"
                />
                <div
                    class="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100"
                >
                    <UIcon name="ph:magnifying-glass-plus-duotone" class="size-8 text-white" />
                </div>
            </div>
        </div>

        <!-- Модалка -->
        <GalleryModal
            v-model="isModalOpen"
            :photo="activePhoto"
            :has-prev="photos.length > 1"
            :has-next="photos.length > 1"
            @next="next"
            @prev="prev"
        />
    </UContainer>
</template>
