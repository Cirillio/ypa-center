<script lang="ts" setup>
import type { Activity } from "~/types"

const props = defineProps<{
    activities: Activity[]
    hasSchedule: boolean
}>()

// Возрастной диапазон по всем группам всех кружков: минимум из age_min, максимум из age_max.
const ageLabel = computed(() => {
    const groups = props.activities.flatMap((activity) => activity.groups)
    const mins = groups.map((g) => g.age_min).filter((age): age is number => age != null)
    const maxs = groups.map((g) => g.age_max).filter((age): age is number => age != null)

    return formatAgeRange(
        mins.length ? Math.min(...mins) : null,
        maxs.length ? Math.max(...maxs) : null
    )
})
</script>

<template>
    <section class="bg-default relative z-10 flex w-full py-12 md:py-20 lg:py-24">
        <UContainer class="flex w-full flex-col gap-6 md:gap-8">
            <!-- Заголовок и сводка по каталогу -->
            <div class="flex flex-col items-start gap-6">
                <h2
                    class="text-secondary text-4xl leading-[0.9] font-extrabold lg:text-5xl xl:text-6xl"
                >
                    Все <span class="text-primary">кружки</span>
                </h2>

                <dl class="flex flex-col gap-2 text-base font-semibold md:text-lg">
                    <div class="flex items-baseline gap-2">
                        <dt class="text-muted">Всего направлений:</dt>
                        <dd class="text-default font-bold">{{ activities.length }}</dd>
                    </div>
                    <div v-if="ageLabel" class="flex items-baseline gap-2">
                        <dt class="text-muted">Возраст:</dt>
                        <dd class="text-default font-bold">{{ ageLabel }}</dd>
                    </div>
                </dl>

                <UButton
                    v-if="hasSchedule"
                    to="/clubs#schedule"
                    size="lg"
                    variant="soft"
                    class="group w-fit"
                >
                    <span class="font-semibold">К расписанию</span>
                    <UIcon
                        name="ph:arrow-right-bold"
                        class="size-3.5 transition group-hover:translate-x-1"
                    />
                </UButton>
            </div>

            <!-- Список кружков -->
            <div class="grid w-full gap-4">
                <LazyClubsCard
                    v-for="(item, i) in activities"
                    :key="item.id"
                    :activity="item"
                    :index="i"
                />
            </div>
            <!-- Приписка -->
            <span class="text-default/95 text-xs font-semibold md:text-sm"
                >• Узнать какие учителя занимаются направлениями можно на
                <NuxtLink to="/teachers" class="text-primary">странице учителей</NuxtLink>.</span
            >
        </UContainer>
    </section>
</template>
