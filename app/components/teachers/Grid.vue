<script lang="ts" setup>
import type { Teacher } from "~/types"

defineProps<{
    teachers: Teacher[]
    pending?: boolean
    error?: boolean
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
        <div
            v-else-if="error && !teachers.length"
            class="flex flex-col items-center justify-center py-20 text-center"
        >
            <UIcon
                name="ph:user-circle-dashed-duotone"
                class="text-secondary mb-4 size-16 opacity-20"
            />
            <p class="text-secondary/60 text-lg">
                Не удалось загрузить список педагогов. Попробуйте позже.
            </p>
        </div>

        <!-- Сетка -->
        <div v-else class="grid grid-cols-1 gap-4">
            <TeachersCard v-for="teacher in teachers" :key="teacher.id" :teacher="teacher" />
        </div>
    </UContainer>
</template>
