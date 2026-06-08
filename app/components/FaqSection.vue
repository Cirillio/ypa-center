<script lang="ts" setup>
const appConfig = useAppConfig()
const faqItems = appConfig.faq

useHead({
    script: [
        {
            type: "application/ld+json",
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: faqItems.map((item) => ({
                    "@type": "Question",
                    name: item.label,
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: item.content
                    }
                }))
            })
        }
    ]
})
</script>

<template>
    <section
        id="faq"
        class="relative z-10 flex w-full overflow-hidden bg-white py-12 md:py-20 lg:py-24"
    >
        <UContainer
            class="relative z-10 grid grid-cols-1 items-start gap-12 md:grid-cols-2 md:gap-16"
        >
            <!-- Left: text content -->
            <div class="flex flex-col gap-6">
                <SectionLeading subtitle="Частые вопросы" icon="ph:question-duotone">
                    <template #title>
                        <span class="text-secondary">
                            Вопросы<br />
                            <span class="text-primary">и ответы</span>
                        </span>
                    </template>
                    <template #description>
                        Собрали самые популярные вопросы от родителей. Не нашли ответ? Свяжитесь с
                        нами — мы всегда на связи!
                    </template>
                </SectionLeading>

                <CallbackForm bg="default" />
            </div>

            <div class="py-4">
                <!-- Right: accordion -->
                <UAccordion
                    :items="faqItems"
                    :ui="{
                        root: 'space-y-4',
                        item: 'border-0 bg-default rounded-md',
                        trigger:
                            'md:p-4 p-3 max-md:gap-3 gap-4 leading-tight! text-base md:text-lg font-bold text-secondary hover:text-primary transition-colors rounded-t-md cursor-pointer',
                        body: 'text-default/80 font-medium text-sm md:text-base leading-relaxed px-6 pb-6 pt-4 border-t-2 border-white'
                    }"
                />
            </div>
        </UContainer>
    </section>
</template>
