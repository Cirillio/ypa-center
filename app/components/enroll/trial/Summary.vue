<script lang="ts" setup>
// Сводка «Итого» пробного занятия: ребёнок (слот), выбранное, цена, кнопка и переход к абонементу.
import { EnrollRoutesEnum } from "~/constants/nav"
import type { Activity, EnrollSummaryRow, TrialCheckoutSlot } from "~/types"

const props = defineProps<{
    club?: Activity
    slotItem?: TrialCheckoutSlot
    hasChild: boolean
    price: number
    subscriptionFromPrice: number | null
}>()

const emit = defineEmits<{
    continue: []
}>()

const rows = computed<EnrollSummaryRow[]>(() => [
    { label: "Кружок", value: props.club?.name ?? null },
    { label: "Дата", value: props.slotItem?.displayDate ?? null },
    { label: "Время", value: props.slotItem?.displayTime ?? null },
    { label: "Группа", value: props.slotItem?.groupName ?? null, empty: "—" }
])

const missing = computed<string[]>(() => {
    const list: string[] = []
    if (!props.club) list.push("кружок")
    else if (!props.slotItem) list.push("время")
    if (!props.hasChild) list.push("ребёнка")
    return list
})
</script>

<template>
    <EnrollSummaryCard>
        <slot />

        <USeparator />

        <EnrollSummaryRows :rows="rows" />

        <EnrollPriceBox label="К оплате" :amount="formatRubles(price)">
            <template #aside>
                <span class="text-muted pb-0.5 text-xs font-semibold">разовое посещение</span>
            </template>
        </EnrollPriceBox>

        <EnrollSummaryCta
            :ready="missing.length === 0"
            :missing="missing"
            @continue="emit('continue')"
        />

        <p class="text-muted flex items-start gap-2 text-xs">
            <UIcon name="ph:lock-simple-bold" class="mt-px size-4 shrink-0" aria-hidden="true" />
            Оплата через ЮKassa. После нажатия места держим за вами 30 минут.
        </p>

        <NuxtLink
            v-if="subscriptionFromPrice"
            :to="EnrollRoutesEnum.Subscription"
            class="text-secondary hover:bg-secondary/10 -mx-2 flex items-center gap-1.5 rounded-sm px-2 py-1.5 text-sm font-semibold transition-colors"
        >
            <UIcon name="ph:puzzle-piece-bold" class="size-4 shrink-0" aria-hidden="true" />
            С абонементом выгоднее — от {{ formatRubles(subscriptionFromPrice) }} за занятие
            <UIcon name="ph:arrow-right-bold" class="ml-auto size-4 shrink-0" aria-hidden="true" />
        </NuxtLink>
    </EnrollSummaryCard>
</template>
