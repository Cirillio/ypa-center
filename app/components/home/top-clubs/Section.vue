<script lang="ts" setup>
import type { ActivityPopular } from "~/types"

const { apiFetch } = useApi()
const { data, error } = await useAsyncData("popular-clubs", () =>
    apiFetch<ActivityPopular[]>("/v1/public/activities/popular/")
)

// Бэк лимитирует выдачу тремя, но контракт на «ровно 3» не гарантирован —
// >4 обрезаем сами, раскладка ниже рассчитана на 2..4
const clubs = computed(() => (data.value ?? []).slice(0, 4))

type Variant = "empty" | "duo" | "trio" | "quad"

const variant = computed<Variant>(() => {
    if (error.value) return "empty"
    switch (clubs.value.length) {
        case 4:
            return "quad"
        case 3:
            return "trio"
        case 2:
            return "duo"
        default:
            return "empty"
    }
})

// Раскладка grid-контейнера по числу карточек (мобила всегда столбик — grid-cols-1)
const GRID_CLASS: Record<Exclude<Variant, "empty">, string> = {
    duo: "md:aspect-2/1 md:grid-cols-2 md:grid-rows-1",
    trio: "md:aspect-2/1 md:grid-cols-[2fr_1fr] md:grid-rows-2",
    quad: "md:aspect-square md:grid-cols-2 md:grid-rows-2"
}
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

            <!-- Мало кружков или ошибка загрузки — приглашение в каталог вместо сетки -->
            <HomeTopClubsEmpty v-if="variant === 'empty'" />

            <!-- Grid: раскладка зависит от числа карточек (2/3/4) -->
            <div
                v-else
                class="grid w-full grid-cols-1 overflow-hidden rounded-md max-md:gap-4 lg:gap-2"
                :class="GRID_CLASS[variant]"
            >
                <LazyHomeTopClubsCard
                    v-for="(club, i) in clubs"
                    :key="club.id"
                    :name="club.name"
                    :short-description="club.short_description ?? ''"
                    :cover-image="club.cover_image"
                    :featured="variant === 'trio' && i === 0"
                    class="h-80 md:h-auto"
                    :class="{ 'md:row-span-2': variant === 'trio' && i === 0 }"
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
