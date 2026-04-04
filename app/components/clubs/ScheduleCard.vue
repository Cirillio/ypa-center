<script lang="ts" setup>
import type { Club } from "~/types"

const props = defineProps<{
    club: Club
    variant: "row" | "square"
}>()

const CLUB_STYLES: { bg: string; title: string }[] = [
    { bg: "bg-orange-50 ring-orange-200", title: "text-orange-500" },
    { bg: "bg-emerald-50 ring-emerald-200", title: "text-emerald-700" },
    { bg: "bg-violet-50 ring-violet-200", title: "text-violet-600" },
    { bg: "bg-sky-50 ring-sky-200", title: "text-sky-600" },
    { bg: "bg-rose-50 ring-rose-200", title: "text-rose-600" },
    { bg: "bg-amber-50 ring-amber-200", title: "text-amber-500" }
]

const style = computed(() => CLUB_STYLES[(props.club.id - 1) % CLUB_STYLES.length]!)

const spots = computed(() => {
    const n = props.club.spots_available
    if (n === 0) return { label: "Мест нет", colorClass: "text-red-500" }
    if (n <= 3) return { label: `Мало (${n})`, colorClass: "text-amber-500" }
    return { label: `Мест: ${n}`, colorClass: "text-emerald-600" }
})

const computedClass = computed(() => {
    return `${style.value.bg} ${props.club.spots_available === 0 ? "opacity-50 transition-opacity hover:opacity-100" : ""}`
})
</script>

<template>
    <!-- Строчный вариант (мобиль) -->
    <div
        v-if="variant === 'row'"
        class="flex items-center gap-4 rounded-md p-4 ring-2"
        :class="style.bg"
    >
        <div class="flex shrink-0 flex-col items-center">
            <span class="text-default text-base leading-none font-extrabold">{{
                club.schedule.timeStart
            }}</span>
            <span class="text-default/35 text-xs font-semibold">{{ club.schedule.timeEnd }}</span>
        </div>
        <div class="bg-default/20 h-8 w-px shrink-0" />
        <span class="flex-1 text-base font-extrabold" :class="style.title">{{ club.name }}</span>
        <span
            class="w-fit rounded-xs bg-white px-1.5 py-0.5 text-xs font-bold"
            :class="spots.colorClass"
            >{{ spots.label }}</span
        >
    </div>

    <!-- Квадратный вариант (десктоп) -->
    <div
        v-else
        class="flex aspect-4/3 flex-col justify-between rounded-md px-4 py-3 ring-2"
        :class="computedClass"
    >
        <span
            class="line-clamp-2 text-xl leading-snug font-extrabold xl:text-2xl"
            :class="style.title"
        >
            {{ club.name }}
        </span>
        <div class="flex flex-col gap-0.5">
            <span class="text-default/85 text-lg font-bold xl:text-xl">
                {{ club.schedule.timeStart }}–{{ club.schedule.timeEnd }}
            </span>
            <span
                class="w-fit rounded-xs bg-white px-2.5 py-1 text-base font-semibold xl:text-lg"
                :class="spots.colorClass"
            >
                {{ spots.label }}
            </span>
        </div>
    </div>
</template>
