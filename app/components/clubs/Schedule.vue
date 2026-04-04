<script lang="ts" setup>
import { useMediaQuery, useScroll } from "@vueuse/core"
import type { Club } from "~/types"

const props = defineProps<{
    clubs: Club[]
}>()

// ─── Адаптивность ─────────────────────────────────────────────────────────────

const isMobile = useMediaQuery("(max-width: 1023px)")

// ─── Дни недели текущей недели ────────────────────────────────────────────────

const DAY_SHORT = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"] as const

interface WeekDay {
    date: number
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
            date: d.getDate(),
            dayShort: DAY_SHORT[d.getDay()]!,
            isToday: d.toDateString() === today.toDateString()
        }
    })
}

const weekDays = buildWeekDays()

// ─── Мобиль: выбранный день ───────────────────────────────────────────────────

const todayShort = DAY_SHORT[new Date().getDay()]!
const defaultDay = weekDays.find((d) => d.dayShort === todayShort) ?? weekDays[0]!
const selectedDay = ref<WeekDay>(defaultDay)

const filteredClubs = computed(() =>
    props.clubs
        .filter((c) => c.schedule.days.includes(selectedDay.value.dayShort))
        .slice()
        .sort((a, b) => a.schedule.timeStart.localeCompare(b.schedule.timeStart))
)

// ─── Горизонтальный скролл + fade-индикаторы ─────────────────────────────────

const daysRef = ref<HTMLElement | null>(null)
const { arrivedState } = useScroll(daysRef)

// ─── Десктоп: клубы по каждому дню ───────────────────────────────────────────

function clubsForDay(dayShort: string): Club[] {
    return props.clubs
        .filter((c) => c.schedule.days.includes(dayShort))
        .slice()
        .sort((a, b) => a.schedule.timeStart.localeCompare(b.schedule.timeStart))
}

const activeDays = computed(() => weekDays.filter((d) => clubsForDay(d.dayShort).length > 0))

const desktopGridCols: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    7: "grid-cols-7"
}

const desktopGridClass = computed(() => desktopGridCols[activeDays.value.length] ?? "grid-cols-7")
</script>

<template>
    <section
        id="schedule"
        class="bg-default relative z-10 flex w-full overflow-hidden py-12 md:py-20 lg:py-24"
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
            <template v-if="isMobile">
                <!-- Дни недели-->
                <div class="relative">
                    <Transition name="fade">
                        <div
                            v-if="!arrivedState.left"
                            class="from-default pointer-events-none absolute top-0 left-0 z-10 h-full w-10 bg-linear-to-r to-transparent"
                        />
                    </Transition>
                    <div ref="daysRef" class="scrollbar-none flex gap-2 overflow-x-auto p-2">
                        <button
                            v-for="day in weekDays"
                            :key="day.dayShort"
                            type="button"
                            class="flex aspect-square min-w-0 flex-1 cursor-pointer flex-col items-center gap-0.5 rounded-sm p-3 ring-2 transition-all duration-150"
                            :class="
                                selectedDay.dayShort === day.dayShort
                                    ? 'bg-primary ring-primary text-white'
                                    : day.isToday
                                      ? 'ring-primary/40 text-default bg-white'
                                      : 'text-default hover:ring-primary/30 bg-white ring-transparent'
                            "
                            @click="selectedDay = day"
                        >
                            <span class="text-lg leading-none font-black md:text-xl">{{
                                day.date
                            }}</span>
                            <span
                                class="text-xs font-bold uppercase"
                                :class="
                                    selectedDay.dayShort === day.dayShort
                                        ? 'text-white/70'
                                        : 'text-default/45'
                                "
                                >{{ day.dayShort }}</span
                            >
                        </button>
                    </div>
                    <Transition name="fade">
                        <div
                            v-if="!arrivedState.right"
                            class="from-default pointer-events-none absolute top-0 right-0 z-10 h-full w-10 bg-linear-to-l to-transparent"
                        />
                    </Transition>
                </div>

                <!-- Список кружков выбранного дня -->
                <div
                    v-if="filteredClubs.length"
                    :key="selectedDay.dayShort"
                    class="flex flex-col gap-2"
                >
                    <ClubsScheduleCard
                        v-for="club in filteredClubs"
                        :key="club.id"
                        :club="club"
                        variant="row"
                    />
                </div>
                <div
                    v-else
                    :key="`empty-${selectedDay.dayShort}`"
                    class="flex flex-col items-center gap-2 py-4"
                >
                    <UIcon name="ph:coffee-duotone" class="text-default/25 size-10" />
                    <span class="text-default/45 font-semibold">В этот день занятий нет</span>
                </div>
            </template>

            <!-- Desktop -->
            <div v-else class="grid gap-2" :class="desktopGridClass">
                <div v-for="day in activeDays" :key="day.dayShort" class="flex flex-col gap-2">
                    <!-- Заголовок колонки -->
                    <div
                        class="flex flex-col items-center rounded-sm py-2.5 ring-2"
                        :class="
                            day.isToday ? 'bg-primary ring-primary' : 'bg-white ring-transparent'
                        "
                    >
                        <span
                            class="text-xl leading-none font-black"
                            :class="day.isToday ? 'text-white' : 'text-secondary'"
                            >{{ day.date }}</span
                        >
                        <span
                            class="text-xs font-bold uppercase"
                            :class="day.isToday ? 'text-white/70' : 'text-default/40'"
                            >{{ day.dayShort }}</span
                        >
                    </div>

                    <!-- Карточки кружков -->
                    <ClubsScheduleCard
                        v-for="club in clubsForDay(day.dayShort)"
                        :key="club.id"
                        :club="club"
                        variant="square"
                    />
                </div>
            </div>
        </UContainer>
    </section>
</template>

<style scoped>
.scrollbar-none {
    scrollbar-width: none;
}
.scrollbar-none::-webkit-scrollbar {
    display: none;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
.schedule-list-enter-active {
    transition:
        opacity 0.2s ease,
        transform 0.2s ease;
}
.schedule-list-leave-active {
    transition:
        opacity 0.15s ease,
        transform 0.15s ease;
}
.schedule-list-enter-from {
    opacity: 0;
    transform: translateY(6px);
}
.schedule-list-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}
</style>
