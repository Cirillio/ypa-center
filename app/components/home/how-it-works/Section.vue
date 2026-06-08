<script lang="ts" setup>
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

            <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div
                    v-for="(step, i) in steps"
                    :key="i"
                    class="bg-default flex flex-col gap-4 rounded-sm p-5 lg:p-6"
                >
                    <div class="flex items-center gap-3">
                        <span class="text-primary shrink-0 text-base font-black">
                            {{ String(i + 1).padStart(2, "0") }}
                        </span>
                        <div class="bg-primary/15 h-px flex-1" />
                        <UIcon :name="step.icon" class="text-primary/60 size-6 shrink-0" />
                    </div>

                    <div class="flex flex-col gap-2">
                        <h3 class="text-secondary text-2xl font-extrabold md:text-3xl">
                            {{ step.title }}
                        </h3>
                        <p class="text-default/65 text-base leading-relaxed font-medium md:text-lg">
                            {{ step.desc }}
                        </p>
                    </div>
                </div>
            </div>
        </UContainer>
    </section>
</template>
