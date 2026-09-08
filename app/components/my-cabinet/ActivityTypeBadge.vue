<script lang="ts" setup>
// Единственный источник правды по визуальной идентичности типа активности
// (иконка + оттенок + подпись). Используется карточкой абонемента и
// карточкой ближайшего занятия.
type ActivityType = "subscription" | "trial" | "event"

const props = defineProps<{ type: ActivityType }>()

const MAP: Record<ActivityType, { label: string; icon: string; tint: string }> = {
    subscription: {
        label: "Абонемент",
        icon: "ph:star-bold",
        tint: "bg-rose-500/5 text-rose-500"
    },
    trial: {
        label: "Пробное занятие",
        icon: "ph:calendar-dot-bold",
        tint: "bg-cyan-500/5 text-cyan-500"
    },
    event: {
        label: "Мероприятие",
        icon: "ph:ticket-bold",
        tint: "bg-fuchsia-500/5 text-fuchsia-500"
    }
}

const badge = computed(() => MAP[props.type])
</script>

<template>
    <UTooltip :text="badge.label">
        <span
            class="flex shrink-0 items-center justify-center rounded-full p-2"
            :class="badge.tint"
            :aria-label="badge.label"
        >
            <UIcon :name="badge.icon" class="size-5" />
        </span>
    </UTooltip>
</template>
