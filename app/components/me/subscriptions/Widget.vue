<script lang="ts" setup>
// Виджет списка абонементов родителя с пагинацией и состояниями загрузки.
import type { MeSubscription } from "~/types"

const props = defineProps<{
    subscriptions?: MeSubscription[]
    isProcessing: boolean
    error?: unknown
}>()

const emit = defineEmits<{
    retry: []
}>()

const sortedSubscriptions = computed(() => {
    if (!props.subscriptions) return undefined
    return [...props.subscriptions].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
})

const { visible, hasMore, showMore } = useShowMore(sortedSubscriptions, 5)
</script>

<template>
    <div class="flex flex-col gap-6 rounded-lg bg-white p-6">
        <div class="flex items-center gap-3">
            <div
                class="bg-primary/5 text-primary flex items-center justify-center rounded-full p-2"
            >
                <UIcon name="ph:star-bold" class="size-5" />
            </div>
            <h2 class="text-primary text-xl font-bold">Абонементы</h2>
        </div>

        <MeErrorState
            v-if="error && !subscriptions"
            message="Не удалось загрузить абонементы."
            @retry="emit('retry')"
        />

        <template v-else-if="sortedSubscriptions">
            <div v-if="sortedSubscriptions.length > 0" class="flex flex-col gap-4">
                <MeSubscriptionsCard v-for="sub in visible" :key="sub.id" :sub="sub" />

                <UButton
                    v-if="hasMore"
                    variant="soft"
                    block
                    label="Показать ещё"
                    @click="showMore"
                />
            </div>
            <p v-else class="text-default/50 py-4 text-sm italic">
                У вас пока нет оформленных абонементов
            </p>
        </template>

        <div v-else class="flex flex-col gap-4">
            <div
                v-for="i in 2"
                :key="i"
                class="h-48 w-full rounded-lg"
                :class="isProcessing ? 'bg-secondary/10 animate-pulse' : 'bg-mauve-500/5'"
            />
        </div>
    </div>
</template>
