<script lang="ts" setup>
// Список «ключ – значение» сводки; пустое значение показывается приглушённой заглушкой.
import type { EnrollSummaryRow } from "~/types"

defineProps<{
    rows: EnrollSummaryRow[]
}>()
</script>

<template>
    <dl class="flex flex-col gap-2">
        <div
            v-for="row in rows"
            :key="row.label"
            class="flex items-baseline justify-between gap-3 px-1"
        >
            <dt class="text-muted shrink-0 text-sm font-medium">{{ row.label }}</dt>
            <dd
                class="min-w-0 text-end text-sm"
                :class="row.value ? 'text-default font-semibold' : 'text-muted italic'"
            >
                {{ row.value || (row.empty ?? "не выбрано") }}
            </dd>
        </div>
    </dl>
</template>
