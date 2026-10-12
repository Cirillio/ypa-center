<script lang="ts" setup>
import type { CheckoutTrialRequest } from "~/types"

// Страница записи на пробное занятие: выбор кружка и времени, сводка с ребёнком и ценой.
useSeoMeta({
    title: "Пробное занятие",
    description:
        "Запишите ребёнка на разовое пробное занятие в детском центре Улица Радости. 1 200 ₽. Выберите кружок и удобное время. Новосибирск.",
    ogTitle: "Пробное занятие в кружке – Улица Радости",
    ogDescription:
        "Разовое занятие в любом кружке за 1 200 ₽. Познакомьтесь с педагогом и форматом перед оформлением абонемента."
})

const {
    clubs,
    isClubsLoading,
    clubsError,
    refreshClubs,
    selectedClubId,
    selectedSlotId,
    selectedClub,
    selectedClubSlots,
    selectedSlot,
    isSlotsLoading,
    slotsError,
    refreshSlots,
    trialPrice
} = useTrialCheckout()

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

const { isUsed: isTrialUsed, refresh: refreshTrialUsage } = useTrialUsage({
    isAuthed,
    studentId: computed(() => toStudentId(selectedChild.value?.id)),
    activityId: computed(() => selectedClub.value?.id)
})

const { tiers } = useSubscriptionPlans()

// Самая низкая цена занятия среди лимитных тарифов – для ссылки «с абонементом выгоднее».
const subscriptionFromPrice = computed<number | null>(() => {
    const perLesson = tiers.value
        .filter((t) => t.lessons !== null && t.lessons > 0)
        .map((t) => Math.round(t.price / (t.lessons ?? 1)))
    return perLesson.length ? Math.min(...perLesson) : null
})

const isReady = computed(
    () =>
        !!selectedClub.value && !!selectedSlot.value && !!selectedChild.value && !isTrialUsed.value
)

const {
    isSubmitting,
    error: checkoutError,
    cooldownSeconds,
    submitTrial
} = useCheckoutPayment({
    onSlotsStale: refreshSlots,
    onChildrenStale: retryKids,
    onTrialUsed: refreshTrialUsage
})

// Тело заказа; null – выбор неполный
const payload = computed<CheckoutTrialRequest | null>(() => {
    const slot = selectedSlot.value
    const studentId = toStudentId(selectedChild.value?.id)
    if (!slot || studentId === null) return null
    return { student_id: studentId, schedule_id: slot.scheduleId, trial_date: slot.date }
})

// Отправляет заказ, если выбор полный; иначе кнопка и так заблокирована
function handleContinue() {
    if (payload.value) void submitTrial(payload.value)
}
</script>

<template>
    <div class="gradient-bg-ps min-h-dvh pt-(--ui-header-height)">
        <EnrollHeader title="Пробное занятие" icon="ph:person-simple-run-bold">
            <EnrollTypeTabs active="trial" />
        </EnrollHeader>

        <section aria-label="Оформление пробного занятия" class="pb-32 lg:pb-16">
            <UContainer class="grid gap-6 lg:grid-cols-7">
                <div class="flex min-w-0 flex-col gap-6 lg:col-span-5">
                    <EnrollTrialClubWidget
                        v-model="selectedClubId"
                        :clubs="clubs"
                        :loading="isClubsLoading"
                        :error="clubsError"
                        @retry="refreshClubs"
                    />
                    <EnrollTrialSlotWidget
                        v-model="selectedSlotId"
                        :slots="selectedClubSlots"
                        :club-selected="!!selectedClubId"
                        :loading="isSlotsLoading"
                        :error="slotsError"
                        @retry="refreshSlots"
                    />
                </div>

                <EnrollTrialSummary
                    :club="selectedClub"
                    :slot-item="selectedSlot"
                    :has-child="!!selectedChild"
                    :price="trialPrice"
                    :trial-used="isTrialUsed"
                    :subscription-from-price="subscriptionFromPrice"
                    :is-submitting="isSubmitting"
                    :cooldown-seconds="cooldownSeconds"
                    :error="checkoutError"
                    @continue="handleContinue"
                >
                    <EnrollKidPicker
                        v-model="selectedChildId"
                        :is-authed="isAuthed"
                        :is-pending="isKidsPending"
                        :error="kidsError"
                        :children="children"
                        :is-saving="isKidSaving"
                        :login-to="loginTo"
                        title="Кто пойдёт на занятие"
                        @add="addChild"
                        @retry="retryKids"
                    />
                </EnrollTrialSummary>
            </UContainer>
        </section>

        <EnrollMobileBar
            :amount="
                trialPrice === null
                    ? '—'
                    : trialPrice === 0
                      ? 'Бесплатно'
                      : formatRubles(trialPrice)
            "
            :ready="isReady"
        />
    </div>
</template>
