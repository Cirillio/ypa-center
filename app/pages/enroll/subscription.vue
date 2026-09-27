<script lang="ts" setup>
// Страница оформления абонемента (каркас, выбор кружков по дням и автоматический подбор тарифа).
useSeoMeta({
    title: "Собрать абонемент",
    description:
        "Соберите персональный абонемент на кружки со скидкой до 50%. Выбирайте любые кружки из расписания, гибкое расписание. Детский центр в Новосибирске.",
    ogTitle: "Оформить абонемент на кружки – Улица Радости",
    ogDescription:
        "Персональный абонемент: выберите кружки, оплатите раз в месяц. Скидка до 50% при наборе занятий."
})

const {
    weekDays,
    selectedDay,
    slotsForSelectedDay,
    isSlotsPending,
    slotsError,
    refreshSlots,
    selectedSlotIds,
    selectedCountByDow,
    toggleSlot,
    selectedSlots,
    conflicts,
    tiers,
    currentTierIndex,
    currentTier,
    nextTier,
    totalMonthlyLessons,
    unlimitedHint
} = useSubscriptionCheckout()

const { pricing } = useAppConfig()
const {
    isAuthed,
    isPending: isKidsPending,
    error: kidsError,
    retry: retryKids,
    children,
    isSaving: isKidSaving,
    selectedChildId,
    selectedChild,
    loginTo,
    addChild
} = useCheckoutChildren()

const isReady = computed(() => selectedSlots.value.length > 0 && !!selectedChild.value)
</script>

<template>
    <div class="gradient-bg-ps min-h-dvh pt-(--ui-header-height)">
        <EnrollHeader title="Собрать абонемент" icon="ph:puzzle-piece-bold">
            <EnrollTypeTabs active="subscription" />
        </EnrollHeader>

        <section aria-label="Оформление абонемента" class="pb-32 lg:pb-16">
            <UContainer class="grid gap-6 lg:grid-cols-7">
                <div class="flex min-w-0 flex-col gap-6 lg:col-span-5">
                    <EnrollSubscriptionSlotsWidget
                        :slots="slotsForSelectedDay"
                        :selected-ids="selectedSlotIds"
                        :days="weekDays"
                        :selected-dow="selectedDay.dow"
                        :counts-by-dow="selectedCountByDow"
                        :conflicts="conflicts"
                        :is-pending="isSlotsPending"
                        :error="slotsError"
                        @select-day="void (selectedDay = $event)"
                        @toggle-slot="toggleSlot"
                        @retry="refreshSlots"
                    />

                    <EnrollSubscriptionTiersWidget
                        :tiers="tiers"
                        :current-tier-index="currentTierIndex"
                        :next-tier="nextTier"
                        :total-monthly-lessons="totalMonthlyLessons"
                        :unlimited-hint="unlimitedHint"
                    />
                </div>

                <EnrollSubscriptionSummary
                    :slots="selectedSlots"
                    :tier="currentTier"
                    :total-monthly-lessons="totalMonthlyLessons"
                    :has-child="!!selectedChild"
                    :trial-price="pricing.trialLesson"
                    @remove="toggleSlot"
                >
                    <EnrollKidPicker
                        v-model="selectedChildId"
                        title="Для кого абонемент"
                        :is-authed="isAuthed"
                        :is-pending="isKidsPending"
                        :error="kidsError"
                        :children="children"
                        :is-saving="isKidSaving"
                        :login-to="loginTo"
                        @add="addChild"
                        @retry="retryKids"
                    />
                </EnrollSubscriptionSummary>
            </UContainer>
        </section>

        <EnrollMobileBar
            label="Итого в месяц"
            :amount="currentTier ? formatRubles(currentTier.price) : '—'"
            :ready="isReady"
        />
    </div>
</template>
