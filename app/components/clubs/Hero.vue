<script lang="ts" setup>
import { EnrollRoutesEnum } from "~/constants/nav"

defineProps<{
    clubsLength: number | null
    minAge: number | null
}>()
</script>

<template>
    <UiPageSection class="gradient-bg-ps flex flex-col gap-16">
        <UContainer
            class="relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16"
        >
            <div class="flex flex-col gap-8">
                <UiSectionLeading as="h1" subtitle="Наши кружки" icon="ph:compass-duotone">
                    <template #title>
                        <span class="text-secondary">
                            Место, где <br />
                            <span class="text-primary"> таланты </span>
                            <br />
                            становятся <span class="text-primary">навыками</span>
                        </span>
                    </template>
                    <template #description>
                        Уютное пространство, где каждый найдет увлечение по душе. Внимательные
                        педагоги помогут раскрыть таланты малышам и с удовольствием провести время
                        взрослым.
                    </template>

                    <template #action>
                        <div class="flex flex-col gap-6">
                            <div class="flex flex-col gap-1">
                                <UButton
                                    :to="EnrollRoutesEnum.Subscription"
                                    size="xl"
                                    color="secondary"
                                    class="group w-fit"
                                >
                                    <span class="text-base font-bold md:text-lg"
                                        >Собрать абонемент</span
                                    >
                                    <UIcon
                                        name="ph:puzzle-piece-duotone"
                                        class="size-4.5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6 md:size-5.5"
                                    />
                                </UButton>
                                <span class="text-default/90 ml-1 text-xs font-bold">
                                    От <span class="text-primary">450 ₽</span> за занятие в
                                    абонементе – выгоднее разового
                                </span>
                            </div>

                            <div class="flex flex-col gap-1">
                                <UButton
                                    :to="EnrollRoutesEnum.Trial"
                                    size="lg"
                                    variant="soft"
                                    class="group w-fit"
                                >
                                    <span class="font-semibold">Записаться на пробное занятие</span>
                                    <UIcon
                                        name="ph:arrow-right-bold"
                                        class="size-3.5 transition group-hover:translate-x-1"
                                    />
                                </UButton>
                                <span class="text-default/90 ml-1 text-xs font-bold">
                                    Разово, <span class="text-primary">1 200 ₽</span> – без
                                    абонемента
                                </span>
                            </div>
                        </div>
                    </template>
                </UiSectionLeading>
            </div>

            <picture
                class="flex h-96 w-full items-center justify-center overflow-hidden rounded-lg shadow-sm max-lg:max-w-140 max-sm:h-72 lg:h-120"
            >
                <UiPhoto
                    src="/moke/clubs-page-hero.jpeg"
                    :quality="75"
                    :preload="{ fetchPriority: 'high' }"
                    :is-preload="true"
                    :height="480"
                    :width="470"
                    class="flex size-full object-cover"
                />
            </picture>
        </UContainer>
    </UiPageSection>
</template>
