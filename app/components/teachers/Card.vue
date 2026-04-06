<script lang="ts" setup>
import type { Teacher } from "~/types"

defineProps<{
    teacher: Teacher
}>()
</script>

<template>
    <article
        class="group hover:ring-primary flex gap-4 overflow-hidden rounded-md bg-white p-4 ring-2 ring-transparent transition-all duration-300 max-md:flex-col md:gap-6"
    >
        <!-- Фото -->
        <div class="w-full overflow-hidden rounded-md max-md:h-76 md:aspect-4/5 md:w-76">
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
            <blockquote
                class="border-primary/30 text-primary before:text-primary/30 after:text-primary/30 border-l-2 pl-3 text-base font-semibold italic before:text-xl before:content-['«'] after:text-xl after:content-['»'] md:text-lg"
            >
                {{ teacher.quote }}
            </blockquote>
            <p
                class="text-default/60 text-base leading-relaxed font-semibold md:line-clamp-7 md:text-lg"
            >
                {{ teacher.description }}
            </p>
        </div>
    </article>
</template>
