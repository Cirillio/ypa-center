<script lang="ts" setup>
// Hero-шапка страницы галереи

const appConfig = useAppConfig()
const centerTelegram =
    appConfig.contactInfo.socials.find((i) => i.label === "ВКонтакте")?.href || "/bad-link"
</script>

<template>
    <PageSection>
        <UContainer class="relative z-10 flex flex-col gap-8">
            <SectionLeading as="h1" subtitle="Наши моменты" icon="ph:aperture-duotone" center>
                <template #title>
                    <span class="text-secondary">
                        Галерея<br />
                        <span class="text-primary">центра</span>
                    </span>
                </template>
                <template #description>
                    Загляните в нашу жизнь — яркие занятия, счастливые лица и уютная атмосфера
                    «Улицы Радости».
                </template>
            </SectionLeading>

            <FloatPromoCard
                :to="centerTelegram"
                icon="ph:aperture-duotone"
                sublabel="Больше"
                label="Фото"
                description="Ищите в нашей группе Вконтакте."
                :external="true"
                :target="'_blank'"
            /> </UContainer
    ></PageSection>
</template>
