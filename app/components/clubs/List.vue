<script lang="ts" setup>
import type { Activity } from "~/types"

// Каталог кружков; скелетон при первой загрузке, ошибка с повтором при сбое API, пояснение при пустом ответе.
defineProps<{
    activities: Activity[]
    error?: unknown
    pending?: boolean
}>()

const emit = defineEmits<{
    retry: []
}>()

const { contactInfo } = useAppConfig()

const SKELETON_KEYS = ["clubs-sk-1", "clubs-sk-2", "clubs-sk-3"] as const
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

            <div v-if="pending && !activities.length" class="grid w-full gap-4" aria-busy="true">
                <USkeleton
                    v-for="skeletonKey in SKELETON_KEYS"
                    :key="skeletonKey"
                    class="h-220 w-full rounded-sm md:h-120 lg:h-128"
                />
            </div>

            <UiErrorState
                v-else-if="error && !activities.length"
                size="lg"
                message="Не удалось загрузить список кружков."
                :retrying="pending"
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
                <ClubsCard
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
