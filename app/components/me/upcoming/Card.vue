<script lang="ts" setup>
// Карточка ближайшего занятия или события в ленте расписания.
import type { MeUpcoming } from "~/types"

defineProps<{
    item: MeUpcoming
}>()
</script>

<template>
    <div
        class="bg-default/3 hover:bg-default/5 flex items-center gap-3 rounded-lg p-3 transition-colors"
    >
        <MeActivityTypeBadge :type="item.type" />

        <div class="min-w-0 flex-1">
            <div class="text-default truncate text-base leading-tight font-bold">
                {{ item.title }}
            </div>
            <div class="text-muted truncate text-sm leading-tight">
                {{ item.subtitle ? `${item.subtitle} · ` : "" }}{{ item.participant }}
            </div>
            <div v-if="item.metaLabel" class="text-default/40 text-[10px] font-bold uppercase">
                {{ item.metaLabel }}
            </div>
        </div>

        <span class="text-primary shrink-0 text-sm font-bold">{{ item.displayTime }}</span>
    </div>
</template>
