<script lang="ts" setup>
const appConfig = useAppConfig()
const email = appConfig.contactInfo.email

interface OtherService {
    icon: string
    name: string
    description: string
}

const services: OtherService[] = [
    {
        icon: "ph:house-simple-duotone",
        name: "Продлёнка",
        description:
            "Ребёнок под присмотром до 20:00: помощь с домашним заданием, питание и время для игр. Спокойный вечер для родителей — без лишних договорённостей."
    },
    {
        icon: "ph:books-duotone",
        name: "Подготовка к школе",
        description:
            "Программа ГДЕЁЖ для детей от 5 лет. Буквы и цифры — через игру, движение и живой разговор. К первому классу — уверенно и с интересом к учёбе."
    },
    {
        icon: "ph:pencil-ruler-duotone",
        name: "Репетиторство",
        description:
            "Индивидуальные занятия по школьным предметам с педагогами, которые умеют объяснять. Без зубрёжки — с пониманием."
    }
]
</script>

<template>
    <section class="bg-default z-10 flex w-full overflow-hidden py-12 md:py-20 lg:py-24">
        <UContainer class="relative z-10 flex flex-col gap-10 md:gap-12">
            <!-- Заголовок -->
            <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <SectionLeading subtitle="Также у нас есть" icon="ph:squares-four-duotone">
                    <template #title>
                        <span class="text-secondary">
                            Другие услуги<br />
                            <span class="text-primary">центра</span>
                        </span>
                    </template>
                    <template #description>
                        Некоторые направления доступны только по предварительной записи — позвоните
                        нам, и мы подберём удобное время.
                    </template>
                </SectionLeading>

                <!-- Телефон -->
                <a
                    :href="`mailto:${email}`"
                    class="hover:ring-primary group flex w-fit shrink-0 items-center gap-3 rounded-sm bg-white p-4 transition-all duration-200 hover:ring-2 md:self-auto"
                >
                    <div
                        class="bg-primary/10 group-hover:bg-primary/20 flex size-10 items-center justify-center rounded-full transition-colors"
                    >
                        <UIcon name="ph:mailbox-duotone" class="text-primary size-5" />
                    </div>
                    <div class="flex flex-col">
                        <span class="text-default/75 text-xs font-semibold"
                            >Запись по телефону или по почте:</span
                        >
                        <span class="text-default font-extrabold md:text-xl">{{ email }}</span>
                    </div>
                </a>
            </div>

            <UCarousel
                v-slot="{ item }"
                :items="services"
                :ui="{
                    container: 'ms-0 gap-4 items-stretch',
                    item: 'sm:basis-[40%] basis-[80%] ps-0  min-h-full select-none cursor-pointer'
                }"
            >
                <div class="flex h-full flex-col gap-4 rounded-sm bg-white p-5 lg:p-6">
                    <UIcon :name="item.icon" class="text-primary/70 size-8" />
                    <div class="flex flex-col gap-2">
                        <span class="text-secondary text-xl font-extrabold">{{ item.name }}</span>
                        <span
                            class="text-default/65 text-sm leading-relaxed font-medium md:text-base"
                            >{{ item.description }}</span
                        >
                    </div>
                </div>
            </UCarousel>
        </UContainer>
    </section>
</template>
