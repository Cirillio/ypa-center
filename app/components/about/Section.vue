<script lang="ts" setup></script>

<template>
    <section
        class="gradient-bg-ps relative z-10 flex w-full overflow-hidden pt-[calc(var(--ui-header-height)+3rem)] pb-16 md:pt-40 md:pb-24"
    >
        <UContainer class="relative z-10 flex flex-col gap-8">
            <UiSectionLeading subtitle="О нашем центре" as="h1" icon="ph:info-duotone">
                <template #title>
                    <span class="text-secondary">
                        Место, где дети<br />
                        <span class="text-primary">раскрываются</span>
                    </span>
                </template>
                <template #description>
                    «Улица Радости» — центр умного развития, где уютная атмосфера и внимательные
                    педагоги помогают каждому ребёнку найти своё призвание.
                </template>
            </UiSectionLeading>

            <PromoFloatCard
                to="/teachers"
                icon="ph:chalkboard-teacher-duotone"
                sublabel="Наша"
                label="Команда"
                description="Внимательные педагоги, которые любят своё дело."
            />

            <!-- CTA -->
            <UButton
                to="#map"
                leading-icon="ph:map-pin-area-bold"
                label="Найти нас"
                color="secondary"
                class="w-fit px-6 font-semibold md:text-lg"
            />
        </UContainer>
    </section>
</template>
