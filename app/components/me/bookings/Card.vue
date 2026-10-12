<script lang="ts" setup>
// Карточка записи на пробное или событие со статусом оплаты; прошедшая – приглушена.
import type { MeBooking } from "~/types"

const props = defineProps<{
    booking: MeBooking
}>()

const rows = computed(() => [
    { label: "Участник", value: props.booking.participant || "–" },
    { label: "Дата и время", value: `${props.booking.displayDate} · ${props.booking.displayTime}` },
    {
        label: "Стоимость",
        value:
            props.booking.price == null
                ? "–"
                : props.booking.price === 0
                  ? "Бесплатно"
                  : formatRubles(props.booking.price)
    }
])

// Прошедшее подтверждённое бейджа не получает: «Записан» на прошлом вводит в заблуждение
const badge = computed(() => {
    if (props.booking.status === "PENDING") {
        return { label: props.booking.statusLabel, color: "warning" as const }
    }
    if (!props.booking.isPast) {
        return { label: props.booking.statusLabel, color: "success" as const }
    }
    return null
})
</script>

<template>
    <div
        class="bg-default flex flex-col gap-4 rounded-lg p-3.75"
        :class="{ 'opacity-75': booking.isPast }"
    >
        <!-- Шапка: бейдж типа + заголовок + статус -->
        <div class="flex items-center gap-3">
            <MeActivityTypeBadge :type="booking.kind" />
            <div class="min-w-0 flex-1">
                <h3 class="text-default truncate text-base leading-tight font-semibold">
                    {{ booking.title }}
                </h3>
                <p v-if="booking.subtitle" class="text-muted truncate text-xs leading-tight">
                    {{ booking.subtitle }}
                </p>
            </div>
            <UBadge
                v-if="badge"
                :label="badge.label"
                :color="badge.color"
                variant="soft"
                class="shrink-0"
            />
        </div>

        <USeparator />

        <!-- Детали записи -->
        <dl class="flex flex-col gap-2">
            <div
                v-for="row in rows"
                :key="row.label"
                class="flex items-center justify-between gap-2 px-1"
            >
                <dt class="text-muted text-sm font-medium">{{ row.label }}</dt>
                <dd class="text-default text-end text-sm font-semibold">
                    {{ row.value }}
                </dd>
            </div>
        </dl>
    </div>
</template>
