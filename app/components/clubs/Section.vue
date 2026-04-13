<script lang="ts" setup>
import { EnrollRoutesEnum } from "~/constants/nav"
</script>

<template>
    <section
        class="gradient-bg-ps relative z-0 flex w-full overflow-hidden pt-[calc(var(--header-height)+3rem)] pb-16 md:pt-40 md:pb-24"
    >
        <UContainer
            class="relative z-10 grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16"
        >
            <div class="flex flex-col gap-8">
                <SectionLeading as="h1" subtitle="Наши кружки" icon="ph:compass-duotone">
                    <template #title>
                        <span class="text-secondary">
                            Найдите занятие <br />
                            <span class="text-primary">для себя и своего ребёнка</span>
                        </span>
                    </template>
                    <template #description>
                        Уютное пространство, где каждый найдет увлечение по душе. Внимательные
                        педагоги помогут раскрыть таланты малышам и с удовольствием провести время
                        взрослым.
                    </template>

                    <template #action>
                        <div class="flex flex-col gap-3">
                            <div class="flex flex-col gap-1">
                                <UButton
                                    :to="EnrollRoutesEnum.Subscription"
                                    size="xl"
                                    color="secondary"
                                    class="group w-fit"
                                >
                                    <span class="text-base font-bold md:text-lg"
                                        >Собрать абонемент</span
                                    >
                                    <UIcon
                                        name="ph:puzzle-piece-duotone"
                                        class="size-4.5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6 md:size-5.5"
                                    />
                                </UButton>
                                <span class="text-default/90 ml-1 text-xs font-bold">
                                    От <span class="text-primary">450 ₽</span> за занятие — выгоднее
                                    разового
                                </span>
                            </div>

                            <UButton
                                :to="EnrollRoutesEnum.Trial"
                                size="lg"
                                variant="soft"
                                class="group w-fit"
                            >
                                <span class="font-semibold"
                                    >Или записаться на пробное — 1 200 ₽</span
                                >
                                <UIcon
                                    name="ph:arrow-right-bold"
                                    class="size-3.5 transition group-hover:translate-x-1"
                                />
                            </UButton>
                        </div>
                    </template>
                </SectionLeading>
            </div>

            <SubscriptionsPromo>
                <template #sub> Система абонементов </template>
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
        </UContainer>
    </section>
</template>
