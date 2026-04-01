<script lang="ts" setup>
import { MOCK_CLUBS } from "~/constants/mock"
</script>

<template>
    <section class="bg-default relative z-10 flex w-full overflow-hidden py-20">
        <UIcon
            name="ph:puzzle-piece-duotone"
            class="text-secondary absolute top-8 right-0 z-0 size-120 translate-x-1/2 opacity-15"
        />

        <UContainer class="relative z-10 flex flex-col gap-12 md:gap-16">
            <!-- Floating promo card -->
            <HomeTopClubsOurTeachersCard />

            <!-- Top: text content -->
            <SectionLeading subtitle="Для вашего ребёнка">
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
                    <UButton to="/clubs" size="xl" class="group mt-auto w-fit px-5 py-2.5">
                        <span class="text-lg font-bold">Все кружки</span>
                        <UIcon
                            name="ph:arrow-right-bold"
                            class="size-5 transition group-hover:translate-x-1"
                        />
                    </UButton>
                </template>
            </SectionLeading>

            <!-- 2x2 Grid -->
            <div class="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
                <LazyHomeTopClubsCard
                    v-for="club in MOCK_CLUBS"
                    :key="club.title"
                    v-bind="club"
                    class="h-98"
                />
            </div>
        </UContainer>
    </section>
</template>
