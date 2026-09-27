<script lang="ts" setup>
// Карточка выбора события афиши с обложкой, датой, остатком мест, ценой и радио-состоянием.
import type { EventItem } from "~/types"

const FALLBACK_COVER = "/core/clubs-main.jpg"

const props = defineProps<{
    event: EventItem
    isSelected: boolean
}>()

const emit = defineEmits<{
    select: [eventId: number]
}>()

const isFull = computed(() => props.event.availableSeats === 0)
const formattedDateTime = computed(() => formatEventDateTime(props.event.start_datetime))

// Выбирает событие при клике, если остались свободные места.
function handleClick() {
    if (isFull.value) return
    emit("select", props.event.id)
}
</script>

<template>
    <button
        type="button"
        role="radio"
        :aria-checked="isSelected"
        :disabled="isFull"
        :data-event-id="event.id"
        class="bg-default flex flex-col gap-3 rounded-sm p-2 text-start ring-2 transition-all duration-200 sm:flex-row"
        :class="
            isFull
                ? 'cursor-not-allowed opacity-55 ring-transparent'
                : isSelected
                  ? 'ring-primary cursor-pointer'
                  : 'hover:ring-primary/50 cursor-pointer ring-transparent'
        "
        @click="handleClick"
    >
        <div
            class="relative aspect-video w-full shrink-0 overflow-hidden rounded-xs sm:aspect-square sm:w-36"
        >
            <UiPhoto
                :src="event.cover_image || FALLBACK_COVER"
                :alt="event.title"
                class="object-cover object-center"
            />
        </div>

        <div class="flex min-w-0 flex-1 flex-col justify-between gap-2 py-0.5 pr-1">
            <div class="flex flex-col gap-1">
                <div class="flex items-start justify-between gap-2">
                    <span class="text-primary text-lg leading-tight font-bold">
                        {{ event.title }}
                    </span>
                    <UIcon
                        v-if="!isFull"
                        aria-hidden="true"
                        :name="isSelected ? 'ph:check-circle-bold' : 'ph:circle-bold'"
                        class="mt-0.5 size-5 shrink-0"
                        :class="isSelected ? 'text-primary' : 'text-primary/40'"
                    />
                </div>
                <p v-if="event.description" class="text-muted line-clamp-2 text-sm leading-snug">
                    {{ event.description }}
                </p>
            </div>

            <div class="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm font-bold">
                <span class="text-default flex items-center gap-1.5">
                    <UIcon
                        name="ph:calendar-blank-bold"
                        class="text-primary/70 size-4 shrink-0"
                        aria-hidden="true"
                    />
                    {{ formattedDateTime }}
                </span>

                <span
                    class="flex items-center gap-1 rounded-xs bg-white px-2 py-0.5"
                    :class="getCapacityTextColor(event.availableSeats)"
                >
                    <UIcon name="ph:users-bold" class="size-4 shrink-0" aria-hidden="true" />
                    {{ isFull ? "Мест нет" : `Мест: ${event.availableSeats}/${event.capacity}` }}
                </span>

                <span
                    class="ml-auto text-base"
                    :class="event.is_free ? 'text-secondary' : 'text-primary'"
                >
                    {{ event.is_free ? "Бесплатно" : formatRub(event.price ?? 0) }}
                </span>
            </div>
        </div>
    </button>
</template>
