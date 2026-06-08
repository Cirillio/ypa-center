<script lang="ts" setup>
import { EnrollRoutesEnum } from "~/constants/nav"

defineProps<{
    clubsLength: number | null
}>()
</script>

<template>
    <PageSection class="gradient-bg-ps flex flex-col gap-16">
        <UContainer
            class="relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16"
        >
            <div class="flex flex-col gap-8">
                <SectionLeading as="h1" subtitle="Наши кружки" icon="ph:compass-duotone">
                    <template #title>
                        <span class="text-secondary">
                            Место, где таланты<br />
                            <span class="text-primary">становятся навыками</span>
                        </span>
                    </template>
                    <template #description>
                        Уютное пространство, где каждый найдет увлечение по душе. Внимательные
                        педагоги помогут раскрыть таланты малышам и с удовольствием провести время
                        взрослым.
                    </template>

                    <template #action>
                        <div class="flex flex-col gap-3">
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
                                    От <span class="text-primary">450 ₽</span> за занятие — выгоднее
                                    разового
                                </span>
                            </div>

                            <UButton
                                :to="EnrollRoutesEnum.Trial"
                                size="lg"
                                variant="soft"
                                class="group w-fit"
                            >
                                <span class="font-semibold"
                                    >Или записаться на пробное — 1 200 ₽</span
                                >
                                <UIcon
                                    name="ph:arrow-right-bold"
                                    class="size-3.5 transition group-hover:translate-x-1"
                                />
                            </UButton>
                        </div>
                    </template>
                </SectionLeading>
            </div>

            <picture
                class="flex h-96 w-full items-center justify-center overflow-hidden rounded-lg max-lg:max-w-140 max-sm:h-72 lg:h-120"
            >
                <AppPhoto
                    src="/core/clubs-main.jpg"
                    :quality="100"
                    :preload="{ fetchPriority: 'high' }"
                    :is-preload="true"
                    :height="480"
                    :width="470"
                    class="flex size-full object-cover"
                />
            </picture>
        </UContainer>
        <UContainer>
            <ClubsSectionCTA city="Академгородок" :clubs-quantity="clubsLength || 0" :min-age="6" />
        </UContainer>
    </PageSection>
</template>
