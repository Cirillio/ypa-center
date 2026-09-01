<script lang="ts" setup>
import { EnrollRoutesEnum } from "~/constants/nav"
import type { EventItem } from "~/types"

const { apiFetch } = useApi()
const { data, error } = await useAsyncData("home-events", () =>
    apiFetch<EventItem[]>("/v1/public/events/")
)
const events = computed(() => {
    const raw = data.value ?? []
    return raw.toSorted((a, b) => {
        // 1. Актуальные события (is_upcoming === true) в начале, прошедшие — в самый конец
        if (a.is_upcoming !== b.is_upcoming) {
            return a.is_upcoming ? -1 : 1
        }
        // 2. Внутри каждой группы — хронологический порядок (от ближайших к дальним)
        return new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime()
    })
})
</script>

<template>
    <section
        id="events"
        class="relative z-10 flex w-full overflow-hidden bg-white py-12 md:py-20 lg:py-24"
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

            <!-- Пустое состояние или ошибка загрузки -->
            <HomeEventsEmpty v-if="error || events.length === 0" />

            <!-- Events list / grid -->
            <ul v-else class="flex flex-col gap-2 lg:grid lg:grid-cols-3 lg:gap-4">
                <li
                    v-for="event in events"
                    :key="event.id + event.title + event.start_datetime"
                    class="flex"
                >
                    <LazyHomeEventsCard
                        :id="event.id"
                        :title="event.title"
                        :description="event.description"
                        :cover-image="event.cover_image"
                        :start-datetime="event.start_datetime"
                        :price="event.price"
                        :is-free="event.is_free"
                        :is-upcoming="event.is_upcoming"
                    />
                </li>
            </ul>
        </UContainer>
    </section>
</template>
