<script lang="ts" setup>
// Hero-шапка страницы галереи

const appConfig = useAppConfig()
const centerTelegram =
    appConfig.contactInfo.socials.find((i) => i.label === "Telegram")?.href || "/bad-link"
</script>

<template>
    <section
        class="relative z-10 flex w-full overflow-hidden pt-[calc(var(--header-height)+3rem)] pb-16 md:pt-40 md:pb-24"
    >
        <!-- Декоративная иконка -->

        <UContainer class="relative z-10 flex flex-col gap-8">
            <SectionLeading subtitle="Наши моменты" center>
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
                icon="ph:images-fill"
                sublabel="Больше"
                label="Фото"
                description="Ищите в нашем телеграм канале."
                :external="true"
                :target="'_blank'"
            />
        </UContainer>
    </section>
</template>
