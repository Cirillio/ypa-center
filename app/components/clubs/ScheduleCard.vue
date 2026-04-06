<script lang="ts" setup>
import type { WeeklySlot } from "~/types"

const props = defineProps<{
    weeklySlot: WeeklySlot
}>()

const CARD_STYLES: { bg: string; title: string }[] = [
    { bg: "bg-sky-100 ring-sky-200", title: "text-sky-600" },
    { bg: "bg-lime-100 ring-lime-200", title: "text-lime-700" },
    { bg: "bg-rose-100 ring-rose-200", title: "text-rose-600" },
    { bg: "bg-fuchsia-100 ring-fuchsia-200", title: "text-fuchsia-600" },
    { bg: "bg-violet-100 ring-violet-200", title: "text-violet-600" },
    { bg: "bg-cyan-100 ring-cyan-200", title: "text-cyan-600" },
    { bg: "bg-amber-100 ring-amber-200", title: "text-amber-500" },
    { bg: "bg-orange-100 ring-orange-200", title: "text-orange-400" },
    { bg: "bg-emerald-100 ring-emerald-200", title: "text-emerald-700" },
    { bg: "bg-indigo-100 ring-indigo-200", title: "text-indigo-600" }
]

const style = computed(() => CARD_STYLES[(props.weeklySlot.activity.id - 1) % CARD_STYLES.length]!)

const spotsColor = computed<string | null>(() => {
    const n = props.weeklySlot.available
    if (n === 0) return null
    if (n <= 3) return "text-amber-500"
    return "text-emerald-600"
})

const cardClass = computed(() => [
    style.value.bg,
    props.weeklySlot.available === 0 ? "opacity-50 transition-opacity hover:opacity-100" : ""
])
</script>

<template>
    <div
        class="group flex items-center rounded-md px-4 py-2.75 ring-0 max-md:gap-2 lg:aspect-square lg:flex-col lg:items-stretch"
        :class="cardClass"
    >
        <div class="flex flex-col max-md:gap-0.5">
            <!-- Название -->
            <span
                :title="weeklySlot.activity.name"
                class="line-clamp-2 flex-1 text-base leading-tight font-extrabold md:line-clamp-3 md:text-xl xl:text-xl"
                :class="style.title"
            >
                {{ weeklySlot.activity.name }}
            </span>

            <span
                :title="'Группа: ' + weeklySlot.groupName"
                class="text-default/75 line-clamp-1 text-xs font-semibold lg:text-sm"
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
                class="text-default/85 group-hover:text-default shrink-0 font-bold transition group-hover:underline lg:text-base xl:text-lg"
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
                :class="spotsColor"
            >
                <UIcon name="ph:users-bold" class="mb-0.5 size-4 md:size-4.5" />
                Мест:
                {{ props.weeklySlot.available }}
            </div>
        </div>
    </div>
</template>
