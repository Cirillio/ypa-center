<script lang="ts" setup>
import { MOCK_EVENTS } from "~/constants/mock"

const currentEvents = computed(() => {
    const pinned = MOCK_EVENTS.filter((e) => e.isPinned)
    const regular = MOCK_EVENTS.filter((e) => !e.isPinned)
    return [...pinned, ...regular]
})

const showAllEvents = ref(false)
const visibleEvents = computed(() =>
    showAllEvents.value ? currentEvents.value : currentEvents.value.slice(0, 3)
)
</script>

<template>
    <section
        id="events"
        class="relative z-10 flex w-full overflow-hidden bg-white py-12 md:py-20 lg:py-24"
    >
        <UContainer class="relative z-10 flex flex-col gap-8 md:gap-12">
            <SectionLeading subtitle="Ближайшие мероприятия">
                <template #title>
                    <span class="text-secondary">
                        События<br />
                        <span class="text-primary">в нашем центре</span>
                    </span>
                </template>
                <template #description>
                    Интересные встречи, мастер-классы и праздники — следите за расписанием и
                    приходите с детьми.
                </template>
            </SectionLeading>

            <!-- Events grid -->
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <LazyHomeEventsCard v-for="event in visibleEvents" :key="event.id" v-bind="event" />
            </div>

            <!-- Toggle button -->
            <div v-if="MOCK_EVENTS.length > 3" class="flex justify-center pt-2">
                <UButton
                    size="xl"
                    variant="ghost"
                    color="secondary"
                    class="group px-8"
                    @click="showAllEvents = !showAllEvents"
                >
                    <span class="text-lg font-bold">
                        {{ showAllEvents ? "Скрыть" : "Все события" }}
                    </span>
                    <UIcon
                        name="ph:caret-down-bold"
                        class="size-5 transition-transform duration-300"
                        :class="showAllEvents ? 'rotate-180' : ''"
                    />
                </UButton>
            </div>
        </UContainer>
    </section>
</template>
