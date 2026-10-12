<script lang="ts" setup>
// Горизонтальные вкладки дней недели с индикатором количества выбранных кружков.
import type { ScheduleWeekDay } from "~/types"

const props = defineProps<{
    days: ScheduleWeekDay[]
    selectedDow: number
    countsByDow: Record<number, number>
}>()

const emit = defineEmits<{
    select: [day: ScheduleWeekDay]
}>()

const tablistRef = ref<HTMLElement | null>(null)

// Возвращает количество выбранных слотов для указанного дня недели.
function getCount(dow: number): number {
    return props.countsByDow[dow] ?? 0
}

// Обрабатывает клавиатурную навигацию стрелками, Home и End по вкладкам дней.
function handleKeydown(event: KeyboardEvent) {
    const list = props.days
    if (list.length === 0) return

    const currentIndex = list.findIndex((day) => day.dow === props.selectedDow)
    let nextIndex = -1

    if (event.key === "ArrowRight") {
        nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % list.length
    } else if (event.key === "ArrowLeft") {
        nextIndex = currentIndex === -1 ? 0 : (currentIndex - 1 + list.length) % list.length
    } else if (event.key === "Home") {
        nextIndex = 0
    } else if (event.key === "End") {
        nextIndex = list.length - 1
    } else {
        return
    }

    const target = list[nextIndex]
    if (!target) return

    event.preventDefault()
    emit("select", target)
    nextTick(() => {
        const btn = tablistRef.value?.querySelector<HTMLButtonElement>(`[data-dow="${target.dow}"]`)
        btn?.focus()
    })
}
</script>

<template>
    <div
        ref="tablistRef"
        role="tablist"
        aria-label="День недели"
        class="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-1"
        @keydown="handleKeydown"
    >
        <button
            v-for="day in days"
            :id="`subscription-day-tab-${day.dow}`"
            :key="day.dayShort"
            type="button"
            role="tab"
            :data-dow="day.dow"
            :aria-selected="day.dow === selectedDow"
            aria-controls="subscription-day-panel"
            :tabindex="day.dow === selectedDow ? 0 : -1"
            :title="
                day.dow === selectedDow
                    ? 'Выбран: ' + getFullDayName(day.dayShort)
                    : day.isToday
                      ? 'Сегодня: ' + getFullDayName(day.dayShort)
                      : getFullDayName(day.dayShort)
            "
            class="relative flex min-w-16 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full px-3 py-2.5 text-lg font-bold uppercase transition-colors select-none"
            :class="
                day.dow === selectedDow
                    ? 'bg-primary text-white'
                    : 'bg-default text-default hover:bg-primary/10 hover:text-primary'
            "
            @click="emit('select', day)"
        >
            <span>{{ day.dayShort }}</span>
            <span
                v-if="getCount(day.dow) > 0"
                class="flex size-5 items-center justify-center rounded-full text-xs font-bold"
                :class="
                    day.dow === selectedDow ? 'text-primary bg-white' : 'bg-secondary text-white'
                "
            >
                {{ getCount(day.dow) }}
            </span>
        </button>
    </div>
</template>
