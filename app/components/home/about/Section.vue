<script lang="ts" setup>
const { stats, pricing } = useAppConfig()

const photos = [
    "/moke/club_1.jpg",
    "/moke/club_2.jpg",
    "/moke/teacher_1.png",
    "/moke/teacher_3.png"
]

const CENTER_STATS = [
    {
        icon: "ph:mask-happy-duotone",
        textColor: "text-amber-400",
        label: "Счастливых ребят",
        value: stats.studentsCount
    },
    {
        icon: "ph:shooting-star-duotone",
        textColor: "text-emerald-500",
        label: `Работаем с ${stats.workingSince}`,
        value: stats.workingYearsText
    },
    {
        icon: "ph:book-bookmark-duotone",
        textColor: "text-cyan-500",
        label: "Пробное занятие",
        value: `${pricing.trialLesson} ₽`
    }
]

const [card1, card2, card3] = [
    {
        tag: "5–7 лет",
        title: "Дошкольники",
        desc: "Программа ГДЕЁЖ — это не репетиторство и не строгие прописи. Буквы, цифры и звуки осваиваются через движение, игру и живой разговор. Ребёнок не «проходит материал» — он исследует. К моменту первого звонка он уже знает: учиться — не страшно."
    },
    {
        tag: "7–14 лет",
        title: "Школьники",
        desc: "Маленькие группы, домашняя обстановка, педагоги которые знают каждого по имени. Кружок мышления учит не фактам, а способу думать. Английский строится на живом общении. Умная продлёнка — место где можно отдохнуть, сделать домашку и поиграть в настолки."
    },
    {
        tag: "Для родителей",
        title: "Родители которые выбирают осознанно",
        desc: "Надежда — монтессори-педагог и преподаватель английского в СУНЦ НГУ. Яков — кандидат физико-математических наук, более двадцати лет занимается развитием мышления у детей. Здесь нет потока из сотни учеников. Каждый ребёнок виден, каждый прогресс замечен."
    }
]
</script>

<template>
    <section class="relative z-10 flex w-full bg-white py-12 md:py-20 lg:py-24">
        <UContainer class="flex flex-col gap-10 md:gap-14">
            <!-- Header row: stats left, SectionLeading right -->
            <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <!-- Section heading -->
                <SectionLeading subtitle="Для кого мы работаем" icon="ph:users-duotone">
                    <template #title>
                        <span class="text-secondary">
                            Кому это
                            <span class="text-primary">подойдёт</span>
                        </span>
                    </template>
                    <template #description>
                        <span class="flex text-balance">
                            Программы центра рассчитаны на разный возраст и разные цели — от
                            подготовки к школе до осознанного выбора развития ребёнка.
                        </span>
                    </template>
                </SectionLeading>

                <!-- Stats -->
                <div class="flex gap-3 max-[360px]:flex-col min-[361px]:flex-wrap md:gap-4">
                    <div
                        v-for="stat in CENTER_STATS"
                        :key="stat.label"
                        class="bg-default flex flex-col gap-1.5 rounded-sm px-3 py-2.5 max-[360px]:flex-auto max-sm:flex-2/5"
                    >
                        <span class="flex items-center gap-1.5">
                            <UIcon
                                :name="stat.icon"
                                class="size-4 shrink-0"
                                :class="stat.textColor"
                            />
                            <span class="text-default/60 text-xs font-semibold">{{
                                stat.label
                            }}</span>
                        </span>
                        <span class="text-secondary text-xl leading-none font-extrabold">{{
                            stat.value
                        }}</span>
                    </div>
                </div>
            </div>

            <!-- Main content: sticky carousel left + cards grid right -->
            <div class="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_3fr] lg:items-start lg:gap-10">
                <!-- Left: Sticky Carousel -->
                <div class="grid">
                    <UCarousel
                        v-slot="{ item }"
                        :items="photos"
                        dots
                        loop
                        :autoplay="{ delay: 3000 }"
                        class="h-80 w-full overflow-hidden rounded-sm lg:h-full lg:max-h-140 xl:max-h-120"
                        :ui="{
                            viewport: 'h-full',
                            container: 'h-full ms-0',
                            item: 'h-full ps-0',
                            dots: 'bottom-4 w-fit left-4',
                            dot: 'bg-white/75 shadow-sm backdrop-blur-sm data-[state=active]:shadow-none data-[state=active]:bg-white'
                        }"
                    >
                        <AppPhoto
                            :src="item"
                            :quality="75"
                            alt="Фото центра"
                            class="min-h-full w-full object-cover object-center"
                        />
                    </UCarousel>
                </div>

                <!-- Right: Cards Grid -->
                <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:content-start">
                    <div class="bg-default flex flex-col gap-2 rounded-sm p-4">
                        <span
                            class="text-default/50 text-xs font-semibold tracking-wider uppercase"
                        >
                            {{ card1.tag }}
                        </span>
                        <h3 class="text-secondary text-lg leading-snug font-extrabold md:text-2xl">
                            {{ card1.title }}
                        </h3>
                        <p class="text-default/70 text-sm leading-snug font-medium md:text-base">
                            {{ card1.desc }}
                        </p>
                    </div>

                    <div class="bg-default flex flex-col gap-2 rounded-sm p-4">
                        <span
                            class="text-default/50 text-xs font-semibold tracking-wider uppercase"
                        >
                            {{ card2.tag }}
                        </span>
                        <h3 class="text-secondary text-lg leading-snug font-extrabold md:text-2xl">
                            {{ card2.title }}
                        </h3>
                        <p class="text-default/70 text-sm leading-snug font-medium md:text-base">
                            {{ card2.desc }}
                        </p>
                    </div>

                    <div class="bg-default flex flex-col gap-2 rounded-sm p-4 lg:col-span-2">
                        <span
                            class="text-default/50 text-xs font-semibold tracking-wider uppercase"
                        >
                            {{ card3.tag }}
                        </span>
                        <h3 class="text-secondary text-lg leading-snug font-extrabold md:text-2xl">
                            {{ card3.title }}
                        </h3>
                        <p class="text-default/70 text-sm leading-snug font-medium md:text-base">
                            {{ card3.desc }}
                        </p>
                    </div>
                </div>
            </div>
        </UContainer>
    </section>
</template>
