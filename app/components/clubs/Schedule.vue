<script lang="ts" setup>
// Секция расписания каталога кружков с переключением недели и отображением слотов по дням.
const scheduleService = useScheduleService()
const {
    weekDays,
    selectedDay,
    weekStart,
    weekRangeLabel,
    canPrevWeek,
    canNextWeek,
    prevWeek,
    nextWeek
} = useSchedule()

const {
    data: slotsData,
    error: slotsError,
    status: slotsStatus,
    refresh
} = useAsyncData(
    () => `schedule:week:${weekStart.value}`,
    () => scheduleService.getWeek(weekStart.value),
    { watch: [weekStart] }
)

const slots = computed(() => slotsData.value ?? [])
const isPending = computed(() => slotsStatus.value === "pending")

// ПОЧЕМУ: группируем слоты по дню недели один раз в computed,
// исключая повторный filter+sort при рендере мобильного вида и десктопных колонок.
const slotsByDay = computed(() => {
    const map = new Map<number, (typeof slots.value)[number][]>()
    for (const slot of slots.value) {
        const list = map.get(slot.dayOfWeek)
        if (list) list.push(slot)
        else map.set(slot.dayOfWeek, [slot])
    }
    for (const list of map.values()) {
        list.sort((a, b) => a.startTime.localeCompare(b.startTime))
    }
    return map
})

// Возвращает отсортированные по времени слоты для заданного дня недели (0-6).
function slotsForDay(dow: number) {
    return slotsByDay.value.get(dow) ?? []
}
</script>

<template>
    <section
        id="schedule"
        class="relative z-10 flex w-full scroll-mt-(--ui-header-height) overflow-hidden bg-white py-12 md:py-20 lg:py-24"
    >
        <UContainer class="flex w-full flex-col gap-6">
            <!-- Заголовок и переключатель недели -->
            <div class="flex flex-wrap items-center justify-between gap-4">
                <span class="flex w-fit items-center font-semibold">
                    <UIcon
                        name="ph:dot-duotone"
                        class="text-primary mr-1 mb-0.5 size-5 animate-pulse"
                    />
                    <span class="text-default">Расписание на неделю</span>
                </span>

                <ClubsScheduleWeekSwitcher
                    :label="weekRangeLabel"
                    :can-prev="canPrevWeek"
                    :can-next="canNextWeek"
                    @prev="prevWeek"
                    @next="nextWeek"
                />
            </div>

            <!-- Ошибка загрузки -->
            <UiErrorState
                v-if="slotsError && !isPending"
                class="bg-default rounded-sm"
                message="Не удалось загрузить расписание на выбранную неделю."
                @retry="void refresh()"
            />

            <!-- Mobile -->
            <div v-if="!slotsError || isPending" class="lg:hidden">
                <!-- Дни недели -->
                <UiScrollFade direction="x">
                    <div class="flex gap-2 py-2">
                        <button
                            v-for="day in weekDays"
                            :key="day.dayShort"
                            type="button"
                            :aria-label="'Показать расписание на ' + day.dayShort"
                            :aria-pressed="selectedDay.dow === day.dow"
                            class="flex min-w-0 flex-1 cursor-pointer flex-col items-center gap-0.5 rounded-full px-3 py-2.5 transition-all duration-150"
                            :class="
                                selectedDay.dow === day.dow
                                    ? 'bg-primary text-white'
                                    : day.isToday
                                      ? 'text-secondary bg-secondary/15'
                                      : 'text-default/95 active:bg-primary/15 active:text-primary bg-default'
                            "
                            @click="void (selectedDay = day)"
                        >
                            <span class="text-lg font-bold uppercase select-none">{{
                                day.dayShort
                            }}</span>
                        </button>
                    </div>
                </UiScrollFade>

                <!-- Индикатор загрузки при переключении -->
                <div
                    v-if="isPending"
                    class="grid grid-cols-2 gap-2 sm:grid-cols-3"
                    aria-busy="true"
                >
                    <USkeleton
                        v-for="n in 4"
                        :key="`skeleton-${n}`"
                        class="aspect-5/3 rounded-sm"
                    />
                </div>

                <!-- Слоты выбранного дня -->
                <div
                    v-else-if="slotsForDay(selectedDay.dow).length"
                    :key="selectedDay.dow"
                    class="mt-2 flex flex-col gap-2"
                >
                    <ClubsScheduleCard
                        v-for="slot in slotsForDay(selectedDay.dow)"
                        :key="slot.id"
                        :weekly-slot="slot"
                    />
                </div>
                <div
                    v-else
                    :key="`empty-${selectedDay.dow}`"
                    :class="selectedDay.dow === 0 ? 'ring-primary' : 'ring-transparent'"
                    class="bg-default flex aspect-5/3 flex-col items-center justify-center gap-1.5 rounded-md opacity-35 ring-2 transition active:opacity-100"
                >
                    <UIcon name="ph:coffee-duotone" class="text-default size-10" />
                    <span class="text-default font-semibold">Выходной</span>
                </div>
            </div>

            <!-- Desktop: всегда 7 колонок -->
            <div v-if="!slotsError || isPending" class="hidden grid-cols-7 lg:grid lg:gap-2">
                <div v-for="day in weekDays" :key="day.dayShort" class="flex flex-col gap-2">
                    <!-- Заголовок колонки -->
                    <div
                        class="flex flex-col items-center rounded-md py-2.5 ring-2"
                        :class="
                            day.isToday
                                ? 'bg-primary ring-primary text-white'
                                : 'bg-default text-default/95 ring-transparent'
                        "
                    >
                        <span class="text-lg font-bold uppercase">{{ day.dayShort }}</span>
                    </div>

                    <!-- Загрузка недели: вместо «Выходной» – скелетон, иначе пустые дни врут -->
                    <USkeleton v-if="isPending" class="aspect-square rounded-md" />

                    <!-- Карточки слотов -->
                    <template v-else-if="slotsForDay(day.dow).length">
                        <ClubsScheduleCard
                            v-for="slot in slotsForDay(day.dow)"
                            :key="slot.id"
                            :weekly-slot="slot"
                        />
                    </template>

                    <!-- Выходной -->
                    <div
                        v-else
                        :class="
                            day.dow === 0 || 'text-default opacity-35 transition hover:opacity-100'
                        "
                        class="bg-default flex aspect-square flex-col items-center justify-center gap-1.5 rounded-md"
                    >
                        <UIcon name="ph:coffee-duotone" class="size-8" />
                        <span class="text-base font-semibold">Выходной</span>
                    </div>
                </div>
            </div>

            <span class="text-default/95 text-xs font-semibold md:text-sm"
                >• Расписание актуально на выбранную неделю. За любыми изменениям можно следить в
                наших соц. сетях.</span
            >
        </UContainer>
    </section>
</template>
