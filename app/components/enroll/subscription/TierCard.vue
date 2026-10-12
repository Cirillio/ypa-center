<script lang="ts" setup>
// Карточка тарифного плана абонемента с ценой за месяц и стоимостью одного занятия.
import type { PlanTier } from "~/types"

const props = defineProps<{
    tier: PlanTier
    isActive: boolean
    unlimitedHint?: string | null
}>()

const titleLabel = computed(() =>
    props.tier.lessons !== null
        ? `${props.tier.lessons}\u00A0зан.`
        : (props.tier.label ?? "Безлимит")
)

const subtitleLabel = computed(() => {
    if (props.tier.lessons !== null && props.tier.lessons > 0) {
        const perLesson = Math.round(props.tier.price / props.tier.lessons)
        return `${formatRubles(perLesson)}/зан.`
    }
    return props.unlimitedHint ?? null
})
</script>

<template>
    <div
        class="flex flex-col gap-0.5 rounded-sm px-3 py-2.5 ring-2 transition-all"
        :class="isActive ? 'bg-primary/5 ring-primary' : 'bg-default ring-transparent'"
    >
        <span class="text-sm font-bold" :class="isActive ? 'text-primary' : 'text-default'">
            {{ titleLabel }}
        </span>
        <span
            class="text-lg leading-tight font-extrabold"
            :class="isActive ? 'text-primary' : 'text-default'"
        >
            {{ formatRubles(tier.price) }}
        </span>
        <span v-if="subtitleLabel" class="text-muted text-xs">
            {{ subtitleLabel }}
        </span>
    </div>
</template>
