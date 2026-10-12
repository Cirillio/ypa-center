<script lang="ts" setup>
// Индикатор заполненности мест на событии с прогресс-полосой и семантическим цветом остатка.
const props = defineProps<{
    available: number
    capacity: number
}>()

const occupiedPercent = computed(() => {
    if (props.capacity <= 0) return 0
    const occupied = Math.max(0, props.capacity - props.available)
    return Math.min(100, Math.round((occupied / props.capacity) * 100))
})
</script>

<template>
    <div class="flex flex-col gap-1.5">
        <div class="flex justify-between text-sm font-semibold">
            <span class="text-muted">Заполненность</span>
            <span :class="getCapacityTextColor(available)">
                Свободно {{ available }} из {{ capacity }}
            </span>
        </div>
        <div class="bg-default h-2 overflow-hidden rounded-full" aria-hidden="true">
            <div
                class="bg-primary h-full rounded-full transition-all duration-500"
                :style="{ width: `${occupiedPercent}%` }"
            />
        </div>
    </div>
</template>
