<script lang="ts" setup>
const {
    events,
    eventsStatus,
    eventFormState,
    eventRegistrationSchema,
    selectedEventId,
    selectedEvent,
    isSubmitting,
    onSubmit
} = useEventEnrollment()

useSeoMeta({
    title: "Запись на событие — Улица Радости",
    description:
        "Запишитесь на мероприятие детского центра Улица Радости: театральные игры, мастер-классы, лекции. Интерактивные события для детей в Новосибирске.",
    ogTitle: "Запись на событие — Улица Радости",
    ogDescription:
        "Выберите мероприятие и заполните анкету. Мы подтвердим участие и напомним о дате по почте."
})

const eventSubtitle = computed(() => {
    if (!selectedEvent.value) return null
    const dt = new Date(selectedEvent.value.start_datetime)
    const date = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(dt)
    const time = new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit" }).format(dt)
    return `${date} · ${time}`
})
</script>

<template>
    <div class="gradient-bg-ps flex min-h-dvh flex-col pt-32 pb-24">
        <UContainer>
            <SectionLeading as="h1" subtitle="Запись" class="mr-auto max-w-2xl shrink-0">
                <template #title>
                    <div class="text-primary">
                        Запись на <br />
                        <span class="text-secondary">событие</span>
                    </div>
                </template>
                <template #description>
                    Выберите интересующее мероприятие и заполните короткую анкету — мы подтвердим
                    участие и напомним о дате по почте.
                </template>
            </SectionLeading>
        </UContainer>

        <UContainer>
            <USeparator size="md" class="my-12" :ui="{ border: 'border-(--ui-text)/26' }">
                <template #default>
                    <h2 class="text-primary text-xl font-bold md:text-3xl">Оформление</h2>
                </template>
            </USeparator>
        </UContainer>

        <UContainer class="w-full">
            <div class="grid grid-cols-1 gap-4 lg:grid-cols-12">
                <div class="space-y-4 lg:col-span-7">
                    <EnrollmentSummary
                        :title="selectedEvent?.title ?? null"
                        :subtitle="eventSubtitle"
                        :img="selectedEvent?.cover_image ?? null"
                        :img-alt="selectedEvent?.title"
                        :badge="
                            selectedEvent
                                ? selectedEvent.is_free
                                    ? 'Бесплатно'
                                    : formatRub(selectedEvent.price ?? 0)
                                : undefined
                        "
                        icon="ph:calendar-star-bold"
                        empty-title="Событие не выбрано"
                        empty-subtitle="Выберите мероприятие слева"
                    />
                    <EventPicker
                        v-model="selectedEventId"
                        :events="events"
                        :loading="eventsStatus === 'pending'"
                    />
                </div>

                <div class="flex flex-col gap-4 lg:col-span-5">
                    <EventRegistrationForm
                        v-model="eventFormState"
                        :schema="eventRegistrationSchema"
                        :loading="isSubmitting"
                        @submit="onSubmit"
                    />
                </div>
            </div>
        </UContainer>
    </div>
</template>
