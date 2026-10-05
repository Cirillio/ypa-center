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

const {
    submit,
    isSubmitting,
    cooldownSeconds,
    error: registrationError,
    result
} = useEventRegistration({ onEventsStale: refreshEvents })

// Отправляет бронь, только когда выбор собран; кнопка и так заблокирована, это страховка
function onContinue() {
    if (!selectedEvent.value || !isReady.value) return
    void submit(selectedEvent.value, seats.value, contacts.value)
}

// ПОЧЕМУ скролл вверх: экран подтверждения короче формы, без него родитель видит пустоту
watch(result, (value) => {
    if (value) window.scrollTo({ top: 0, behavior: "smooth" })
})
</script>

<template>
    <div class="gradient-bg-ps min-h-dvh pt-(--ui-header-height)">
        <EnrollHeader title="Запись на событие" icon="ph:ticket-bold">
            <EnrollTypeTabs active="event" />
        </EnrollHeader>

        <section v-if="result" aria-label="Заявка принята" class="px-4 pt-24 pb-16 md:pt-28">
            <div class="mx-auto w-full max-w-lg">
                <EnrollEventAccepted :result="result" />
            </div>
        </section>

        <section v-else aria-label="Оформление записи на событие" class="pb-32 lg:pb-16">
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
                    :loading="isSubmitting"
                    :cooldown-seconds="cooldownSeconds"
                    :error="registrationError"
                    @continue="onContinue"
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
            v-if="!result"
            :label="isFree ? 'Итого' : 'К оплате'"
            :amount="!selectedEvent ? '—' : isFree ? 'Бесплатно' : formatRub(totalKopecks)"
            :ready="isReady"
            action-label="Записаться"
        />
    </div>
</template>
