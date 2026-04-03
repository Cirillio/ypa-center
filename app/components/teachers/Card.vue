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
        <div class="aspect-square size-60 overflow-hidden rounded-md">
            <AppPhoto :src="teacher.photo" :alt="teacher.name" class="object-cover object-center" />
        </div>

        <!-- Контент -->
        <div class="flex flex-1 flex-col gap-2">
            <UBadge
                :label="teacher.role"
                color="secondary"
                variant="soft"
                size="lg"
                class="w-fit font-semibold"
            />
            <h3 class="text-secondary text-2xl leading-tight font-extrabold">
                {{ teacher.name }}
            </h3>
            <p class="text-default/60 line-clamp-6 text-base leading-relaxed font-semibold">
                {{ teacher.description }}
            </p>
        </div>
    </article>
</template>
