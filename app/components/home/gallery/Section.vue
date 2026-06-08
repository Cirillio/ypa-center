<script lang="ts" setup>
import { MOCK_GALLERY_IMAGES } from "~/constants/mock"
</script>

<template>
    <section
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
            <div class="grid grid-cols-2 gap-2 overflow-hidden rounded-md bg-white lg:grid-cols-4">
                <div
                    v-for="(photo, i) in MOCK_GALLERY_IMAGES"
                    :key="photo.src"
                    class="group overflow-hidden rounded-sm"
                    :class="{
                        'col-span-2 row-span-2': i === 0,
                        'col-span-2': i === MOCK_GALLERY_IMAGES.length - 1
                    }"
                >
                    <LazyAppPhoto
                        :src="photo.src"
                        :alt="photo.alt"
                        class="scale-105 object-cover object-center transition duration-300 group-hover:scale-100"
                        :class="i === 0 ? 'aspect-square' : 'aspect-4/3'"
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
