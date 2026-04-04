<script lang="ts" setup>
import type { Teacher } from "~/types"

defineProps<{
    teacher: Teacher
}>()
</script>

<template>
    <article
        class="group hover:ring-primary flex gap-4 overflow-hidden rounded-md bg-white p-4 ring-2 ring-transparent transition-all duration-300 max-md:flex-col"
    >
        <!-- Фото -->
        <div class="w-full overflow-hidden rounded-md max-md:h-76 md:aspect-4/5 md:w-68">
            <AppPhoto :src="teacher.photo" :alt="teacher.name" class="object-cover object-center" />
        </div>

        <!-- Контент -->
        <div class="flex flex-1 flex-col gap-2 md:gap-4">
            <UBadge
                :label="teacher.role"
                color="secondary"
                variant="soft"
                size="xl"
                class="mt-2 w-fit text-sm font-semibold md:text-lg"
            />
            <h3 class="text-secondary text-2xl leading-tight font-extrabold sm:text-3xl">
                {{ teacher.name }}
            </h3>
            <p
                class="text-default/60 line-clamp-6 text-base leading-relaxed font-semibold md:text-lg"
            >
                {{ teacher.description }}
            </p>
        </div>
    </article>
</template>
