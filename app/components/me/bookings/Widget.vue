<script lang="ts" setup>
// Виджет списка записей на мероприятия и пробные занятия с пагинацией и состояниями загрузки.
import type { MeBooking } from "~/types"

const props = defineProps<{
    bookings?: MeBooking[]
    isProcessing: boolean
    error?: unknown
}>()

const emit = defineEmits<{
    retry: []
}>()

const items = computed(() => props.bookings)
const { visible, hasMore, showMore } = useShowMore(items, 5)
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

        <MeErrorState
            v-if="error && !bookings"
            message="Не удалось загрузить записи."
            @retry="emit('retry')"
        />

        <template v-else-if="bookings">
            <div v-if="bookings.length > 0" class="flex flex-col gap-4">
                <MeBookingsCard v-for="b in visible" :key="b.id" :booking="b" />

                <UButton
                    v-if="hasMore"
                    variant="soft"
                    block
                    label="Показать ещё"
                    @click="showMore"
                />
            </div>
            <p v-else class="text-muted py-4 text-sm italic">
                У вас пока нет записей на разовые занятия или события
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
