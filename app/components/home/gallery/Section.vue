<script lang="ts" setup>
import { MOCK_GALLERY_IMAGES } from "~/constants/mock"
</script>

<template>
    <section
        id="gallery"
        class="bg-default relative z-10 flex w-full overflow-hidden py-12 md:py-20"
    >
        <div
            class="absolute top-6 right-6 z-0 flex rounded-full bg-white p-2 opacity-60 xl:top-8 xl:right-0 xl:translate-x-1/2 xl:rounded-none xl:bg-transparent xl:p-0 xl:opacity-15"
        >
            <UIcon name="ph:camera-duotone" class="text-secondary size-10 xl:size-120" />
        </div>

        <UContainer class="relative z-10 flex flex-col gap-8 md:gap-12">
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
            <div class="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
                <div
                    v-for="(photo, i) in MOCK_GALLERY_IMAGES"
                    :key="photo.src"
                    class="group overflow-hidden rounded-md sm:rounded-lg"
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
                <UButton to="/gallery" size="xl" class="group md:px-8 md:py-2.5">
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
