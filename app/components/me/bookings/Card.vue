<script lang="ts" setup>
// Карточка разовой записи на событие или пробное занятие.
import type { MeBooking } from "~/types"

const props = defineProps<{
    booking: MeBooking
}>()

const rows = computed(() => [
    { label: "Участник", value: props.booking.participant },
    { label: "Дата и время", value: `${props.booking.displayDate} · ${props.booking.displayTime}` },
    { label: "Стоимость", value: formatRub(props.booking.price) }
])
</script>

<template>
    <div class="bg-default flex flex-col gap-4 rounded-lg p-3.75">
        <!-- Шапка: бейдж типа + заголовок -->
        <div class="flex items-center gap-3">
            <MeActivityTypeBadge :type="booking.kind" />
            <div class="min-w-0 flex-1">
                <h3 class="text-default truncate text-base leading-tight font-semibold">
                    {{ booking.title }}
                </h3>
                <p v-if="booking.subtitle" class="text-default/60 truncate text-xs leading-tight">
                    {{ booking.subtitle }}
                </p>
            </div>
        </div>

        <USeparator />

        <!-- Детали записи -->
        <dl class="flex flex-col gap-2">
            <div
                v-for="row in rows"
                :key="row.label"
                class="flex items-center justify-between gap-2 px-1"
            >
                <dt class="text-default/70 text-sm font-medium">{{ row.label }}</dt>
                <dd class="text-default text-end text-sm font-semibold">
                    {{ row.value }}
                </dd>
            </div>
        </dl>
    </div>
</template>
