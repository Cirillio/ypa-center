<script lang="ts" setup>
import { MOCK_CLUBS_FULL } from "~/constants/mock"

// TODO: заменить на useFetch после реализации GET /clubs/ на бэке
const clubs = MOCK_CLUBS_FULL

useSeoMeta({
    title: "Кружки — Улица Радости",
    description:
        "Каталог кружков детского центра «Улица Радости». Настольные игры, рисование, пианино, каникулярные программы и другие занятия для детей в Новосибирске.",
    ogTitle: "Кружки — Улица Радости",
    ogDescription: "Найдите занятие для вашего ребёнка. Внимательные педагоги и уютная атмосфера."
})
</script>

<template>
    <div class="flex w-full min-w-0 flex-col">
        <ClubsSection />
        <div class="relative z-20 h-0 w-full">
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <UButton
                    to="/clubs#schedule"
                    size="xl"
                    label="Посмотреть расписание"
                    trailing-icon="ph:arrow-down-bold"
                    class="floating-element-slow text-lg"
                />
            </div>
        </div>

        <section class="bg-default relative z-10 flex w-full py-12 md:py-20">
            <UContainer class="flex w-full flex-col gap-6 md:gap-8">
                <div class="flex items-center justify-between gap-4">
                    <h2 class="text-secondary text-2xl font-extrabold md:text-3xl">Все кружки</h2>
                    <span class="text-primary text-lg font-bold">{{ clubs.length }}</span>
                </div>
                <ClubsGrid :clubs="clubs" />
            </UContainer>
        </section>

        <ClubsOtherServices />
        <ClubsSchedule :clubs="clubs" />
        <AppFaqSection />
    </div>
</template>
