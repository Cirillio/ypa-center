<script lang="ts" setup>
import { useIntersectionObserver } from "@vueuse/core"
import type { GalleryPhoto } from "~/types"

const props = defineProps<{
    photos: GalleryPhoto[]
    pending?: boolean
    error?: boolean
    hasMore?: boolean
    loadingMore?: boolean
    loadMoreError?: boolean
}>()

const emit = defineEmits<{
    loadMore: []
    retry: []
}>()

// Автоматическая подгрузка при скролле
const sentinelRef = ref<HTMLElement | null>(null)

useIntersectionObserver(
    sentinelRef,
    ([entry]) => {
        if (entry?.isIntersecting && props.hasMore && !props.loadingMore && !props.loadMoreError) {
            emit("loadMore")
        }
    },
    {
        rootMargin: "300px"
    }
)

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

        <!-- Ошибка первой загрузки -->
        <UiErrorState
            v-else-if="error && !photos.length"
            size="lg"
            message="Не удалось загрузить фотографии."
            :retrying="pending"
            @retry="emit('retry')"
        />

        <UiEmptyState
            v-else-if="!photos.length"
            icon="ph:image-duotone"
            title="Пока здесь нет фотографий"
            description="Скоро они появятся – загляните позже."
        />

        <!-- Сетка -->
        <div v-else class="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            <button
                v-for="(photo, index) in photos"
                :key="photo.id"
                :aria-label="'Открыть фото ' + (index + 1) + ' из галереи'"
                class="group hover:ring-primary focus-within:ring-primary active:ring-primary relative cursor-pointer overflow-hidden rounded-md ring-2 ring-transparent transition-all"
                @click="openPhoto(index)"
            >
                <LazyUiPhoto
                    :src="photo.image_url"
                    :alt="'Фото ' + (index + 1) + ' из галереи центра'"
                    class="aspect-square scale-105 object-cover object-center transition-transform duration-150 group-hover:scale-100 group-active:scale-100"
                />
                <div
                    class="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 group-active:opacity-100"
                >
                    <UIcon name="ph:magnifying-glass-plus-duotone" class="size-8 text-white" />
                </div>
            </button>
        </div>

        <!-- Сентинел для бесконечного скролла -->
        <div v-if="hasMore" ref="sentinelRef" class="pointer-events-none h-4 w-full" />

        <!-- Кнопка «Показать ещё» -->
        <div v-if="hasMore" class="mt-8 flex flex-col items-center justify-center gap-2 sm:mt-12">
            <UButton
                label="Показать ещё"
                variant="soft"
                color="secondary"
                size="xl"
                class="cursor-pointer font-semibold"
                :loading="loadingMore"
                :disabled="loadingMore"
                @click="emit('loadMore')"
            />
            <p v-if="loadMoreError" class="text-error text-sm font-medium">
                Не удалось загрузить фотографии, попробуйте ещё раз
            </p>
        </div>

        <!-- Модалка -->
        <GalleryModal
            v-model:model-value="isModalOpen"
            :photo="activePhoto"
            :has-prev="photos.length > 1"
            :has-next="photos.length > 1"
            @next="next"
            @prev="prev"
        />
    </UContainer>
</template>
