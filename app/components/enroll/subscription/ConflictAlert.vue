<script lang="ts" setup>
// Предупреждение о пересечении выбранных кружков по времени в один день недели.
import type { SubscriptionSlotConflict } from "~/types"

const props = defineProps<{
    conflicts: SubscriptionSlotConflict[]
}>()

// Форматирует пару пересекающихся слотов в читаемую строку («Шахматы и Робототехника (Ср 16:00)»).
const formattedConflicts = computed(() =>
    props.conflicts
        .map(({ first, second }) => {
            const dayShort = getDayName("short", (first.dayOfWeek + 6) % 7)
            return `${first.activity.name} и ${second.activity.name} (${dayShort} ${first.startTime})`
        })
        .join("; ")
)
</script>

<template>
    <div
        v-if="conflicts.length > 0"
        role="alert"
        class="flex items-start gap-2 rounded-sm bg-amber-500/10 px-4 py-3 text-sm text-amber-800"
    >
        <UIcon
            name="ph:warning-bold"
            class="mt-0.5 size-4.5 shrink-0 text-amber-600"
            aria-hidden="true"
        />
        <span>
            <span class="font-bold">Занятия пересекаются по времени:</span>
            {{ formattedConflicts }}. Проверьте, что ребёнок успеет.
        </span>
    </div>
</template>
