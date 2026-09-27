<script lang="ts" setup>
// Страница записи на пробное занятие: выбор кружка и времени, сводка с ребёнком и ценой.
useSeoMeta({
    title: "Пробное занятие",
    description:
        "Запишите ребёнка на разовое пробное занятие в детском центре Улица Радости. 1 200 ₽. Выберите кружок и удобное время. Новосибирск.",
    ogTitle: "Пробное занятие в кружке – Улица Радости",
    ogDescription:
        "Разовое занятие в любом кружке за 1 200 ₽. Познакомьтесь с педагогом и форматом перед оформлением абонемента."
})

const { pricing } = useAppConfig()

const { clubs, selectedClubId, selectedSlotId, selectedClub, selectedClubSlots, selectedSlot } =
    useTrialCheckout()

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

const { tiers } = useSubscriptionPlans()

// Самая низкая цена занятия среди лимитных тарифов – для ссылки «с абонементом выгоднее».
const subscriptionFromPrice = computed<number | null>(() => {
    const perLesson = tiers.value
        .filter((t) => t.lessons !== null && t.lessons > 0)
        .map((t) => Math.round(t.price / (t.lessons ?? 1)))
    return perLesson.length ? Math.min(...perLesson) : null
})

const isReady = computed(
    () => !!selectedClub.value && !!selectedSlot.value && !!selectedChild.value
)
</script>

<template>
    <div class="gradient-bg-ps min-h-dvh pt-(--ui-header-height)">
        <EnrollHeader title="Пробное занятие" icon="ph:person-simple-run-bold">
            <EnrollTypeTabs active="trial" />
        </EnrollHeader>

        <section aria-label="Оформление пробного занятия" class="pb-32 lg:pb-16">
            <UContainer class="grid gap-6 lg:grid-cols-7">
                <div class="flex min-w-0 flex-col gap-6 lg:col-span-5">
                    <EnrollTrialClubWidget v-model="selectedClubId" :clubs="clubs" />
                    <EnrollTrialSlotWidget
                        v-model="selectedSlotId"
                        :slots="selectedClubSlots"
                        :club-selected="!!selectedClubId"
                    />
                </div>

                <EnrollTrialSummary
                    :club="selectedClub"
                    :slot-item="selectedSlot"
                    :has-child="!!selectedChild"
                    :price="pricing.trialLesson"
                    :subscription-from-price="subscriptionFromPrice"
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

        <EnrollMobileBar :amount="formatRubles(pricing.trialLesson)" :ready="isReady" />
    </div>
</template>
