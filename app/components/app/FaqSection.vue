<script lang="ts" setup>
const faqItems = [
    {
        label: "С какого возраста можно записаться?",
        icon: "ph:baby",
        content:
            "Мы принимаем детей от 2 лет. Для самых маленьких есть специальные развивающие и сенсорные занятия с педагогом, а для ребят постарше — кружки, продлёнка и каникулярные программы."
    },
    {
        label: "Как записаться на пробное занятие?",
        icon: "ph:pencil-simple",
        content:
            "Оставьте заявку через форму на сайте или закажите обратный звонок — мы свяжемся с вами и подберём удобное время. Пробное занятие стоит 1 200 ₽."
    },
    {
        label: "Есть ли абонементы и скидки?",
        icon: "ph:ticket",
        content:
            "Да! Мы предлагаем абонементы на 4 и 8 занятий со скидкой до 20%. Для многодетных семей и при записи на несколько направлений — дополнительные скидки."
    },
    {
        label: "Какие направления у вас есть?",
        icon: "ph:compass",
        content:
            "Настольные игры, рисование, пианино, каникулярные программы, театральные игры и многое другое. Полный список — на странице «Кружки»."
    },
    {
        label: "Где вы находитесь и как добраться?",
        icon: "ph:map-pin",
        content:
            "Наш центр расположен по адресу, который указан на странице «О нас». Мы находимся в шаговой доступности от остановок общественного транспорта. Есть парковка для автомобилей."
    }
]
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
                <SectionLeading subtitle="Частые вопросы">
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

                <AppCallbackForm bg="default" />
            </div>

            <div class="py-4">
                <!-- Right: accordion -->
                <UAccordion
                    :items="faqItems"
                    :ui="{
                        root: 'space-y-4',
                        item: 'border-0 bg-default rounded-md',
                        trigger:
                            'md:p-4 p-3 max-md:gap-3 text-base md:text-lg font-bold text-secondary hover:text-primary transition-colors rounded-t-md cursor-pointer',
                        body: 'text-default/80 font-medium text-sm md:text-base leading-relaxed px-6 pb-6 pt-4 border-t-2 border-white'
                    }"
                />
            </div>
        </UContainer>
    </section>
</template>
