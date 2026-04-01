<script lang="ts" setup>
import { MOCK_GALLERY_IMAGES } from "~/constants/mock"
</script>

<template>
    <section id="gallery" class="bg-default relative z-10 flex w-full overflow-hidden py-20">
        <UIcon
            name="ph:camera-duotone"
            class="text-secondary absolute top-8 right-0 z-0 size-120 translate-x-1/2 opacity-15"
        />

        <UContainer class="relative z-10 flex flex-col gap-12">
            <SectionLeading subtitle="Наши моменты">
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
            <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div
                    v-for="(photo, i) in MOCK_GALLERY_IMAGES"
                    :key="photo.src"
                    class="group overflow-hidden rounded-lg"
                    :class="{
                        'col-span-2 row-span-2': i === 0,
                        'col-span-2': i === MOCK_GALLERY_IMAGES.length - 1
                    }"
                >
                    <AppPhoto
                        :src="photo.src"
                        :alt="photo.alt"
                        :class="
                            i === 0
                                ? 'aspect-square duration-500 group-hover:scale-105'
                                : 'aspect-4/3 duration-500 group-hover:scale-105'
                        "
                    />
                </div>
            </div>

            <!-- CTA -->
            <div class="flex justify-center">
                <UButton to="/gallery" size="xl" class="group px-8 py-2.5">
                    <span class="text-lg font-bold">Вся галерея</span>
                    <UIcon
                        name="ph:arrow-right-bold"
                        class="size-5 transition group-hover:translate-x-1"
                    />
                </UButton>
            </div>
        </UContainer>
    </section>
</template>
