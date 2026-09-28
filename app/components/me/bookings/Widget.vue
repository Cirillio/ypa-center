<script lang="ts" setup>
// Виджет записей на пробные и события: предстоящие, затем прошедшие, дозагрузка страницами.
import type { MeBooking } from "~/types"

const props = defineProps<{
    bookings?: MeBooking[]
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

// Бэк отдаёт прошедшие после предстоящих – заголовок ставится перед первой из них
const firstPastKey = computed(() => props.bookings?.find((b) => b.isPast)?.key)
</script>

<template>
    <div class="flex flex-col gap-6 rounded-lg bg-white p-6">
        <div class="flex items-center gap-3">
            <div
                class="bg-primary/5 text-primary flex items-center justify-center rounded-full p-2"
            >
                <UIcon name="ph:calendar-check-bold" class="size-5" />
            </div>
            <h2 class="text-primary text-xl font-bold">Наши записи</h2>
        </div>

        <UiErrorState
            v-if="error && !bookings"
            message="Не удалось загрузить записи."
            @retry="emit('retry')"
        />

        <template v-else-if="bookings">
            <div v-if="bookings.length > 0" class="flex flex-col gap-4">
                <template v-for="b in bookings" :key="b.key">
                    <h3
                        v-if="b.key === firstPastKey"
                        class="text-muted mt-2 text-xs font-bold tracking-wider uppercase"
                    >
                        Прошедшие
                    </h3>
                    <MeBookingsCard :booking="b" />
                </template>

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
                У вас пока нет записей на пробные занятия или события
            </p>
        </template>

        <div v-else class="flex flex-col gap-4">
            <div
                v-for="i in 2"
                :key="i"
                class="h-40 w-full rounded-lg"
                :class="isProcessing ? 'bg-secondary/10 animate-pulse' : 'bg-mauve-500/5'"
            />
        </div>
    </div>
</template>
