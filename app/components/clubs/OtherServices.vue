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
        description: "Присмотр и уход за детьми после школы до 20:00. Питание, помощь с уроками."
    },
    {
        icon: "ph:books-duotone",
        name: "Подготовка к школе",
        description: "Индивидуальные и групповые занятия для дошкольников от 5 лет."
    },
    {
        icon: "ph:pencil-ruler-duotone",
        name: "Репетиторство",
        description: "Индивидуальные занятия по школьным предметам с опытными педагогами."
    }
]
</script>

<template>
    <section class="relative z-10 flex w-full overflow-hidden bg-white py-12 md:py-16">
        <div
            class="bg-default absolute top-6 right-6 z-0 flex rounded-full p-2 opacity-60 xl:top-8 xl:right-auto xl:left-0 xl:-translate-x-1/2 xl:rounded-none xl:bg-transparent xl:p-0 xl:opacity-10"
        >
            <UIcon name="ph:sparkle-duotone" class="text-secondary size-10 xl:size-80" />
        </div>

        <UContainer class="relative z-10 flex flex-col gap-10 md:gap-12">
            <!-- Заголовок -->
            <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <SectionLeading subtitle="Также у нас есть">
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
                    class="group bg-default hover:ring-primary flex w-fit shrink-0 items-center gap-3 rounded-lg px-5 py-4 transition-all duration-200 hover:ring-2 md:self-auto"
                >
                    <div
                        class="bg-primary/10 group-hover:bg-primary/20 flex size-10 items-center justify-center rounded-full transition-colors"
                    >
                        <UIcon name="ph:mailbox-duotone" class="text-primary size-5" />
                    </div>
                    <div class="flex flex-col">
                        <span class="text-default/50 text-xs font-semibold"
                            >Запись по телефону или по почте:</span
                        >
                        <span class="text-default text-xl font-extrabold">{{ email }}</span>
                    </div>
                </a>
            </div>

            <!-- Сетка услуг -->
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div
                    v-for="service in services"
                    :key="service.name"
                    class="bg-default flex items-start gap-4 rounded-lg p-4"
                >
                    <div
                        class="flex size-10 shrink-0 items-center justify-center rounded-md bg-white"
                    >
                        <UIcon :name="service.icon" class="text-secondary size-5" />
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-default text-base font-bold">{{ service.name }}</span>
                        <span class="text-default/55 text-sm leading-snug font-medium">{{
                            service.description
                        }}</span>
                    </div>
                </div>
            </div>
        </UContainer>
    </section>
</template>
