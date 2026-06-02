<script lang="ts" setup>
import type { UpcomingActivityItem } from "~/types/status"

const props = defineProps<{
    item: UpcomingActivityItem
}>()

// Источник активности: абонемент vs разовое (пробное/мероприятие).
const chip = computed(() =>
    props.item.type === "subscription"
        ? { label: "Абонемент", class: "bg-rose-500/10 text-rose-500" }
        : { label: "Разовое", class: "bg-cyan-500/10 text-cyan-500" }
)
</script>

<template>
    <div
        class="bg-default/3 hover:bg-default/5 flex items-center gap-3 rounded-lg p-3 transition-colors"
    >
        <span
            class="shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase"
            :class="chip.class"
        >
            {{ chip.label }}
        </span>

        <div class="min-w-0 flex-1">
            <div class="text-default truncate text-base leading-tight font-bold">
                {{ item.title }}
            </div>
            <div class="text-default/70 truncate text-sm leading-tight">
                {{ item.subtitle }} · {{ item.participant }}
            </div>
            <div v-if="item.metaLabel" class="text-default/40 text-[10px] font-bold uppercase">
                {{ item.metaLabel }}
            </div>
        </div>

        <span class="text-primary shrink-0 text-sm font-bold">{{ item.displayTime }}</span>
    </div>
</template>
