<script lang="ts" setup>
const { stats, pricing } = useAppConfig()

const CENTER_STATS = [
    {
        icon: "ph:mask-happy-duotone",
        textColor: "text-amber-400",
        label: "Счастливых ребят",
        value: stats.studentsCount
    },
    {
        icon: "ph:shooting-star-duotone",
        textColor: "text-emerald-500",
        label: `Работаем с ${stats.workingSince}`,
        value: stats.workingYearsText
    },
    {
        icon: "ph:book-bookmark-duotone",
        textColor: "text-cyan-500",
        label: "Пробное занятие",
        value: `${pricing.trialLesson} ₽`
    }
]
</script>

<template>
    <section class="relative z-10 flex w-full bg-white py-16 md:py-24">
        <UContainer class="flex w-full flex-col gap-10">
            <SectionLeading subtitle="Цифры и факты" center>
                <template #title>
                    <span class="text-secondary">
                        «Улица Радости»<br />
                        <span class="text-primary">в цифрах</span>
                    </span>
                </template>
            </SectionLeading>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div
                    v-for="stat in CENTER_STATS"
                    :key="stat.label"
                    class="hover:ring-primary flex flex-col items-center gap-4 rounded-md bg-white p-8 ring-2 ring-transparent transition-all duration-200 hover:-translate-y-1"
                    style="box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.06)"
                >
                    <UIcon :name="stat.icon" class="size-12" :class="stat.textColor" />
                    <div class="flex flex-col items-center gap-1 text-center">
                        <span class="text-secondary text-4xl leading-none font-extrabold">
                            {{ stat.value }}
                        </span>
                        <span class="text-default/60 text-base font-semibold">
                            {{ stat.label }}
                        </span>
                    </div>
                </div>
            </div>
        </UContainer>
    </section>
</template>
