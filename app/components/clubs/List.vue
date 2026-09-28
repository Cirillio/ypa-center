<script lang="ts" setup>
import type { Activity } from "~/types"

// Каталог кружков; при сбое API вместо пустоты – ошибка с повтором, при пустом ответе – пояснение.
defineProps<{
    activities: Activity[]
    error?: unknown
    retrying?: boolean
}>()

const emit = defineEmits<{
    retry: []
}>()

const { contactInfo } = useAppConfig()
</script>

<template>
    <section class="bg-default relative z-10 flex w-full py-12 md:py-20 lg:py-24">
        <UContainer class="flex w-full flex-col gap-6 md:gap-8">
            <!-- Заголовок -->
            <h2
                class="text-secondary text-4xl leading-[0.9] font-extrabold lg:text-5xl xl:text-6xl"
            >
                Все <span class="text-primary">кружки</span>
            </h2>

            <UiErrorState
                v-if="error && !activities.length"
                size="lg"
                message="Не удалось загрузить список кружков."
                :retrying="retrying"
                @retry="emit('retry')"
            />

            <UiEmptyState
                v-else-if="!activities.length"
                icon="ph:shapes-duotone"
                title="Скоро откроем набор"
                description="Сейчас формируем группы на новый сезон. Позвоните – расскажем, что планируется."
            >
                <UButton
                    :href="`tel:${contactInfo.phoneTo}`"
                    variant="soft"
                    leading-icon="ph:phone-bold"
                    :label="contactInfo.phone"
                    size="lg"
                />
            </UiEmptyState>

            <!-- Список кружков -->
            <div v-else class="grid w-full gap-4">
                <LazyClubsCard
                    v-for="(item, i) in activities"
                    :key="item.id"
                    :activity="item"
                    :index="i"
                />
            </div>
            <!-- Приписка -->
            <span v-if="activities.length" class="text-default/95 text-xs font-semibold md:text-sm"
                >• Узнать какие учителя занимаются направлениями можно на
                <NuxtLink to="/teachers" class="text-primary">странице учителей</NuxtLink>.</span
            >
        </UContainer>
    </section>
</template>
