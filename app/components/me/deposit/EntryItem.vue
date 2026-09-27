<script lang="ts" setup>
// Строка истории депозита: причина, дата, абонемент и сумма со знаком.
import type { MeDepositEntry } from "~/types"

const props = defineProps<{
    entry: MeDepositEntry
}>()

const isIncome = computed(() => props.entry.amount > 0)
const amountText = computed(
    () => `${isIncome.value ? "+" : "−"}${formatRubles(Math.abs(props.entry.amount))}`
)
const meta = computed(() =>
    [props.entry.createdAt, props.entry.subscriptionDisplayId].filter(Boolean).join(" · ")
)
</script>

<template>
    <li class="flex items-start justify-between gap-3 py-2">
        <div class="min-w-0">
            <p class="text-default text-sm leading-tight font-semibold">
                {{ entry.reasonLabel }}
            </p>
            <p class="text-muted mt-0.5 text-xs leading-tight">{{ meta }}</p>
        </div>
        <span
            class="shrink-0 text-sm font-bold tabular-nums"
            :class="isIncome ? 'text-success' : 'text-default'"
        >
            {{ amountText }}
        </span>
    </li>
</template>
