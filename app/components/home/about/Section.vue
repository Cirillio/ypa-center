<script lang="ts" setup>
const appConfig = useAppConfig()

const contacts = appConfig.contactInfo
const promo = appConfig.promo
</script>

<template>
    <section class="relative z-10 flex w-full overflow-hidden bg-white py-12 md:py-20">
        <UContainer
            class="relative z-10 grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16"
        >
            <!-- Left: text content -->
            <div class="flex h-full flex-col gap-6">
                <SectionLeading subtitle="О нашем центре">
                    <template #title>
                        <span class="text-secondary">
                            Место, где каждый<br />
                            ребёнок <span class="text-primary">раскрывается</span>
                        </span>
                    </template>
                    <template #description>
                        «Улица Радости» — это центр умного развития для детей, где уютная атмосфера,
                        внимательные педагоги и интересные занятия помогают каждому ребёнку найти
                        своё призвание и поверить в себя.
                    </template>
                </SectionLeading>

                <div
                    class="bg-default relative flex w-fit flex-col gap-2 overflow-hidden rounded-lg p-4"
                >
                    <UIcon
                        name="ph:map-pin-area-duotone"
                        class="text-primary absolute -top-2 -right-6 size-16 -rotate-25 opacity-50"
                    />
                    <span class="text-default/80 ml-4 text-lg font-semibold">Мы на карте:</span>
                    <UButton
                        size="xl"
                        variant="ghost"
                        :to="contacts.mapLink"
                        target="_blank"
                        class="w-fit"
                    >
                        {{ contacts.address }}
                    </UButton>
                </div>

                <UButton to="/about" size="xl" class="group mt-auto w-fit px-5 py-2.5">
                    <span class="text-lg font-bold">Узнать больше</span>
                    <UIcon
                        name="ph:arrow-right-bold"
                        class="size-5 transition group-hover:translate-x-1"
                    />
                </UButton>
            </div>

            <!-- Right: VK embed video -->
            <div
                class="hover:ring-primary flex aspect-square w-full overflow-hidden rounded-lg ring-2 ring-transparent transition"
            >
                <AppVideo :src="promo.aboutVideoUrl" title="Промо-видео центра Улица Радости" />
            </div>
        </UContainer>
    </section>
</template>
