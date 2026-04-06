<script lang="ts" setup>
import type { WeeklySlot } from "~/types"

const props = defineProps<{
    slots: WeeklySlot[]
}>()

// ─── Дни недели текущей недели ────────────────────────────────────────────────

const DAY_SHORT = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"] as const

interface WeekDay {
    dow: number
    dayShort: string
    isToday: boolean
}

function buildWeekDays(): WeekDay[] {
    const today = new Date()
    const dow = today.getDay()
    const monday = new Date(today)
    monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1))
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday)
        d.setDate(monday.getDate() + i)
        return {
            dow: d.getDay(),
            dayShort: DAY_SHORT[d.getDay()]!,
            isToday: d.toDateString() === today.toDateString()
        }
    })
}

const weekDays = buildWeekDays()

// ─── Мобиль: выбранный день ───────────────────────────────────────────────────

const todayDow = new Date().getDay()
const defaultDay = weekDays.find((d) => d.dow === todayDow) ?? weekDays[0]!
const selectedDay = ref<WeekDay>(defaultDay)

const filteredSlots = computed(() =>
    props.slots
        .filter((s) => s.dayOfWeek === selectedDay.value.dow)
        .slice()
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
)

// ─── Десктоп: слоты по дню ───────────────────────────────────────────────────

function slotsForDay(dow: number): WeeklySlot[] {
    return props.slots
        .filter((s) => s.dayOfWeek === dow)
        .slice()
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
}
</script>

<template>
    <section
        id="schedule"
        class="relative z-10 flex w-full overflow-hidden bg-white py-12 md:py-20 lg:py-24"
    >
        <UContainer class="flex w-full flex-col gap-4">
            <!-- Заголовок -->
            <span class="flex w-fit items-center font-semibold">
                <UIcon
                    name="ph:dot-duotone"
                    class="text-primary mr-1 mb-0.5 size-5 animate-pulse"
                />
                <span class="text-default">Расписание на неделю</span>
            </span>

            <!-- Mobile -->
            <div class="lg:hidden">
                <!-- Дни недели -->
                <AppScrollFade direction="x">
                    <div class="flex gap-2 py-2">
                        <button
                            v-for="day in weekDays"
                            :key="day.dayShort"
                            type="button"
                            class="flex min-w-0 flex-1 cursor-pointer flex-col items-center gap-0.5 rounded-full border-2 px-3 py-2.5 transition-all duration-150"
                            :class="
                                selectedDay.dow === day.dow
                                    ? 'bg-primary border-primary text-white'
                                    : day.isToday
                                      ? 'border-primary/40 text-default bg-default'
                                      : 'text-default/75 active:border-primary/30 active:bg-primary/30 bg-default border-transparent'
                            "
                            @click="selectedDay = day"
                        >
                            <span class="text-lg font-bold uppercase select-none">{{
                                day.dayShort
                            }}</span>
                        </button>
                    </div>
                </AppScrollFade>

                <!-- Слоты выбранного дня -->
                <div
                    v-if="filteredSlots.length"
                    :key="selectedDay.dow"
                    class="mt-2 flex flex-col gap-2"
                >
                    <ClubsScheduleCard
                        v-for="slot in filteredSlots"
                        :key="slot.id"
                        :weekly-slot="slot"
                    />
                </div>
                <div
                    v-else
                    :key="`empty-${selectedDay.dow}`"
                    class="bg-default flex aspect-5/3 flex-col items-center justify-center gap-1.5 rounded-md opacity-35 transition active:opacity-100"
                >
                    <UIcon name="ph:coffee-duotone" class="text-default size-10" />
                    <span class="text-default font-semibold">Выходной</span>
                </div>
            </div>

            <!-- Desktop: всегда 7 колонок -->
            <div class="hidden grid-cols-7 lg:grid lg:gap-2">
                <div v-for="day in weekDays" :key="day.dayShort" class="flex flex-col gap-2">
                    <!-- Заголовок колонки -->
                    <div
                        class="flex flex-col items-center rounded-md py-2.5 ring-2"
                        :class="
                            day.isToday
                                ? 'bg-primary ring-primary text-white'
                                : 'bg-default text-default/75 ring-transparent'
                        "
                    >
                        <span class="text-lg font-bold uppercase">{{ day.dayShort }}</span>
                    </div>

                    <!-- Карточки слотов -->
                    <template v-if="slotsForDay(day.dow).length">
                        <ClubsScheduleCard
                            v-for="slot in slotsForDay(day.dow)"
                            :key="slot.id"
                            :weekly-slot="slot"
                        />
                    </template>

                    <!-- Выходной -->
                    <div
                        v-else
                        class="bg-default flex aspect-square flex-col items-center justify-center gap-1.5 rounded-md opacity-35 transition hover:opacity-100"
                    >
                        <UIcon name="ph:coffee-duotone" class="text-default size-8" />
                        <span class="text-default text-base font-semibold">Выходной</span>
                    </div>
                </div>
            </div>

            <span class="text-default/50 text-xs font-semibold md:text-sm"
                >• Расписание актуально каждую неделю. За любыми изменениям можно следить в наших
                соц. сетях.</span
            >
        </UContainer>
    </section>
</template>
