<script lang="ts" setup>
import type { Activity } from "~/types"

defineProps<{
    activities: Activity[]
}>()
</script>

<template>
    <section class="bg-default relative z-10 flex w-full py-12 md:py-20 lg:py-24">
        <UContainer class="flex w-full flex-col gap-6 md:gap-8">
            <!-- Заголовок -->
            <h2
                class="text-secondary text-4xl leading-[0.9] font-extrabold lg:text-5xl xl:text-6xl"
            >
                Все <span class="text-primary">кружки</span>
            </h2>

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
