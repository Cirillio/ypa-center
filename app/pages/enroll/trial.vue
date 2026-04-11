<script lang="ts" setup>
import { EnrollRoutesEnum } from "~/constants/nav"

const { pricing, contactInfo } = useAppConfig()
const telegramHref = contactInfo.socials.find((i) => i.label === "Telegram")?.href

const {
    clubs,
    trialFormState,
    trialRegistrationSchema,
    selectedClubId,
    selectedSlotId,
    selectedClubSlots,
    selectedVariant,
    onSubmit
} = useTrialEnrollment()
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
                        <span class="text-default text-base font-bold md:text-lg xl:text-xl">
                            Продолжительность: <span class="text-primary">60</span> мин.
                        </span>
                        <TelegramBotPromo :href="telegramHref" />
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
                    size="xl"
                    color="secondary"
                    class="w-fit justify-center px-5 text-xl font-bold"
                />
            </div>
        </UContainer>

        <UContainer>
            <USeparator size="md" class="my-12" :ui="{ border: 'border-(--ui-text)/26' }">
                <template #default>
                    <h2 class="text-primary text-3xl font-bold">Оформление</h2>
                </template>
            </USeparator>
        </UContainer>

        <UContainer class="w-full">
            <div class="grid grid-cols-1 gap-4 lg:grid-cols-12">
                <div class="flex flex-col gap-4 lg:col-span-7">
                    <TrialClubPicker v-model="selectedClubId" :clubs="clubs" />
                    <TrialSlotPicker
                        v-model="selectedSlotId"
                        :slots="selectedClubSlots"
                        :club-selected="!!selectedClubId"
                    />
                </div>

                <div class="flex flex-col gap-4 lg:col-span-5">
                    <TrialSelectionSummary
                        :name="selectedVariant?.name ?? null"
                        :date-time="selectedVariant?.slot ?? null"
                    />
                    <TrialRegistrationForm
                        v-model="trialFormState"
                        :schema="trialRegistrationSchema"
                        @submit="onSubmit"
                    />
                </div>
            </div>
        </UContainer>
    </div>
</template>
