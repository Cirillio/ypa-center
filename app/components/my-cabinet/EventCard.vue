<script lang="ts" setup>
import type { StatusEvent } from "~/types/status"

const record = defineProps<StatusEvent>()

const isPast = computed(() => new Date(record.dateTime.date) < new Date())

const formattedDate = computed(() =>
    new Date(record.dateTime.date).toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric"
    })
)

const rows = computed(() => [
    { label: "Занятие", value: record.event.name },
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
        type-badge="Мероприятие"
        color="fuchsia"
        icon="ph:ticket-bold"
        :rows="rows"
        :status="status"
    />
</template>
