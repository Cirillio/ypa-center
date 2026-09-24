<script lang="ts" setup>
// Виджет ленты ближайших активностей с группировкой по датам и постраничным просмотром.
import type { MeUpcoming } from "~/types"

const props = defineProps<{
    items?: MeUpcoming[]
    isProcessing: boolean
    error?: unknown
}>()

const emit = defineEmits<{
    retry: []
}>()

const allItems = computed(() => props.items)
const { visible, hasMore, showMore } = useShowMore(allItems, 5)

// Группировка ближайших активностей по дате (серверный фид уже предсортирован)
const groupedUpcoming = computed(() => {
    const list = visible.value
    if (!list) return undefined

    const groups: { date: string; items: MeUpcoming[] }[] = []
    for (const item of list) {
        const last = groups[groups.length - 1]
        if (last && last.date === item.displayDate) {
            last.items.push(item)
        } else {
            groups.push({ date: item.displayDate, items: [item] })
        }
    }
    return groups
})
</script>

<template>
    <div
        class="sticky top-[calc(var(--ui-header-height)+1rem)] flex flex-col gap-6 rounded-lg bg-white p-6"
    >
        <div class="flex items-center gap-3">
            <div
                class="bg-primary/5 text-primary flex items-center justify-center rounded-full p-2"
            >
                <UIcon name="ph:calendar-dot-bold" class="size-5" />
            </div>
            <h2 class="text-primary text-xl font-bold">Ближайшие активности</h2>
        </div>

        <MeErrorState
            v-if="error && !items"
            message="Не удалось загрузить ленту активностей."
            @retry="emit('retry')"
        />

        <div v-else-if="groupedUpcoming" class="flex flex-col gap-4">
            <template v-if="groupedUpcoming.length > 0">
                <div v-for="group in groupedUpcoming" :key="group.date" class="flex flex-col gap-2">
                    <div class="text-muted text-xs font-bold tracking-wider uppercase">
                        {{ group.date }}
                    </div>
                    <MeUpcomingCard
                        v-for="activity in group.items"
                        :key="activity.id"
                        :item="activity"
                    />
                </div>

                <UButton
                    v-if="hasMore"
                    variant="soft"
                    block
                    label="Показать ещё"
                    @click="showMore"
                />
            </template>
            <div v-else class="flex flex-col items-center py-8 text-center">
                <UIcon name="ph:calendar-x-bold" class="text-default/10 size-16" />
                <p class="text-muted mt-4 text-sm italic">
                    Нет запланированных<br />занятий на ближайшее время
                </p>
            </div>
        </div>

        <div v-else class="flex flex-col gap-4">
            <div
                v-for="i in 3"
                :key="i"
                class="flex h-36 flex-col gap-3 rounded-lg p-4"
                :class="isProcessing ? 'bg-secondary/10 animate-pulse' : 'bg-mauve-500/5'"
            >
                <div class="flex items-center gap-2">
                    <div class="bg-default/10 size-7 rounded-full" />
                    <div class="bg-default/10 h-3 w-20 rounded-md" />
                </div>
                <div class="flex flex-col gap-1.5">
                    <div class="bg-default/20 h-4 w-3/4 rounded-md" />
                    <div class="bg-default/10 h-3 w-1/2 rounded-md" />
                </div>
                <div class="bg-default/10 mt-auto h-6 w-full rounded-md" />
            </div>
        </div>
    </div>
</template>
