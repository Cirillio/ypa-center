<script lang="ts" setup>
const promo = useAppConfig().promo
</script>

<template>
    <section class="relative z-10 flex w-full overflow-hidden bg-white py-12 sm:py-20 md:py-24">
        <UContainer class="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
            <div class="flex flex-col gap-6">
                <SectionLeading subtitle="Наша история">
                    <template #title>
                        <span class="text-secondary">
                            Как всё<br />
                            <span class="text-primary">начиналось</span>
                        </span>
                    </template>
                    <template #description>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                        consequat.
                    </template>
                </SectionLeading>

                <p class="text-default/60 max-w-md text-base leading-relaxed font-semibold">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                </p>
            </div>

            <div
                class="hover:ring-primary focus-within:ring-primary aspect-square w-full overflow-hidden rounded-lg ring-2 ring-transparent transition duration-300"
            >
                <AppVideo :src="promo.aboutVideoUrl" title="Промо-видео центра Улица Радости" />
            </div>
        </UContainer>
    </section>
</template>
