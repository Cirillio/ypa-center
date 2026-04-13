<script lang="ts" setup>
import type { WeeklySlot } from "~/types"

const props = defineProps<{
    weeklySlot: WeeklySlot
}>()

const style = computed(() => getActivityTheme(props.weeklySlot.activity.id))

const cardClass = computed(() => [
    style.value.bg,
    props.weeklySlot.available === 0 ? "opacity-50 transition-opacity hover:opacity-100" : ""
])
</script>

<template>
    <div
        class="group flex items-center rounded-sm px-4 py-2.75 ring-0 max-md:gap-2 lg:aspect-square lg:flex-col lg:items-stretch"
        :class="cardClass"
    >
        <div class="flex flex-col max-md:gap-0.5">
            <!-- Название -->
            <span
                :title="weeklySlot.activity.name"
                class="line-clamp-2 flex-1 text-base leading-tight font-extrabold xl:line-clamp-3 xl:text-xl"
                :class="style.title"
            >
                {{ weeklySlot.activity.name }}
            </span>

            <span
                :title="'Группа: ' + weeklySlot.groupName"
                class="text-default/95 line-clamp-1 text-xs font-semibold lg:text-sm"
                >{{ weeklySlot.groupName }}</span
            >
        </div>
        <!-- Нижний блок -->
        <div
            class="flex shrink-0 flex-col gap-0.5 max-lg:ml-auto max-lg:items-end max-lg:gap-0.5 lg:mt-auto"
        >
            <!-- Время (desktop) -->
            <span
                :title="`${weeklySlot.startTime}–${weeklySlot.endTime}`"
                class="text-default/85 group-hover:text-default shrink-0 text-sm font-bold transition group-hover:underline xl:text-lg"
            >
                {{ weeklySlot.startTime }}–{{ weeklySlot.endTime }}
            </span>

            <!-- Места -->
            <div
                :title="
                    props.weeklySlot.available
                        ? 'Доступных мест: ' + props.weeklySlot.available
                        : 'Мест нет'
                "
                class="flex w-fit items-center gap-1 rounded-md bg-white px-1.5 py-0.5 text-xs font-bold md:gap-1.5 lg:px-2.5 lg:py-1 lg:text-sm xl:text-base"
                :class="getCapacityTextColor(props.weeklySlot.available)"
            >
                <UIcon name="ph:users-bold" class="mb-0.5 size-4 md:size-4.5" />
                Мест:
                {{ props.weeklySlot.available }}
            </div>
        </div>
    </div>
</template>
