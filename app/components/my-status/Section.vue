<template>
    <PageSection>
        <UContainer>
            <SectionLeading icon="ph:user-bold" subtitle="Личный кабинет" as="h1">
                <template #title>
                    <span class="text-primary">Мой <span class="text-secondary">статус</span></span>
                </template>

                <template #description>Просмотрите свои текущие записи и абонементы.</template>
                <template #action>
                    <slot />
                </template>
            </SectionLeading>
        </UContainer>
    </PageSection>
</template>
