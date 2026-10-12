<script lang="ts" setup>
// Сводка «Итого» абонемента: ребёнок (слот), состав с удалением, тариф, сумма в месяц и экономия.
import type { CheckoutError, EnrollSummaryRow, PlanTier, WeeklySlot } from "~/types"

const props = defineProps<{
    slots: WeeklySlot[]
    tier: PlanTier | null
    totalMonthlyLessons: number
    hasChild: boolean
    trialPrice: number
    isSubmitting: boolean
    cooldownSeconds: number
    error: CheckoutError | null
}>()

const emit = defineEmits<{
    remove: [slot: WeeklySlot]
    continue: []
}>()

// Состав по порядку недели (Пн → Вс), внутри дня – по времени.
const sortedSlots = computed(() =>
    [...props.slots].sort(
        (a, b) =>
            ((a.dayOfWeek + 6) % 7) - ((b.dayOfWeek + 6) % 7) ||
            a.startTime.localeCompare(b.startTime)
    )
)

const tierName = computed<string | null>(() => {
    const tier = props.tier
    if (!tier) return null
    if (tier.label) return tier.label
    if (tier.lessons === null) return "Безлимит"
    return `${tier.lessons} ${pluralize(tier.lessons, ["занятие", "занятия", "занятий"])}`
})

const rows = computed<EnrollSummaryRow[]>(() => [
    {
        label: "Занятий в месяц",
        value: props.totalMonthlyLessons ? String(props.totalMonthlyLessons) : null
    },
    { label: "Тариф", value: tierName.value },
    {
        label: "Действует",
        value: props.slots.length ? "месяц с 1-го занятия" : null,
        empty: "—"
    }
])

const perLesson = computed<number | null>(() =>
    props.tier && props.totalMonthlyLessons
        ? Math.round(props.tier.price / props.totalMonthlyLessons)
        : null
)

const savings = computed<number>(() =>
    props.tier ? props.trialPrice * props.totalMonthlyLessons - props.tier.price : 0
)

// ПОЧЕМУ: фолбэк тарифов из app.config без id – заказ по нему бэк не примет
const isTierUnavailable = computed(() => !!props.tier && props.tier.id === null)

// Кружки выбраны, а тарифа под их число нет: больше потолка корзины или пропуск в линейке
const noPlanHint = computed<string | null>(() => {
    const count = props.slots.length
    if (!count || props.tier) return null
    if (count > MAX_SUBSCRIPTION_SLOTS)
        return `В абонементе не больше ${MAX_SUBSCRIPTION_SLOTS} кружков – уберите лишние`
    return `Нет тарифа на ${count} ${pluralize(count, ["кружок", "кружка", "кружков"])} – добавьте или уберите кружок`
})

const missing = computed<string[]>(() => {
    const list: string[] = []
    if (!props.slots.length) list.push("кружки")
    if (!props.hasChild) list.push("ребёнка")
    return list
})
</script>

<template>
    <EnrollSummaryCard>
        <slot />

        <USeparator />

        <section class="flex flex-col gap-2.5" aria-label="Состав">
            <div class="flex items-center justify-between">
                <h3 class="text-default text-base font-semibold">Состав</h3>
                <span
                    v-if="slots.length"
                    class="bg-secondary/10 text-secondary rounded-full px-2 py-0.5 text-sm font-bold"
                >
                    {{ slots.length }}
                </span>
            </div>

            <ul v-if="slots.length" class="flex max-h-56 flex-col gap-1.5 overflow-y-auto pr-0.5">
                <li
                    v-for="slotItem in sortedSlots"
                    :key="slotItem.id"
                    class="bg-default flex items-center gap-3 rounded-sm py-2 pr-2 pl-3"
                >
                    <span
                        class="size-2.5 shrink-0 rounded-full"
                        :class="getActivityTheme(slotItem.activity.id).fullBg"
                        aria-hidden="true"
                    />
                    <div class="flex min-w-0 flex-1 flex-col">
                        <span class="text-default truncate text-sm leading-tight font-bold">
                            {{ slotItem.activity.name }}
                        </span>
                        <span class="text-muted text-xs font-semibold">
                            {{ getDayName("short", (slotItem.dayOfWeek + 6) % 7) }} ·
                            {{ slotItem.startTime }}–{{ slotItem.endTime }}
                        </span>
                    </div>
                    <UButton
                        icon="ph:x-bold"
                        color="error"
                        variant="ghost"
                        size="xs"
                        :aria-label="`Убрать ${slotItem.activity.name} из абонемента`"
                        @click="emit('remove', slotItem)"
                    />
                </li>
            </ul>

            <div v-else class="flex flex-col items-center gap-1 py-4 text-center">
                <UIcon name="ph:basket-bold" class="text-dimmed size-12" aria-hidden="true" />
                <span class="text-muted text-sm italic">Пока ничего не выбрано</span>
            </div>
        </section>

        <USeparator />

        <EnrollSummaryRows :rows="rows" />

        <EnrollPriceBox label="Итого в месяц" :amount="tier ? formatRubles(tier.price) : '—'">
            <template v-if="perLesson" #aside>
                <div class="flex flex-col items-end gap-0.5">
                    <span class="text-muted text-xs font-semibold">за занятие</span>
                    <span class="text-default text-lg font-bold">
                        ≈ {{ formatRubles(perLesson) }}
                    </span>
                </div>
            </template>
        </EnrollPriceBox>

        <p v-if="savings > 0" class="text-muted flex items-start gap-1.5 text-xs font-semibold">
            <UIcon
                name="ph:piggy-bank-bold"
                class="text-secondary mt-px size-4 shrink-0"
                aria-hidden="true"
            />
            <span>
                Экономия к разовым занятиям:
                <span class="text-secondary font-bold">{{ formatRubles(savings) }}/мес</span>
            </span>
        </p>

        <slot name="payment" />

        <EnrollSummaryCta
            :ready="missing.length === 0 && !isTierUnavailable && !noPlanHint"
            :missing="missing"
            :hint="
                noPlanHint ??
                (isTierUnavailable
                    ? 'Тарифы не загрузились – обновите страницу, чтобы оплатить'
                    : null)
            "
            :loading="isSubmitting"
            :cooldown-seconds="cooldownSeconds"
            :error="error"
            @continue="emit('continue')"
        />

        <p class="text-muted flex items-start gap-2 text-xs">
            <UIcon name="ph:lock-simple-bold" class="mt-px size-4 shrink-0" aria-hidden="true" />
            Оплата через ЮKassa. После нажатия места держим за вами 15 минут.
        </p>
    </EnrollSummaryCard>
</template>
