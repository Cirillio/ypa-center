<script lang="ts" setup>
// Страница записи на событие (срез 1: каркас, выбор события из афиши и подробности).
useSeoMeta({
    title: "Запись на событие",
    description:
        "Запишитесь на мероприятие детского центра Улица Радости: театральные игры, мастер-классы, лекции. Интерактивные события для детей в Новосибирске.",
    ogTitle: "Запись на событие – Улица Радости",
    ogDescription:
        "Выберите мероприятие и заполните анкету. Мы подтвердим участие и напомним о дате по почте."
})

const {
    events,
    isLoading,
    eventsError,
    refreshEvents,
    selectedEventId,
    selectedEvent,
    seats,
    maxSeats,
    changeSeats,
    contacts,
    isContactsValid,
    isFree,
    totalKopecks,
    isReady
} = useEventCheckout()
</script>

<template>
    <div class="gradient-bg-ps min-h-dvh pt-(--ui-header-height)">
        <EnrollHeader title="Запись на событие" icon="ph:ticket-bold">
            <EnrollTypeTabs active="event" />
        </EnrollHeader>

        <section aria-label="Оформление записи на событие" class="pb-32 lg:pb-16">
            <UContainer class="grid gap-6 lg:grid-cols-7">
                <div class="flex min-w-0 flex-col gap-6 lg:col-span-5">
                    <EnrollEventListWidget
                        v-model="selectedEventId"
                        :events="events"
                        :loading="isLoading"
                        :error="eventsError"
                        @retry="refreshEvents"
                    />
                    <EnrollEventAboutWidget :event="selectedEvent" />
                </div>

                <EnrollEventSummary
                    :event="selectedEvent"
                    :seats="seats"
                    :is-free="isFree"
                    :total-kopecks="totalKopecks"
                    :contacts-valid="isContactsValid"
                >
                    <EnrollEventSeatsStepper
                        :seats="seats"
                        :max="maxSeats"
                        :has-event="!!selectedEvent"
                        @change="changeSeats"
                    />
                    <USeparator />
                    <EnrollEventContactsForm v-model="contacts" />
                </EnrollEventSummary>
            </UContainer>
        </section>

        <EnrollMobileBar
            :amount="!selectedEvent ? '—' : isFree ? 'Бесплатно' : formatRub(totalKopecks)"
            :ready="isReady"
            :action-label="isFree ? 'Записаться' : 'Продолжить'"
        />
    </div>
</template>
