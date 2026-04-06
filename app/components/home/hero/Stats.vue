<template>
    <div
        class="text-default/55 flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold max-md:flex-col sm:text-sm md:items-center"
    >
        <span v-for="stat in CENTER_STATS" :key="stat.label" class="flex items-center gap-1.5">
            <UIcon :name="stat.icon" class="size-4 shrink-0" :class="stat.textColor" />
            {{ stat.value }} {{ stat.label }}
        </span>
    </div>
</template>

<script lang="ts" setup>
const { stats, pricing } = useAppConfig()

const CENTER_STATS = [
    {
        icon: "ph:mask-happy-duotone",
        textColor: "text-amber-400",
        label: "Счастливых ребят",
        value: stats.studentsCount
    },
    {
        icon: "ph:shooting-star-duotone",
        textColor: "text-emerald-500",
        label: `Работаем с ${stats.workingSince}`,
        value: stats.workingYearsText
    },
    {
        icon: "ph:book-bookmark-duotone",
        textColor: "text-cyan-500",
        label: "Пробное занятие",
        value: `${pricing.trialLesson} ₽`
    }
]
</script>
