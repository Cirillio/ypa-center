<script lang="ts" setup>
import type { Teacher } from "~/types"

// Сетка педагогов: скелетон первой загрузки, ошибка с повтором, пустой список.
defineProps<{
    teachers: Teacher[]
    pending?: boolean
    error?: boolean
}>()

const emit = defineEmits<{
    retry: []
}>()
</script>

<template>
    <UContainer class="pb-20">
        <!-- Скелетон -->
        <div v-if="pending && !teachers.length" class="grid grid-cols-1 gap-6">
            <div
                v-for="i in 4"
                :key="i"
                class="bg-primary/10 aspect-square animate-pulse rounded-xl"
            />
        </div>

        <!-- Ошибка -->
        <UiErrorState
            v-else-if="error && !teachers.length"
            size="lg"
            message="Не удалось загрузить список педагогов."
            :retrying="pending"
            @retry="emit('retry')"
        />

        <UiEmptyState
            v-else-if="!teachers.length"
            icon="ph:chalkboard-teacher-duotone"
            title="Скоро познакомим с педагогами"
            description="Страница обновляется – загляните чуть позже."
        />

        <!-- Сетка -->
        <div v-else class="grid grid-cols-1 gap-4">
            <TeachersCard v-for="teacher in teachers" :key="teacher.id" :teacher="teacher" />
        </div>
    </UContainer>
</template>
