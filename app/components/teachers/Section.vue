<script lang="ts" setup></script>

<template>
    <PageSection>
        <UContainer class="relative z-10 flex flex-col gap-8">
            <SectionLeading as="h1" subtitle="Наша команда" icon="ph:users-duotone" center>
                <template #title>
                    <span class="text-secondary">
                        Наша<br />
                        <span class="text-primary">команда</span>
                    </span>
                </template>
                <template #description>
                    Каждый педагог — не просто специалист, а человек, который искренне любит детей и
                    своё дело.
                </template>
            </SectionLeading>

            <FloatPromoCard
                to="/clubs"
                icon="ph:puzzle-piece-duotone"
                sublabel="Смотреть"
                label="Кружки"
                description="Узнайте, какие занятия ведёт каждый педагог."
            /> </UContainer
    ></PageSection>
</template>
