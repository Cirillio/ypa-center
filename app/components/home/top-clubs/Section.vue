<script lang="ts" setup>
import { MOCK_CLUBS } from "~/constants/mock"
</script>

<template>
    <section class="bg-default relative z-10 flex w-full overflow-hidden py-12 md:py-20 lg:py-24">
        <UContainer class="relative z-10 flex flex-col gap-6 md:gap-12">
            <!-- Top: text content -->
            <SectionLeading subtitle="Для вашего ребёнка" icon="ph:star-duotone">
                <template #title>
                    <span class="text-secondary">
                        Популярные<br />
                        <span class="text-primary">направления</span>
                    </span>
                </template>
                <template #description>
                    Самые любимые кружки наших учеников. Выбирайте то, что по душе вашему ребёнку —
                    мы найдём занятие для каждого характера и таланта.
                </template>
                <template #action>
                    <UButton to="/clubs" size="xl" class="group mt-auto w-fit">
                        <span class="font-bold md:text-lg">Смотреть все</span>
                        <UIcon
                            name="ph:arrow-right-bold"
                            class="size-4 transition group-hover:translate-x-1 md:size-5"
                        />
                    </UButton>
                </template>
            </SectionLeading>

            <!-- Grid: big card left, two square cards right -->
            <div
                class="grid w-full grid-cols-1 overflow-hidden rounded-md max-md:gap-4 md:aspect-2/1 md:grid-cols-[2fr_1fr] md:grid-rows-2 lg:gap-2"
            >
                <LazyHomeTopClubsCard
                    v-for="(club, i) in MOCK_CLUBS.slice(0, 3)"
                    :key="club.title"
                    v-bind="club"
                    class="h-80 md:h-auto"
                    :class="{ 'md:row-span-2 *:*:last:md:text-2xl *:*:first:xl:text-6xl': i === 0 }"
                />
            </div>
            <!-- Floating promo card -->
            <FloatPromoCard
                to="/teachers"
                icon="ph:chalkboard-teacher-duotone"
                sublabel="Наши"
                label="Учителя"
                description="Профессионалы, которые вдохновляют детей и помогают найти призвание."
                go-text="Познакомиться"
                class="max-md:relative! max-md:size-auto!"
            />
        </UContainer>
    </section>
</template>
