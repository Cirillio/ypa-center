<script lang="ts" setup>
// Степпер количества мест: кнопки ± блокируются на границах 1 и остатка события.
defineProps<{
    seats: number
    max: number
    hasEvent: boolean
}>()

const emit = defineEmits<{
    change: [delta: number]
}>()
</script>

<template>
    <section class="flex flex-col gap-2" aria-label="Количество мест">
        <h3 class="text-default text-base font-semibold">Количество мест</h3>
        <div class="flex items-center justify-between gap-3">
            <div
                class="bg-default flex items-center gap-1 rounded-full p-1"
                role="group"
                aria-label="Изменить количество мест"
            >
                <UButton
                    icon="ph:minus-bold"
                    color="neutral"
                    variant="ghost"
                    class="rounded-full hover:bg-white"
                    aria-label="Меньше"
                    :disabled="seats <= 1"
                    @click="emit('change', -1)"
                />
                <output
                    aria-live="polite"
                    class="text-default min-w-10 text-center text-xl font-extrabold tabular-nums"
                >
                    {{ seats }}
                </output>
                <UButton
                    icon="ph:plus-bold"
                    color="neutral"
                    variant="ghost"
                    class="rounded-full hover:bg-white"
                    aria-label="Больше"
                    :disabled="!hasEvent || seats >= max"
                    @click="emit('change', 1)"
                />
            </div>
            <span class="text-muted text-xs font-semibold">
                {{ hasEvent ? `Свободно: ${max}` : "Сначала выберите событие" }}
            </span>
        </div>
    </section>
</template>
