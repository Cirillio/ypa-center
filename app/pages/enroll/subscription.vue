<script lang="ts" setup>
import { EnrollRoutesEnum } from "~/constants/nav"
import { RegistrationSchema } from "~/schemas/registration.schema"

const {
    allSlots,
    formState,
    selectedSlotIds,
    selectedSlots,
    totalMonthlyLessons,
    currentTier,
    nextTier,
    tierProgress,
    savings,
    pricePerLesson,
    toggleSlot,
    removeSlot,
    onSubmit
} = useSubscriptionEnrollment()

useSeoMeta({
    title: "Оформить абонемент — Улица Радости",
    description:
        "Соберите персональный абонемент на кружки со скидкой до 50%. Выбирайте любые кружки из расписания, гибкое расписание. Детский центр в Новосибирске.",
    ogTitle: "Оформить абонемент на кружки — Улица Радости",
    ogDescription:
        "Персональный абонемент: выберите кружки, оплатите раз в месяц. Скидка до 50% при наборе занятий."
})
</script>

<template>
    <div class="gradient-bg-ps flex min-h-dvh flex-col pt-32 pb-24">
        <UContainer class="grid gap-16 lg:grid-cols-2">
            <SectionLeading as="h1" subtitle="Запись" class="mr-auto shrink-0">
                <template #title>
                    <div class="text-primary">
                        Собери <br />
                        <span class="text-secondary">абонемент</span>
                    </div>
                </template>
                <template #description>
                    Выберите любые кружки из расписания и оплатите один раз в месяц. Чем больше
                    занятий — тем ниже цена за каждое.
                </template>
                <template #action>
                    <div class="flex flex-col gap-0.5">
                        <span class="text-default text-base font-bold md:text-lg xl:text-xl">
                            Скидка: до <span class="text-primary">50%</span> от разовой цены
                        </span>
                        <span class="text-default text-base font-bold md:text-lg xl:text-xl">
                            Оформляется на <span class="text-primary">1 месяц</span>
                        </span>
                    </div>
                </template>
            </SectionLeading>

            <div class="flex flex-col gap-4">
                <SubscriptionsPromo>
                    <template #sub>
                        Система тарифов:
                        <span class="text-primary font-bold">чем больше — тем выгоднее</span>
                    </template>
                    <template #desc>
                        Каждый выбранный кружок добавляет 4 занятия в месяц. Абонемент подбирается
                        автоматически.
                    </template>
                </SubscriptionsPromo>
                <UButton
                    :to="EnrollRoutesEnum.Trial"
                    label="Попробовать разовое занятие"
                    leading-icon="ph:person-simple-run-bold"
                    size="lg"
                    variant="soft"
                    class="w-fit justify-center font-bold"
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
                <!-- Выбор кружков по дням -->
                <div class="flex flex-col gap-4 lg:col-span-7">
                    <SubscriptionSlotDayPicker
                        :slots="allSlots"
                        :selected-ids="selectedSlotIds"
                        @toggle="toggleSlot"
                    />
                    <SubscriptionCart
                        :selected-slots="selectedSlots"
                        :total-lessons="totalMonthlyLessons"
                        :current-tier="currentTier"
                        :next-tier="nextTier"
                        :tier-progress="tierProgress"
                        :savings="savings"
                        :price-per-lesson="pricePerLesson"
                        @remove="removeSlot"
                    />
                </div>

                <!-- Корзина + форма -->
                <div
                    class="sticky top-[calc(var(--header-height)+1rem)] h-fit rounded-sm bg-white px-6 py-4 lg:col-span-5"
                >
                    <h3 class="text-default mb-6 text-2xl font-bold">2. Заполните анкету</h3>

                    <RegistrationForm
                        v-model="formState"
                        :schema="RegistrationSchema"
                        @submit="onSubmit"
                    />
                </div>
            </div>
        </UContainer>
    </div>
</template>
