<script lang="ts" setup></script>

<template>
    <section
        class="from-secondary/5 via-default to-primary/10 relative z-0 flex w-full overflow-hidden bg-linear-to-br pt-[calc(var(--header-height)+3rem)] pb-16 md:pt-40 md:pb-24"
    >
        <div
            class="bg-default absolute top-6 right-6 z-0 flex rounded-full p-2 opacity-50 xl:top-20 xl:right-auto xl:left-0 xl:-translate-x-1/2 xl:rounded-none xl:bg-transparent xl:p-0 xl:opacity-10"
        >
            <UIcon name="ph:puzzle-piece-duotone" class="text-secondary size-10 xl:size-120" />
        </div>

        <UContainer
            class="relative z-10 grid grid-cols-1 items-start gap-12 md:grid-cols-2 md:gap-16"
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
                            <span class="text-default/90 ml-2 text-xl font-bold">
                                Пробное занятие —
                                <span class="text-primary font-bold">1 200 ₽</span>.
                            </span>

                            <div class="flex flex-wrap gap-4">
                                <UButton to="/enroll" size="xl" class="group px-5 py-2.5">
                                    <span class="text-lg font-bold">Записаться на пробное</span>
                                    <UIcon
                                        name="ph:rocket-launch-duotone"
                                        class="size-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                    />
                                </UButton>
                                <UButton
                                    to="/subscribe"
                                    size="xl"
                                    color="secondary"
                                    class="group px-5 py-2.5"
                                >
                                    <span class="text-lg font-bold">Оформить абонемент</span>
                                    <UIcon
                                        name="ph:pencil-duotone"
                                        class="size-5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6"
                                    />
                                </UButton>
                            </div>
                        </div> </template
                    >l
                </SectionLeading>
            </div>

            <ClubsSubscriptions />
        </UContainer>
    </section>
</template>
