<script lang="ts" setup>
// Виджет абонементов родителя: действующие, затем история; дозагрузка страницами.
import type { MeSubscription } from "~/types"

defineProps<{
    subscriptions?: MeSubscription[]
    hasMore: boolean
    isLoadingMore: boolean
    isProcessing: boolean
    error?: unknown
    loadMoreError?: unknown
}>()

const emit = defineEmits<{
    retry: []
    loadMore: []
}>()
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

        <template v-else-if="subscriptions">
            <div v-if="subscriptions.length > 0" class="flex flex-col gap-4">
                <MeSubscriptionsCard v-for="sub in subscriptions" :key="sub.id" :sub="sub" />

                <p v-if="loadMoreError" class="text-error text-center text-sm">
                    Не удалось загрузить ещё. Попробуйте снова.
                </p>
                <UButton
                    v-if="hasMore"
                    variant="soft"
                    block
                    label="Показать ещё"
                    :loading="isLoadingMore"
                    @click="emit('loadMore')"
                />
            </div>
            <p v-else class="text-muted py-4 text-sm italic">
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
