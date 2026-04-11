<script lang="ts" setup>
const appConfig = useAppConfig()

const contacts = appConfig.contactInfo
const promo = appConfig.promo
</script>

<template>
    <section class="bg-default relative z-10 flex w-full overflow-hidden py-12 md:py-20 lg:py-24">
        <UContainer
            class="relative z-10 grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16"
        >
            <!-- Left: text content -->
            <div class="flex h-full flex-col gap-6">
                <SectionLeading subtitle="О нашем центре" icon="ph:heart-duotone">
                    <template #title>
                        <span class="text-secondary">
                            Уже {{ appConfig.stats.studentsCount }} человек<br />
                            <span class="text-primary">доверяют нам свой рост и досуг</span>
                        </span>
                    </template>
                    <template #description>
                        Наш центр — это экосистема непрерывного роста. Мы создали среду, в которой
                        одинаково комфортно развивать таланты малышей и прокачивать собственные
                        навыки, получая удовольствие от процесса.
                    </template>
                </SectionLeading>

                <div
                    class="relative flex w-fit flex-col gap-1 overflow-hidden rounded-lg bg-white p-2 md:gap-2 md:p-4"
                >
                    <UIcon
                        name="ph:map-pin-area-duotone"
                        class="text-primary absolute -top-2 -right-2 size-12 -rotate-25 opacity-50 md:-right-6 md:size-16"
                    />
                    <span class="text-default/80 ml-4 text-base font-semibold md:text-lg"
                        >Мы на карте:</span
                    >
                    <UButton
                        size="xl"
                        variant="ghost"
                        :to="contacts.mapLink"
                        target="_blank"
                        class="w-fit max-md:text-sm"
                    >
                        {{ contacts.address }}
                    </UButton>
                </div>

                <UButton to="/about" size="xl" class="group mt-auto w-fit">
                    <span class="font-bold md:text-lg">Узнать больше</span>
                    <UIcon
                        name="ph:arrow-right-bold"
                        class="size-5 transition group-hover:translate-x-1"
                    />
                </UButton>
            </div>

            <!-- Right: VK embed video -->
            <div
                class="hover:ring-primary focus-within:ring-primary flex aspect-square w-full overflow-hidden rounded-lg ring-2 ring-transparent transition"
            >
                <LazyAppVideo :src="promo.aboutVideoUrl" title="Промо-видео центра Улица Радости" />
            </div>
        </UContainer>
    </section>
</template>
