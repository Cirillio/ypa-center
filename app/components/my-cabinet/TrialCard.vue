<script lang="ts" setup>
import type { StatusTrial } from "~/types/status"

const record = defineProps<StatusTrial>()

const isPast = computed(() => new Date(record.dateTime.date) < new Date())

const formattedDate = computed(() =>
    new Date(record.dateTime.date).toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric"
    })
)

const rows = computed(() => [
    { label: "Занятие", value: record.club.name },
    {
        label: "Дата и время",
        value: `${formattedDate.value}, ${record.dateTime.startTime}-${record.dateTime.endTime}`
    },
    { label: "Ребёнок", value: record.participant.name },
    { label: "Стоимость", value: `${record.sum}р` }
])

const status = computed(() =>
    isPast.value
        ? { text: "Пройдено", variant: "done" as const }
        : { text: "Предстоит", variant: "live" as const }
)
</script>

<template>
    <MyCabinetActivityCard
        :id="record.id"
        type-badge="Пробное"
        color="cyan"
        icon="ph:calendar-dot-bold"
        :rows="rows"
        :status="status"
    />
</template>
