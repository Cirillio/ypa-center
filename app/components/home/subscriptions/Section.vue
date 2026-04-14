<script lang="ts" setup>
import { EnrollRoutesEnum } from "~/constants/nav"

const { subscriptions, pricing } = useAppConfig()

const tiers = subscriptions.filter((t) => t.lessons !== null) as Array<{
    lessons: number
    price: number
    label?: string
}>

const selectedLessons = ref(tiers[1]!.lessons) // default: 8

const selectedTier = computed(() => tiers.find((t) => t.lessons === selectedLessons.value)!)

const lessonsPerWeek = computed(() => Math.round(selectedLessons.value / 4))

const regularPrice = computed(() => selectedLessons.value * pricing.trialLesson)
const savings = computed(() => regularPrice.value - selectedTier.value.price)
const savingsPct = computed(() => Math.round((savings.value / regularPrice.value) * 100))

const fmt = (n: number) =>
    new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        maximumFractionDigits: 0
    }).format(n)
</script>

<template>
    <section
        id="subscription-calc"
        class="bg-default relative z-10 flex w-full py-12 md:py-20 lg:py-24"
    >
        <UContainer class="flex flex-col gap-10 md:gap-14">
            <SectionLeading subtitle="Ценообразование" icon="ph:ticket-duotone">
                <template #title>
                    <span class="text-secondary">
                        Один абонемент —<br />
                        <span class="text-primary">любые кружки</span>
                    </span>
                </template>
                <template #description>
                    Выбери количество занятий и посмотри, сколько экономишь по сравнению с разовыми
                    посещениями.
                </template>
            </SectionLeading>

            <div class="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                <!-- Calculator -->
                <div class="flex flex-col gap-2 rounded-sm bg-white px-3 py-2 md:gap-4 md:p-4">
                    <h3 class="text-secondary text-xl font-extrabold md:text-3xl">
                        Посчитай выгоду
                    </h3>

                    <!-- Lessons picker -->
                    <div class="flex flex-col gap-2">
                        <span class="text-default/70 text-sm font-semibold">
                            Количество занятий в месяц
                        </span>
                        <div class="flex flex-wrap gap-2">
                            <UButton
                                v-for="tier in tiers"
                                :key="tier.lessons"
                                size="xl"
                                :variant="selectedLessons === tier.lessons ? 'solid' : 'soft'"
                                :color="selectedLessons === tier.lessons ? 'primary' : 'secondary'"
                                class="flex size-9 justify-center rounded-sm font-bold md:size-11"
                                @click="selectedLessons = tier.lessons"
                            >
                                {{ tier.lessons }}
                            </UButton>
                        </div>
                        <span class="text-default/50 text-xs font-medium">
                            {{ selectedLessons }}
                            {{ pluralize(selectedLessons, ["занятие", "занятия", "занятий"]) }} в
                            месяц - {{ lessonsPerWeek }}
                            {{ pluralize(lessonsPerWeek, ["занятие", "занятия", "занятий"]) }} в
                            неделю
                        </span>
                    </div>

                    <!-- Price comparison -->
                    <div class="flex flex-col gap-3 border-t border-neutral-100 pt-4">
                        <div class="flex items-center justify-between">
                            <span class="text-default/60 text-sm font-medium">
                                Разово ({{ selectedLessons }} × {{ fmt(pricing.trialLesson) }})
                            </span>
                            <span class="text-default/50 text-base font-bold line-through">
                                {{ fmt(regularPrice) }}
                            </span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-default/80 text-base font-semibold md:text-lg"
                                >По абонементу</span
                            >
                            <span class="text-secondary text-base font-extrabold md:text-xl">
                                {{ fmt(selectedTier.price) }}
                            </span>
                        </div>
                        <div
                            class="bg-primary/10 flex items-center justify-between rounded-sm px-3 py-2"
                        >
                            <span class="text-primary text-base font-bold md:text-lg"
                                >Ваша экономия</span
                            >
                            <span class="text-primary text-base font-extrabold md:text-lg">
                                {{ fmt(savings) }}
                                <span class="text-sm font-bold opacity-70">
                                    ({{ savingsPct }}%)
                                </span>
                            </span>
                        </div>
                    </div>

                    <UButton
                        :to="EnrollRoutesEnum.Subscription"
                        color="secondary"
                        size="xl"
                        class="group w-fit"
                    >
                        <span class="font-bold">Перейти к составлению</span>
                        <UIcon
                            name="ph:arrow-right-bold"
                            class="size-3.5 transition group-hover:translate-x-1"
                        />
                    </UButton>
                    <USeparator />

                    <span
                        class="before:text-error text-default/90 text-sm text-balance before:mr-1 before:font-semibold before:content-['*']"
                        >Безлимит активируется при выборе более 20 занятий в месяц. В этом случае вы
                        можете выбрать любое количество занятий.</span
                    >
                </div>

                <!-- Subscription grid -->
                <SubscriptionsPromo>
                    <template #sub>Все тарифы</template>
                    <template #desc>
                        Абонемент действует на любые кружки центра — можно комбинировать занятия как
                        угодно.
                    </template>
                </SubscriptionsPromo>
            </div>
        </UContainer>
    </section>
</template>
