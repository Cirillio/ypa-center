<script lang="ts" setup>
import { EnrollRoutesEnum } from "~/constants/nav"

const steps = [
    {
        icon: "ph:compass-duotone",
        title: "Выбираешь кружки",
        desc: "Смотришь расписание и выбираешь занятия, которые подходят по времени и интересам."
    },
    {
        icon: "ph:puzzle-piece-duotone",
        title: "Собираешь абонемент",
        desc: "Один абонемент покрывает любые кружки центра. Чем больше занятий — тем ниже цена каждого."
    },
    {
        icon: "ph:credit-card-duotone",
        title: "Платишь один раз",
        desc: "Оплата через ЮКассу онлайн. Больше не нужно платить каждый раз — занятия уже оплачены."
    }
]
</script>

<template>
    <section class="relative z-10 flex w-full bg-white py-12 md:py-20 lg:py-24">
        <UContainer class="flex flex-col gap-12 md:gap-16">
            <SectionLeading subtitle="Просто и понятно" icon="ph:lightning-duotone">
                <template #title>
                    <span class="text-secondary">
                        Как это
                        <span class="text-primary">работает</span>
                    </span>
                </template>
                <template #description>
                    Три шага от выбора кружка до оплаченного абонемента.
                </template>
            </SectionLeading>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                <div
                    v-for="(step, i) in steps"
                    :key="i"
                    class="bg-default relative flex flex-col gap-2 overflow-hidden rounded-md px-3 py-2 md:p-4"
                >
                    <!-- Decorative step number -->
                    <span
                        class="text-primary/8 absolute -right-6 -bottom-6 text-[8rem] leading-none font-black select-none"
                    >
                        {{ String(i + 1).padStart(2, "0") }}
                    </span>

                    <!-- Icon -->
                    <div
                        class="bg-primary/10 flex size-10 items-center justify-center rounded-full md:size-12"
                    >
                        <UIcon :name="step.icon" class="text-primary size-6" />
                    </div>

                    <div class="flex flex-col gap-2">
                        <h3 class="text-secondary text-lg font-extrabold md:text-xl">
                            {{ step.title }}
                        </h3>
                        <p
                            class="text-default/70 relative text-sm leading-relaxed font-medium md:text-base"
                        >
                            {{ step.desc }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="flex justify-center">
                <UButton
                    color="secondary"
                    :to="EnrollRoutesEnum.Subscription"
                    size="xl"
                    class="group"
                >
                    <span class="font-bold md:text-lg">Собрать абонемент</span>
                    <UIcon
                        name="ph:arrow-right-bold"
                        class="size-4 transition group-hover:translate-x-1 md:size-5"
                    />
                </UButton>
            </div>
        </UContainer>
    </section>
</template>
