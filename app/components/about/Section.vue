<script lang="ts" setup>
import { CENTER_STATS } from "~/constants/content"
</script>

<template>
    <section
        class="relative z-10 flex w-full overflow-hidden pt-[calc(var(--header-height)+3rem)] pb-16 md:pt-40 md:pb-24"
    >
        <UContainer class="relative z-10 flex flex-col gap-8">
            <SectionLeading subtitle="О нашем центре" center>
                <template #title>
                    <span class="text-secondary">
                        Место, где дети<br />
                        <span class="text-primary">раскрываются</span>
                    </span>
                </template>
                <template #description>
                    «Улица Радости» — центр умного развития, где уютная атмосфера и внимательные
                    педагоги помогают каждому ребёнку найти своё призвание.
                </template>
            </SectionLeading>

            <!-- Статы -->
            <div class="flex flex-wrap gap-3">
                <div
                    v-for="stat in CENTER_STATS"
                    :key="stat.label"
                    class="flex items-center gap-2.5 rounded-lg bg-white/70 px-4 py-2.5 backdrop-blur-sm"
                >
                    <UIcon :name="stat.icon" class="size-5 shrink-0" :class="stat.textColor" />
                    <span class="text-secondary text-sm font-extrabold">{{ stat.value }}</span>
                    <span class="text-default/60 text-sm font-semibold">{{ stat.label }}</span>
                </div>
            </div>

            <FloatPromoCard
                to="/teachers"
                icon="ph:chalkboard-teacher-duotone"
                sublabel="Наша"
                label="Команда"
                description="Внимательные педагоги, которые любят своё дело."
            />

            <!-- CTA -->
            <UButton
                to="#map"
                trailing-icon="ph:map-pin-area-bold"
                label="Найти нас"
                color="secondary"
                size="xl"
                class="w-fit px-6 font-semibold md:text-xl"
            />
        </UContainer>
    </section>
</template>
