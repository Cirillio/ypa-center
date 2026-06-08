<script lang="ts" setup>
const { stats, pricing } = useAppConfig()

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

const AUDIENCE_CARDS = [
    {
        tag: "5–7 лет",
        icon: "ph:shooting-star-duotone",
        accent: "border-amber-400",
        iconColor: "text-amber-400",
        title: "Дошкольники",
        desc: "До школы — не прописи, а фундамент. Программа ГДЕЁЖ учит читать через движение, считать через игру, говорить — без страха. К сентябрю ребёнок знает главное: учиться не страшно. Это стоит больше, чем выученный алфавит.",
        highlight: "Программа ГДЕЁЖ"
    },
    {
        tag: "7–14 лет",
        icon: "ph:student-duotone",
        accent: "border-emerald-400",
        iconColor: "text-emerald-500",
        title: "Школьники",
        desc: "Не репетитор — второй дом. Маленькие группы: педагог видит каждого. Кружок мышления учит задавать правильные вопросы. Английский — через живой диалог, без зубрёжки. Умная продлёнка: домашка сделана, настолки в ходу, день прожит с пользой.",
        highlight: "Кружок мышления · Английский · Продлёнка"
    },
    {
        tag: "Для родителей",
        icon: "ph:users-duotone",
        accent: "border-cyan-400",
        iconColor: "text-cyan-500",
        title: "Осознанный выбор",
        desc: "Надежда — монтессори-практик, преподаватель СУНЦ НГУ. Яков — кандидат физмат. наук, 20 лет формирует мышление у детей. Здесь нет конвейера из сотни учеников. Есть внимание к каждому — и прогресс, который вы заметите сами.",
        highlight: "Педагоги с настоящей экспертизой"
    }
]
</script>

<template>
    <section class="relative z-10 flex w-full bg-white py-12 md:py-20 lg:py-24">
        <UContainer class="flex flex-col gap-10 md:gap-14">
            <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
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

                <div class="grid grid-cols-3 gap-2 md:gap-4 lg:shrink-0">
                    <div
                        v-for="stat in CENTER_STATS"
                        :key="stat.label"
                        class="bg-default flex flex-col items-center gap-2 rounded-sm px-5 py-4 text-center sm:px-3"
                    >
                        <UIcon :name="stat.icon" class="size-5 shrink-0" :class="stat.textColor" />
                        <span
                            class="text-secondary text-xl leading-none font-extrabold md:text-2xl"
                            >{{ stat.value }}</span
                        >
                        <span class="text-default/55 text-xs leading-tight font-medium">{{
                            stat.label
                        }}</span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div
                    v-for="card in AUDIENCE_CARDS"
                    :key="card.tag"
                    class="bg-default flex flex-col gap-4 rounded-sm border-t-4 p-6 lg:p-8"
                    :class="card.accent"
                >
                    <div class="flex items-center gap-2">
                        <UIcon :name="card.icon" class="size-5 shrink-0" :class="card.iconColor" />
                        <span
                            class="text-default/50 text-xs font-semibold tracking-wider uppercase"
                        >
                            {{ card.tag }}
                        </span>
                    </div>
                    <h3 class="text-secondary text-2xl leading-snug font-extrabold lg:text-3xl">
                        {{ card.title }}
                    </h3>
                    <p
                        class="text-default/70 grow text-sm leading-relaxed font-medium md:text-base"
                    >
                        {{ card.desc }}
                    </p>
                    <span
                        class="text-default/40 mt-auto text-xs font-semibold tracking-wide uppercase"
                    >
                        {{ card.highlight }}
                    </span>
                </div>
            </div>
        </UContainer>
    </section>
</template>
