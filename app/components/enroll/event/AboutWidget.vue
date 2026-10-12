<script lang="ts" setup>
// Виджет подробного описания выбранного события с обложкой, фактами и индикатором мест.
import type { EventItem } from "~/types"

const FALLBACK_COVER = "/core/clubs-main.jpg"

defineProps<{
    event: EventItem | null
}>()
</script>

<template>
    <section aria-label="О событии" class="flex flex-col gap-5 rounded-lg bg-white p-6">
        <div class="flex items-center gap-3">
            <div
                class="bg-primary/5 text-primary flex items-center justify-center rounded-full p-2"
            >
                <UIcon name="ph:info-bold" class="size-5" />
            </div>
            <h2 class="text-primary text-xl font-bold">О событии</h2>
        </div>

        <div v-if="!event" class="flex flex-col items-center gap-2 py-8 text-center">
            <UIcon name="ph:ticket-bold" class="text-dimmed size-15" aria-hidden="true" />
            <p class="text-muted text-sm italic">Выберите событие — здесь появятся подробности</p>
        </div>

        <div v-else class="flex flex-col gap-4">
            <div class="aspect-16/7 w-full overflow-hidden rounded-sm">
                <UiPhoto
                    :src="event.cover_image || FALLBACK_COVER"
                    :alt="event.title"
                    class="object-cover object-center"
                />
            </div>

            <div class="flex flex-col gap-2">
                <h3 class="text-default text-2xl leading-tight font-bold">
                    {{ event.title }}
                </h3>
                <p v-if="event.description" class="text-default text-base leading-relaxed">
                    {{ event.description }}
                </p>
            </div>

            <EnrollEventFacts :event="event" />

            <EnrollEventOccupancy :available="event.availableSeats" :capacity="event.capacity" />
        </div>
    </section>
</template>
