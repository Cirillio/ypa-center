<script lang="ts" setup>
import type { GalleryPhoto } from "~/types"

// Раскладка сетки ниже детерминирована и рассчитана ровно на 5 фото
const HOME_GALLERY_LIMIT = 5

const { apiFetch } = useApi()
const { data } = await useAsyncData("home-gallery", () =>
    apiFetch<GalleryPhoto[]>("/v1/public/gallery/")
)
const photos = computed(() => (data.value ?? []).slice(0, HOME_GALLERY_LIMIT))
</script>

<template>
    <section
        v-if="photos.length === HOME_GALLERY_LIMIT"
        id="gallery"
        class="bg-default relative z-10 flex w-full overflow-hidden py-12 md:py-20 lg:py-24"
    >
        <UContainer class="relative z-10 flex flex-col gap-6 md:gap-12">
            <SectionLeading subtitle="Наши моменты" icon="ph:aperture-duotone">
                <template #title>
                    <span class="text-secondary">
                        Фото<br />
                        <span class="text-primary">из центра</span>
                    </span>
                </template>
                <template #description>
                    Загляните в нашу жизнь — яркие занятия, счастливые лица и уютная атмосфера
                    «Улицы Радости».
                </template>
            </SectionLeading>

            <!-- Gallery grid -->
            <div class="grid grid-cols-2 gap-2 overflow-hidden lg:grid-cols-4">
                <div
                    v-for="(photo, i) in photos"
                    :key="photo.id"
                    class="group overflow-hidden rounded-sm"
                    :class="{
                        'col-span-2 row-span-2 aspect-square': i === 0
                    }"
                >
                    <LazyAppPhoto
                        :src="photo.image_url"
                        :alt="'Фото ' + (i + 1) + ' из центра'"
                        class="h-full w-full scale-105 object-cover object-center transition duration-300 group-hover:scale-100"
                    />
                </div>
            </div>

            <!-- CTA -->
            <div class="flex justify-center">
                <UButton to="/gallery" size="xl" class="group">
                    <span class="font-bold md:text-lg">Вся галерея</span>
                    <UIcon
                        name="ph:arrow-right-bold"
                        class="size-4 transition group-hover:translate-x-1 md:size-5"
                    />
                </UButton>
            </div>
        </UContainer>
    </section>
</template>
