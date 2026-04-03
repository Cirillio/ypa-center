<script lang="ts" setup>
const contacts = useAppConfig().contactInfo
</script>

<template>
    <section id="map" name="center-map" class="relative z-10 flex w-full flex-col bg-white">
        <UContainer class="py-16 md:py-24">
            <SectionLeading subtitle="Мы на карте" center> </SectionLeading>

            <div
                class="hover:ring-primary overflow-hidden rounded-md ring-2 ring-transparent transition"
            >
                <div class="relative h-150 w-full">
                    <iframe
                        id="map-iframe"
                        title="Улица Радости на карте"
                        src="https://yandex.ru/map-widget/v1/-/CPRON8mX"
                        width="100%"
                        height="100%"
                        frameborder="0"
                        allowfullscreen
                        class="block w-full"
                    />

                    <!-- Карточка адреса -->
                    <div
                        class="ring-secondary/50 absolute bottom-6 left-1/2 z-10 grid -translate-x-1/2 grid-cols-[auto_1fr] items-center gap-x-2 gap-y-2 rounded-md bg-white p-4 ring-2 sm:right-12 sm:bottom-8 sm:left-auto sm:translate-x-0"
                    >
                        <UIcon name="ph:map-pin-duotone" class="text-primary size-5" />
                        <span class="text-default text-sm font-semibold">
                            {{ contacts.address }}
                        </span>

                        <UIcon name="ph:phone-duotone" class="text-primary size-5" />
                        <a
                            :href="`tel:${contacts.phoneTo}`"
                            class="text-secondary hover:text-primary text-sm font-semibold transition-colors"
                        >
                            {{ contacts.phone }}
                        </a>

                        <UIcon name="ph:clock-duotone" class="text-primary size-5" />
                        <span class="text-default/70 text-sm font-semibold">
                            {{ contacts.workingHours }}
                        </span>

                        <a
                            :href="contacts.mapLink"
                            target="_blank"
                            class="bg-secondary col-span-2 mt-1 flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                        >
                            Открыть в Яндекс.Картах
                            <UIcon name="ph:arrow-square-out-bold" class="size-4" />
                        </a>
                    </div>
                </div>
            </div>
        </UContainer>
    </section>
</template>
