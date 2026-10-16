<script lang="ts" setup>
// Виджет «Кружки по дням»: вся неделя сразу (как сетка /clubs), уведомление о конфликтах и выбор слотов абонемента.
import type { ScheduleWeekDay, SubscriptionSlotConflict, WeeklySlot } from "~/types"

defineProps<{
    slotsByDow: Record<number, WeeklySlot[]>
    selectedIds: Set<number>
    days: ScheduleWeekDay[]
    countsByDow: Record<number, number>
    conflicts: SubscriptionSlotConflict[]
    isPending: boolean
    error?: unknown
}>()

const emit = defineEmits<{
    toggleSlot: [slot: WeeklySlot]
    retry: []
}>()
</script>

<template>
    <section
        aria-label="Выбор кружков"
        class="flex min-w-0 flex-col gap-5 rounded-lg bg-white p-6 shadow-sm"
    >
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
                <span class="text-default font-bold">4 недели с первого занятия</span>: каждый
                кружок развернётся в 4 занятия. Свободные места показаны для ориентира.
            </span>
        </p>

        <EnrollSubscriptionConflictAlert :conflicts="conflicts" />

        <div
            v-if="error"
            class="bg-default flex flex-col items-center justify-center gap-3 rounded-sm py-8 text-center"
        >
            <UIcon name="ph:warning-circle-duotone" class="text-muted size-10" aria-hidden="true" />
            <p class="text-muted text-sm font-medium">Не удалось загрузить расписание.</p>
            <UButton variant="soft" size="sm" label="Повторить" @click="emit('retry')" />
        </div>

        <!-- ПОЧЕМУ дни подряд, а не 7 колонок: колонка рядом со сводкой ~100 px, карточка слота в неё не влезает -->
        <div v-else class="flex flex-col gap-5" :aria-busy="isPending">
            <section
                v-for="day in days"
                :key="day.dow"
                :aria-label="day.dayShort"
                class="flex min-w-0 flex-col gap-2"
            >
                <div
                    class="flex items-center gap-2 rounded-md px-3 py-1.5"
                    :class="day.isToday ? 'bg-primary text-white' : 'bg-default text-default/95'"
                >
                    <span class="font-bold uppercase">{{ day.dayShort }}</span>
                    <span
                        v-if="countsByDow[day.dow]"
                        class="flex min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold"
                        :class="day.isToday ? 'text-primary bg-white' : 'bg-secondary text-white'"
                        :aria-label="`Выбрано: ${countsByDow[day.dow]}`"
                    >
                        {{ countsByDow[day.dow] }}
                    </span>
                </div>

                <div v-if="isPending" class="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <USkeleton class="aspect-5/3 rounded-sm" />
                </div>

                <div
                    v-else-if="slotsByDow[day.dow]?.length"
                    class="grid grid-cols-2 gap-2 sm:grid-cols-3"
                >
                    <EnrollSubscriptionSlotCard
                        v-for="slotItem in slotsByDow[day.dow]"
                        :key="slotItem.id"
                        :slot-item="slotItem"
                        :is-selected="selectedIds.has(slotItem.id)"
                        @toggle="emit('toggleSlot', $event)"
                    />
                </div>

                <p
                    v-else
                    class="bg-default text-muted flex items-center justify-center gap-1.5 rounded-sm py-3 text-sm font-semibold opacity-60"
                >
                    <UIcon name="ph:coffee-duotone" class="size-5" aria-hidden="true" />
                    Выходной
                </p>
            </section>
        </div>
    </section>
</template>
