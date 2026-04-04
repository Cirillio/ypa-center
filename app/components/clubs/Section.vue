<script lang="ts" setup></script>

<template>
    <section
        class="gradient-bg-ps relative z-0 flex w-full overflow-hidden pt-[calc(var(--header-height)+3rem)] pb-16 md:pt-40 md:pb-24"
    >
        <UContainer
            class="relative z-10 grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16"
        >
            <div class="flex flex-col gap-8">
                <SectionLeading subtitle="Наши кружки">
                    <template #title>
                        <span class="text-secondary">
                            Найдите занятие<br />
                            <span class="text-primary">для вашего ребёнка</span>
                        </span>
                    </template>
                    <template #description>
                        Внимательные педагоги, уютная атмосфера и занятия, которые дети ждут с
                        нетерпением.
                    </template>

                    <template #action>
                        <div class="flex flex-col gap-2">
                            <span class="text-default/90 ml-2 text-base font-bold md:text-xl">
                                Пробное занятие —
                                <span class="text-primary font-bold">1 200 ₽</span>.
                            </span>

                            <div class="flex flex-wrap gap-2 md:gap-4">
                                <UButton to="/enroll" size="xl" class="group md:px-5 md:py-2.5">
                                    <span class="text-base font-bold md:text-lg"
                                        >Записаться на пробное</span
                                    >
                                    <UIcon
                                        name="ph:rocket-launch-duotone"
                                        class="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 md:size-5"
                                    />
                                </UButton>
                                <UButton
                                    to="/subscribe"
                                    size="xl"
                                    color="secondary"
                                    class="group md:px-5 md:py-2.5"
                                >
                                    <span class="text-lg font-bold">Оформить абонемент</span>
                                    <UIcon
                                        name="ph:pencil-duotone"
                                        class="size-5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6"
                                    />
                                </UButton>
                            </div>
                        </div>
                    </template>
                </SectionLeading>
            </div>

            <ClubsSubscriptions />
        </UContainer>
    </section>
</template>
