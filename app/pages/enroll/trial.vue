<script lang="ts" setup>
import { EnrollRoutesEnum } from "~/constants/nav"
import { RegistrationSchema } from "~/schemas/registration.schema"

const { pricing } = useAppConfig()

const {
    clubs,
    trialFormState,
    selectedClubId,
    selectedSlotId,
    selectedClubSlots,
    selectedVariant,
    onSubmit
} = useTrialEnrollment()

useSeoMeta({
    title: "Пробное занятие — Улица Радости",
    description:
        "Запишите ребёнка на разовое пробное занятие в детском центре Улица Радости. 1 200 ₽. Выберите кружок и удобное время. Новосибирск.",
    ogTitle: "Пробное занятие в кружке — Улица Радости",
    ogDescription:
        "Разовое занятие в любом кружке за 1 200 ₽. Познакомьтесь с педагогом и форматом перед оформлением абонемента."
})
</script>

<template>
    <div class="gradient-bg-ps flex min-h-dvh flex-col pt-32 pb-24">
        <UContainer class="grid gap-16 lg:grid-cols-2">
            <SectionLeading as="h1" subtitle="Запись" class="mr-auto shrink-0">
                <template #title>
                    <div class="text-primary">
                        Пробное <br />
                        <span class="text-secondary">занятие</span>
                    </div>
                </template>
                <template #description>
                    Выберите интересующее направление, удобное время и заполните небольшую форму,
                    чтобы записаться на <strong>разовое</strong> занятие.
                </template>
                <template #action>
                    <div class="flex flex-col gap-0.5">
                        <span class="text-default text-base font-bold md:text-lg xl:text-xl">
                            Стоимость:
                            <span class="text-primary">{{ pricing.trialLesson }}</span>
                            руб.
                        </span>
                    </div>
                </template>
            </SectionLeading>

            <div class="flex flex-col gap-4">
                <SubscriptionsPromo>
                    <template #sub>
                        С абонементом <span class="text-primary font-bold">выгоднее!</span>
                    </template>
                    <template #desc>
                        В нашей системе вы можете включить разные кружки в один абонемент:
                        <br />
                        - Чем <strong>больше</strong> кружков - тем <strong>выше скидка!</strong>
                        <br />
                        - Максимальная выгода: <strong>50%</strong>
                        <br />
                        - Абонемент оформляется на <strong>месяц</strong>
                    </template>
                </SubscriptionsPromo>
                <UButton
                    :to="EnrollRoutesEnum.Subscription"
                    label="Собрать абонемент"
                    leading-icon="ph:puzzle-piece-bold"
                    size="lg"
                    color="secondary"
                    class="w-fit justify-center px-5 text-base font-bold md:text-xl"
                />
            </div>
        </UContainer>

        <UContainer>
            <USeparator
                size="sm"
                class="my-12"
                :ui="{ border: 'rounded-full border-(--ui-text)/26' }"
            >
                <template #default>
                    <h2 class="text-primary text-xl font-bold md:text-3xl">Оформление</h2>
                </template>
            </USeparator>
        </UContainer>

        <UContainer class="w-full">
            <div class="grid grid-cols-1 gap-4 lg:grid-cols-12">
                <div class="flex flex-col gap-4 lg:col-span-7">
                    <EnrollmentSummary
                        :title="selectedVariant?.name ?? null"
                        :subtitle="selectedVariant?.slot ?? null"
                        :img="selectedVariant?.img ?? null"
                        :badge="pricing.trialLesson + 'р'"
                        icon="ph:person-simple-run-bold"
                        empty-title="Кружок не выбран"
                        empty-subtitle="Время не выбрано"
                    />

                    <TrialClubPicker v-model="selectedClubId" :clubs="clubs" />
                    <TrialSlotPicker
                        v-model="selectedSlotId"
                        :slots="selectedClubSlots"
                        :club-selected="!!selectedClubId"
                    />
                </div>

                <div
                    class="sticky top-[calc(var(--header-height)+1rem)] h-fit rounded-sm bg-white px-6 py-4 lg:col-span-5"
                >
                    <h3 class="text-default mb-6 text-2xl font-bold">3. Заполните анкету</h3>
                    <RegistrationForm
                        v-model="trialFormState"
                        :schema="RegistrationSchema"
                        @submit="onSubmit"
                    />
                </div>
            </div>
        </UContainer>
    </div>
</template>
