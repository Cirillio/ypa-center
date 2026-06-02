<script lang="ts" setup>
import { EnrollRoutesEnum } from "~/constants/nav";
</script>

<template>
    <section
        class="bg-default relative z-10 flex w-full flex-col items-center gap-8 py-12 md:py-16"
    >
        <UContainer class="flex flex-col items-center gap-4 md:gap-8">
            <NuxtImg
                src="/core/FullLogo.png"
                alt=""
                class="floating-element-slow h-24 transition-transform duration-300 group-hover:rotate-10 md:h-28 lg:h-32"
                format="webp"
                quality="90"
                loading="lazy"
            />

            <h2 class="text-primary text-center text-2xl leading-tight font-bold md:text-3xl">
                Готовы к нам
                <span class="text-secondary after:text-primary after:content-['?']"
                    >присоединиться</span
                >
            </h2>

            <div class="flex items-center gap-4 max-md:flex-col-reverse">
                <UButton :to="EnrollRoutesEnum.Trial" variant="soft" size="md" class="group w-fit">
                    <span class="font-bold">Записаться на пробное</span>
                    <UIcon
                        name="ph:arrow-right-bold"
                        class="size-4 transition group-hover:translate-x-0.5"
                    />
                </UButton>

                <UButton :to="EnrollRoutesEnum.Subscription" color="secondary" class="group w-fit">
                    <span class="font-bold md:text-lg">Собрать абонемент</span>
                    <UIcon
                        name="ph:puzzle-piece-duotone"
                        class="size-4.5 transition group-hover:scale-110 group-hover:rotate-6 md:size-5.5"
                    />
                </UButton>
            </div>
        </UContainer>
    </section>
</template>
