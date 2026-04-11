<script lang="ts" setup>
import { MOCK_EVENTS } from "~/constants/mock"
import { EnrollRoutesEnum } from "~/constants/nav"

const DEFAULT_VISIBLE = 3

const showAllEvents = ref(false)
const visibleEvents = computed(() =>
    showAllEvents.value ? MOCK_EVENTS : MOCK_EVENTS.slice(0, DEFAULT_VISIBLE)
)
</script>

<template>
    <section
        id="events"
        class="bg-default relative z-10 flex w-full overflow-hidden py-12 md:py-20 lg:py-24"
    >
        <UContainer class="relative z-10 flex flex-col gap-8 md:gap-12">
            <SectionLeading subtitle="Ближайшие мероприятия" icon="ph:calendar-star-duotone">
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

                <template #action>
                    <UButton
                        :to="EnrollRoutesEnum.Event"
                        size="xl"
                        class="group mt-auto w-fit md:px-5 md:py-2.5"
                    >
                        <span class="font-bold md:text-lg">Участвовать</span>
                        <UIcon
                            name="ph:pencil-bold"
                            class="size-4 transition group-hover:translate-x-1 group-hover:scale-103 group-hover:-rotate-5 md:size-5"
                        />
                    </UButton>
                </template>
            </SectionLeading>

            <!-- Events list / grid -->
            <div class="flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:gap-4">
                <LazyHomeEventsCard v-for="event in visibleEvents" :key="event.id" v-bind="event" />
            </div>

            <!-- Toggle button -->
            <div v-if="MOCK_EVENTS.length > DEFAULT_VISIBLE" class="flex justify-center pt-2">
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
