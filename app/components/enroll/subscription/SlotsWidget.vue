<script lang="ts" setup>
// Виджет «Кружки по дням» с вкладками дней недели, уведомлением о конфликтах и сеткой слотов абонемента.
import type { ScheduleWeekDay, SubscriptionSlotConflict, WeeklySlot } from "~/types"

defineProps<{
    slots: WeeklySlot[]
    selectedIds: Set<number>
    days: ScheduleWeekDay[]
    selectedDow: number
    countsByDow: Record<number, number>
    conflicts: SubscriptionSlotConflict[]
    isPending: boolean
    error?: unknown
}>()

const emit = defineEmits<{
    selectDay: [day: ScheduleWeekDay]
    toggleSlot: [slot: WeeklySlot]
    retry: []
}>()
</script>

<template>
    <section aria-label="Выбор кружков" class="flex min-w-0 flex-col gap-5 rounded-lg bg-white p-6">
        <div class="flex items-center gap-3">
            <div
                class="bg-primary/5 text-primary flex items-center justify-center rounded-full p-2"
            >
                <UIcon name="ph:puzzle-piece-bold" class="size-5" aria-hidden="true" />
            </div>
            <h2 class="text-primary text-xl font-bold">Кружки по дням</h2>
        </div>

        <p class="text-muted flex items-start gap-2 text-sm">
            <UIcon name="ph:info-bold" class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>
                Абонемент действует
                <span class="text-default font-bold">месяц с первого занятия</span>: каждый кружок
                развернётся в 4 занятия. Свободные места показаны для ориентира.
            </span>
        </p>

        <EnrollSubscriptionDayTabs
            :days="days"
            :selected-dow="selectedDow"
            :counts-by-dow="countsByDow"
            @select="emit('selectDay', $event)"
        />

        <EnrollSubscriptionConflictAlert :conflicts="conflicts" />

        <div
            id="subscription-day-panel"
            role="tabpanel"
            :aria-labelledby="`subscription-day-tab-${selectedDow}`"
        >
            <div
                v-if="error"
                class="bg-default flex flex-col items-center justify-center gap-3 rounded-sm py-8 text-center"
            >
                <UIcon
                    name="ph:warning-circle-duotone"
                    class="text-muted size-10"
                    aria-hidden="true"
                />
                <p class="text-muted text-sm font-medium">Не удалось загрузить расписание.</p>
                <UButton variant="soft" size="sm" label="Повторить" @click="emit('retry')" />
            </div>

            <div
                v-else-if="isPending"
                class="grid grid-cols-2 gap-2 sm:grid-cols-3"
                aria-busy="true"
            >
                <USkeleton v-for="n in 6" :key="`skeleton-${n}`" class="aspect-5/3 rounded-sm" />
            </div>

            <div v-else-if="slots.length > 0" class="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <EnrollSubscriptionSlotCard
                    v-for="slotItem in slots"
                    :key="slotItem.id"
                    :slot-item="slotItem"
                    :is-selected="selectedIds.has(slotItem.id)"
                    @toggle="emit('toggleSlot', $event)"
                />
            </div>

            <div
                v-else
                class="bg-default flex aspect-5/2 flex-col items-center justify-center gap-1.5 rounded-sm"
            >
                <UIcon name="ph:coffee-bold" class="text-dimmed size-10" aria-hidden="true" />
                <span class="text-muted font-semibold">Выходной</span>
            </div>
        </div>
    </section>
</template>
