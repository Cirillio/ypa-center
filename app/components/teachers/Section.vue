<script lang="ts" setup></script>

<template>
    <section
        class="relative z-10 flex w-full overflow-hidden pt-[calc(var(--header-height)+3rem)] pb-16 md:pt-40 md:pb-24"
    >
        <UContainer class="relative z-10 flex flex-col gap-8">
            <SectionLeading subtitle="Наша команда" center>
                <template #title>
                    <span class="text-secondary">
                        Небольшая, но<br />
                        <span class="text-primary">дружная команда</span>
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
            />
        </UContainer>
    </section>
</template>
