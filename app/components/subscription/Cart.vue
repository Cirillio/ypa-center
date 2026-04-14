<script lang="ts" setup>
import type { WeeklySlot } from "~/types"

const props = defineProps<{
    selectedSlots: WeeklySlot[]
    totalLessons: number
    currentTier: {
        lessons: number | null
        price: number
        label?: string
        highlight?: boolean
    } | null
    nextTier: {
        lessons: number | null
        price: number
        label?: string
        highlight?: boolean
    } | null
    tierProgress: number
    savings: number
    pricePerLesson: number | null
}>()

const emit = defineEmits<{
    remove: [id: number]
}>()

const DAY_SHORT = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"] as const

const tierLabel = computed(() => {
    if (!props.currentTier) return null
    if (props.currentTier.label) return props.currentTier.label
    return `${props.currentTier.lessons} ${pluralize(props.currentTier.lessons!, ["занятие", "занятия", "занятий"])}`
})

const nextTierLabel = computed(() => {
    if (!props.nextTier) return null
    if (props.nextTier.label) return props.nextTier.label
    return `${props.nextTier.lessons} ${pluralize(props.nextTier.lessons!, ["занятие", "занятия", "занятий"])}`
})

const formattedPrice = computed(() =>
    props.currentTier ? new Intl.NumberFormat("ru-RU").format(props.currentTier.price) : null
)

const formattedPricePerLesson = computed(() =>
    props.pricePerLesson ? new Intl.NumberFormat("ru-RU").format(props.pricePerLesson) : null
)

const formattedSavings = computed(() =>
    props.savings > 0 ? new Intl.NumberFormat("ru-RU").format(props.savings) : null
)

// Прогресс-бар: позиция текущего тарифа среди всех
const progressPercent = computed(() => Math.round(props.tierProgress * 100))

// Следующий тариф: +1 кружок
const slotsToNext = computed(() => {
    if (!props.nextTier || props.nextTier.lessons === null) return null
    return Math.ceil((props.nextTier.lessons - props.totalLessons) / 4)
})
</script>

<template>
    <div class="space-y-4 overflow-hidden rounded-sm bg-white px-6 py-4">
        <!-- Шапка -->
        <span class="text-default text-xl font-bold md:text-2xl">Ваш абонемент</span>

        <!-- Итоговый блок -->
        <div v-if="currentTier" class="flex flex-col gap-3">
            <!-- Занятий в месяц -->
            <div class="flex items-baseline justify-between gap-2">
                <span class="text-default/65 text-sm font-semibold">Занятий в месяц</span>
                <span class="text-default text-base font-bold">{{ totalLessons }}</span>
            </div>

            <!-- Прогресс тарифов -->
            <div class="flex flex-col gap-2">
                <div class="bg-default h-2 w-full overflow-hidden rounded-full">
                    <div
                        class="bg-primary h-full rounded-full transition-all duration-500 ease-out"
                        :style="{ width: `${progressPercent}%` }"
                    />
                </div>
                <div class="flex items-center justify-between gap-2">
                    <span class="text-primary text-xs font-bold">{{ tierLabel }}</span>
                    <span v-if="nextTier" class="text-default/45 text-xs font-semibold">
                        {{
                            slotsToNext === 1
                                ? "Ещё 1 кружок → " + nextTierLabel
                                : `${slotsToNext ? "Ещё " + slotsToNext + " кружка" : "Ещё хотя бы один кружок"} → ` +
                                  nextTierLabel
                        }}
                    </span>
                    <span v-else class="text-primary text-xs font-bold"> Максимум скидки! </span>
                </div>

                <!-- Итоговая цена -->
                <div
                    class="bg-primary/5 ring-primary/15 flex flex-wrap items-end justify-between gap-2 rounded-sm px-4 py-3 ring-2"
                >
                    <div class="flex min-w-fit flex-col gap-0.5">
                        <span class="text-default/55 text-xs font-semibold">Итого в месяц</span>
                        <span
                            :key="formattedPrice ?? ''"
                            class="text-primary text-2xl leading-none font-extrabold md:text-3xl"
                        >
                            {{ formattedPrice }} ₽
                        </span>
                    </div>
                    <div
                        v-if="formattedPricePerLesson"
                        :key="formattedPricePerLesson"
                        class="flex flex-col items-end gap-0.5"
                    >
                        <span class="text-default/45 text-xs font-semibold">за занятие</span>
                        <span class="text-default/70 text-base font-bold md:text-lg">
                            ~{{ formattedPricePerLesson }} ₽
                        </span>
                    </div>
                </div>
            </div>

            <!-- Экономия -->
            <div v-if="formattedSavings" :key="formattedSavings" class="flex items-center gap-1.5">
                <UIcon name="ph:piggy-bank-duotone" class="text-secondary/80 size-4 shrink-0" />
                <span class="text-default/70 text-xs font-semibold">
                    Экономия vs разовые:
                    <span class="text-secondary font-bold">{{ formattedSavings }} ₽/мес</span>
                </span>
            </div>
        </div>

        <!-- Список выбранных слотов -->
        <div class="">
            <template v-if="selectedSlots.length">
                <span class="text-default/90 text-xl font-bold">Выбранные кружки:</span>
                <div class="mt-4 flex flex-col gap-1.5">
                    <div
                        v-for="slot in selectedSlots"
                        :key="slot.id"
                        class="bg-default group flex items-center gap-4 rounded-sm px-5 py-2"
                    >
                        <div
                            class="size-2.5 shrink-0 rounded-full"
                            :class="getActivityTheme(slot.activity.id).fullBg"
                        />
                        <div class="flex min-w-0 flex-1 flex-col">
                            <span
                                class="text-default group-hover:text-primary line-clamp-1 text-base font-bold transition"
                            >
                                {{ slot.activity.name }}
                            </span>
                            <span class="text-default/75 text-sm font-semibold">
                                {{ DAY_SHORT[slot.dayOfWeek] }} · {{ slot.startTime }}–{{
                                    slot.endTime
                                }}
                            </span>
                        </div>
                        <button
                            type="button"
                            :aria-label="'Убрать ' + slot.activity.name + ' из абонемента'"
                            class="text-default/25 hover:text-error ml-1 flex shrink-0 cursor-pointer rounded-xs transition-colors duration-150"
                            @click="emit('remove', slot.id)"
                        >
                            <UIcon name="ph:x-bold" class="size-5" />
                        </button>
                    </div>
                </div>
                <span
                    class="text-default/90 mt-4 grid grid-cols-[auto_1fr_auto] items-baseline gap-2 px-2 text-xl font-semibold"
                    ><span>Итого кружков:</span>
                    <div class="border-b-2 border-dotted opacity-50"></div>
                    <span class="text-primary font-bold"> {{ selectedSlots.length }}</span>
                </span>
            </template>
            <!-- Пустое состояние -->
            <div
                v-else
                key="empty"
                class="flex flex-col items-center justify-center gap-1.5 py-8 text-center"
            >
                <UIcon name="ph:basket-duotone" class="text-default/20 size-12" />
                <span class="text-default/40 text-sm font-semibold">Ещё ничего не добавлено</span>
                <span class="text-default/30 text-xs">Выбирайте кружки по дням выше</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.cart-item-enter-active {
    transition:
        opacity 0.22s ease,
        transform 0.22s ease,
        max-height 0.25s ease;
    max-height: 60px;
    overflow: hidden;
}
.cart-item-leave-active {
    transition:
        opacity 0.15s ease,
        max-height 0.18s ease;
    max-height: 60px;
    overflow: hidden;
}
.cart-item-enter-from {
    opacity: 0;
    transform: translateX(-10px);
    max-height: 0;
}
.cart-item-leave-to {
    opacity: 0;
    max-height: 0;
}
.cart-item-move {
    transition: transform 0.2s ease;
}

.badge-enter-active,
.badge-leave-active {
    transition:
        opacity 0.2s ease,
        transform 0.2s ease;
}
.badge-enter-from,
.badge-leave-to {
    opacity: 0;
    transform: scale(0.5);
}

.slide-down-enter-active {
    transition:
        opacity 0.3s ease,
        max-height 0.35s ease;
    max-height: 400px;
    overflow: hidden;
}
.slide-down-leave-active {
    transition:
        opacity 0.2s ease,
        max-height 0.25s ease;
    overflow: hidden;
}
.slide-down-enter-from {
    opacity: 0;
    max-height: 0;
}
.slide-down-leave-to {
    opacity: 0;
    max-height: 0;
}

.clip-reveal-enter-active {
    transition:
        clip-path 0.35s ease-out,
        opacity 0.25s ease-out;
}
.clip-reveal-enter-from {
    clip-path: inset(0 100% 0 0 round 4px);
    opacity: 0;
}
.clip-reveal-enter-to {
    clip-path: inset(0 0% 0 0 round 4px);
    opacity: 1;
}
.clip-reveal-leave-active {
    transition: opacity 0.1s ease-in;
}
.clip-reveal-leave-from {
    opacity: 1;
}
.clip-reveal-leave-to {
    opacity: 0;
}
</style>
