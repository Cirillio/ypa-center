<script lang="ts" setup>
import type { WeeklySlot } from "~/types"

const props = defineProps<{
    slots: WeeklySlot[]
    selectedIds: Set<number>
}>()

const emit = defineEmits<{
    toggle: [id: number]
}>()

const { weekDays, selectedDay } = useSchedule()

const slotsForDay = computed(() =>
    props.slots
        .filter((s) => s.dayOfWeek === selectedDay.value.dow)
        .slice()
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
)

function isSelected(id: number) {
    return props.selectedIds.has(id)
}
</script>

<template>
    <div class="flex flex-col gap-3">
        <h3 class="text-default text-2xl font-bold">1. Выберите кружки по дням</h3>

        <!-- Навигация дней -->
        <AppScrollFade direction="x" fade-color="var(--ui-bg)">
            <div class="flex gap-2 py-2">
                <button
                    v-for="day in weekDays"
                    :key="day.dayShort"
                    type="button"
                    :aria-label="'Показать расписание на ' + day.dayShort"
                    :aria-pressed="selectedDay.dow === day.dow"
                    class="relative flex min-w-0 flex-1 cursor-pointer flex-col items-center gap-0.5 rounded-full px-3 py-2.5 transition-all duration-150 select-none"
                    :class="
                        selectedDay.dow === day.dow
                            ? 'bg-primary text-white'
                            : day.isToday
                              ? 'bg-secondary/15 text-secondary active:bg-secondary/25'
                              : 'text-default/95 active:bg-primary/15 active:text-primary bg-white'
                    "
                    :title="
                        selectedDay.dow === day.dow
                            ? 'Выбран: ' + getFullDayName(day.dayShort)
                            : day.isToday
                              ? 'Сегодня: ' + getFullDayName(day.dayShort)
                              : getFullDayName(day.dayShort)
                    "
                    @click="selectedDay = day"
                >
                    <span class="text-lg font-bold uppercase">{{ day.dayShort }}</span>
                </button>
            </div>
        </AppScrollFade>

        <!-- Карточки слотов: flex-wrap, квадратные, ~3 в ряд -->
        <div v-if="slotsForDay.length" :key="selectedDay.dow" class="flex flex-wrap gap-2">
            <button
                v-for="slot in slotsForDay"
                :key="slot.id"
                type="button"
                :title="'Добавить в абонемент: ' + slot.activity.name"
                :disabled="slot.available === 0"
                :aria-pressed="isSelected(slot.id)"
                class="group flex aspect-5/3 w-[calc((100%-8px)/2)] flex-col items-start rounded-sm p-2 transition-all duration-200 sm:w-[calc((100%-16px)/3)] md:px-4 md:py-2.75"
                :class="[
                    getActivityTheme(slot.activity.id).bg,
                    getActivityTheme(slot.activity.id).ring,
                    slot.available === 0
                        ? 'cursor-not-allowed opacity-50'
                        : isSelected(slot.id)
                          ? 'cursor-pointer ring-2'
                          : 'active:contrast:95 cursor-pointer ring-0 hover:contrast-95'
                ]"
                @click="slot.available > 0 && emit('toggle', slot.id)"
            >
                <!-- Название + группа (верх) -->
                <div class="flex flex-col text-start">
                    <span
                        :title="slot.activity.name"
                        class="line-clamp-2 flex-1 text-base leading-tight font-extrabold md:text-xl"
                        :class="getActivityTheme(slot.activity.id).title"
                    >
                        {{ slot.activity.name }}
                    </span>
                    <span
                        :title="'Группа: ' + slot.groupName"
                        class="text-default/95 line-clamp-1 text-xs font-semibold lg:text-sm"
                    >
                        {{ slot.groupName }}
                    </span>
                </div>

                <!-- Время + места + чекбокс (низ) -->
                <div class="mt-auto flex w-full flex-col gap-0.5">
                    <span
                        :title="`${slot.startTime}–${slot.endTime}`"
                        class="text-default/85 group-hover:text-default shrink-0 self-start font-bold transition lg:text-base xl:text-lg"
                    >
                        {{ slot.startTime }}–{{ slot.endTime }}
                    </span>
                    <div class="flex items-center justify-between gap-0.5">
                        <div
                            :title="
                                slot.available ? 'Доступных мест: ' + slot.available : 'Мест нет'
                            "
                            class="flex w-fit items-center gap-1 rounded-md bg-white px-1.5 py-0.5 text-xs font-bold lg:px-2.5 lg:py-1 lg:text-sm"
                            :class="
                                slot.available === 0
                                    ? 'text-default/40'
                                    : getCapacityTextColor(slot.available)
                            "
                        >
                            <UIcon
                                name="ph:users-bold"
                                class="mb-0.5 size-4 shrink-0 md:size-4.5"
                            />
                            Мест: {{ slot.available }}
                        </div>

                        <!-- Чекбокс -->
                        <div
                            :class="[
                                getActivityTheme(slot.activity.id).ring,
                                getActivityTheme(slot.activity.id).title
                            ]"
                            :title="isSelected(slot.id) ? 'Добавлено' : 'Добавить'"
                            class="flex size-5 items-center justify-center rounded-xs bg-white p-0.5 ring-2 md:size-6"
                        >
                            <Transition name="check">
                                <UIcon
                                    v-if="isSelected(slot.id)"
                                    name="ph:check-bold"
                                    class="size-4 shrink-0 md:size-5"
                                />
                            </Transition>
                        </div>
                    </div>
                </div>
            </button>
        </div>

        <!-- Выходной -->
        <div
            v-else
            :key="`empty-${selectedDay.dow}`"
            class="flex aspect-5/3 flex-col items-center justify-center gap-1.5 rounded-md bg-white"
        >
            <UIcon name="ph:coffee-duotone" class="text-default size-10 opacity-35" />
            <span class="text-default font-semibold opacity-35">Выходной</span>
        </div>
    </div>
</template>

<style scoped>
.check-enter-active {
    transition:
        opacity 0.12s ease,
        transform 0.12s ease;
}
.check-enter-from {
    opacity: 0;
    transform: scale(0.4);
}
.check-enter-to {
    opacity: 1;
    transform: scale(1);
}
</style>
