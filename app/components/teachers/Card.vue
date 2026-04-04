<script lang="ts" setup>
import type { Teacher } from "~/types"

defineProps<{
    teacher: Teacher
}>()
</script>

<template>
    <article
        class="group hover:ring-primary flex gap-4 overflow-hidden rounded-lg bg-white p-4 ring-2 ring-transparent transition-all duration-300"
    >
        <!-- Фото -->
        <div class="aspect-4/5 w-68 overflow-hidden rounded-md">
            <AppPhoto :src="teacher.photo" :alt="teacher.name" class="object-cover object-center" />
        </div>

        <!-- Контент -->
        <div class="flex flex-1 flex-col gap-4">
            <UBadge
                :label="teacher.role"
                color="secondary"
                variant="soft"
                size="xl"
                class="mt-2 w-fit text-lg font-semibold"
            />
            <h3 class="text-secondary text-3xl leading-tight font-extrabold">
                {{ teacher.name }}
            </h3>
            <p class="text-default/60 line-clamp-6 text-lg leading-relaxed font-semibold">
                {{ teacher.description }}
            </p>
        </div>
    </article>
</template>
