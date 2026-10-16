<script lang="ts" setup>
// Шапка блока педагогов на странице «О нас» (бывшая страница /teachers), якорь #partners.
</script>

<template>
    <section
        id="partners"
        class="relative z-10 flex w-full scroll-mt-(--ui-header-height) pt-12 pb-8 md:pt-20 lg:pt-24"
    >
        <UContainer class="relative z-10 flex flex-col gap-8">
            <UiSectionLeading subtitle="Наши партнёры" icon="ph:users-duotone" center>
                <template #title>
                    <span class="text-secondary">
                        Наши<br />
                        <span class="text-primary">партнёры</span>
                    </span>
                </template>
                <template #description>
                    Каждый педагог — не просто специалист, а человек, который искренне любит детей и
                    своё дело.
                </template>
            </UiSectionLeading>

            <PromoFloatCard
                to="/clubs"
                icon="ph:puzzle-piece-duotone"
                sublabel="Смотреть"
                label="Кружки"
                description="Узнайте, какие занятия ведёт каждый педагог."
            />
        </UContainer>
    </section>
</template>
