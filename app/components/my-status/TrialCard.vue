<script lang="ts" setup>
import type { StatusTrial } from "~/types/status"

const record = defineProps<StatusTrial>()

const isPast = computed(() => new Date(record.dateTime.date) < new Date())

const formattedDate = computed(() => {
    return new Date(record.dateTime.date).toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric"
    })
})

const datetime = computed(
    () => `${formattedDate.value} ${record.dateTime.startTime}-${record.dateTime.endTime}`
)
</script>

<template>
    <MyStatusActivityCard
        :id="record.id"
        subtitle="Пробное занятие"
        color="cyan"
        icon="ph:calendar-dot-bold"
        :participant="record.participant.name"
        :created-at="record.createdAt"
        :status-text="isPast ? 'Пройдено' : undefined"
    >
        <template #details>
            <span class="text-default text-lg font-medium">Стоимость:</span>
            <span class="text-primary col-start-2 text-end text-lg font-medium">
                {{ record.sum }}р
            </span>
        </template>

        <MyStatusActivityItem
            :title="record.club.name"
            :desc="record.club.subgroup.name"
            :datetime="datetime"
            :is-active="!isPast"
        />
    </MyStatusActivityCard>
</template>
