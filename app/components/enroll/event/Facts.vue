<script lang="ts" setup>
// Плитки ключевых фактов о выбранном событии: дата и время, длительность и адрес проведения.
import type { EventItem } from "~/types"

interface EventFactItem {
    id: string
    icon: string
    label: string
    value: string
}

const props = defineProps<{
    event: EventItem
}>()

const { contactInfo } = useAppConfig()

const facts = computed<EventFactItem[]>(() => {
    const items: EventFactItem[] = [
        {
            id: "datetime",
            icon: "ph:calendar-blank-bold",
            label: "Дата и время",
            value: formatEventDateTime(props.event.start_datetime)
        }
    ]

    if (props.event.duration_minutes != null) {
        items.push({
            id: "duration",
            icon: "ph:timer-bold",
            label: "Длительность",
            value: `${props.event.duration_minutes} мин`
        })
    }

    items.push({
        id: "address",
        icon: "ph:map-pin-bold",
        label: "Где",
        value: contactInfo.address
    })

    return items
})
</script>

<template>
    <div class="grid gap-2 sm:grid-cols-2">
        <div
            v-for="fact in facts"
            :key="fact.id"
            class="bg-default flex items-center gap-3 rounded-sm px-4 py-3"
        >
            <span
                class="bg-primary/5 text-primary flex shrink-0 items-center justify-center rounded-full p-2"
            >
                <UIcon :name="fact.icon" class="size-5" aria-hidden="true" />
            </span>
            <div class="grid min-w-0">
                <span class="text-muted text-xs font-semibold">{{ fact.label }}</span>
                <span class="text-default text-base leading-tight font-bold">
                    {{ fact.value }}
                </span>
            </div>
        </div>
    </div>
</template>
