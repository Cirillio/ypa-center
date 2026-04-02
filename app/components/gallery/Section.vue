<script lang="ts" setup>
// Hero-шапка страницы галереи
</script>

<template>
    <section
        class="bg-default relative z-10 flex w-full overflow-hidden pt-[calc(var(--header-height)+3rem)] pb-16 md:pt-40 md:pb-24"
    >
        <!-- Декоративная иконка -->
        <div
            class="bg-default absolute top-6 left-6 z-0 flex rounded-full p-2 opacity-50 xl:top-20 xl:right-auto xl:left-0 xl:-translate-x-1/2 xl:rounded-none xl:bg-transparent xl:p-0 xl:opacity-10"
        >
            <UIcon name="ph:camera-duotone" class="text-secondary size-10 xl:size-120" />
        </div>

        <UContainer class="relative z-10 flex flex-col gap-8">
            <FloatPromoCard
                to="https://t.me/joystreet"
                icon="ph:images-fill"
                sublabel="Больше"
                label="Фото"
                description="Ищите в нашем телеграм канале."
                :external="true"
                :target="'_blank'"
            />
            <SectionLeading subtitle="Наши моменты" center>
                <template #title>
                    <span class="text-secondary">
                        Галерея<br />
                        <span class="text-primary">центра</span>
                    </span>
                </template>
                <template #description>
                    Загляните в нашу жизнь — яркие занятия, счастливые лица и уютная атмосфера
                    «Улицы Радости».
                </template>
            </SectionLeading>
        </UContainer>
    </section>
</template>
