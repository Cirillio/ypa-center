<script lang="ts" setup>
import type { Teacher } from "~/types"

defineProps<{
    teacher: Teacher
}>()
</script>

<template>
    <article
        class="group flex gap-4 overflow-hidden rounded-md bg-white p-4 transition-all duration-300 max-md:flex-col md:gap-6"
    >
        <!-- Фото -->
        <div class="w-full overflow-hidden rounded-md max-md:h-76 md:aspect-4/5 md:w-76">
            <AppPhoto
                :src="teacher.photo_url ?? ''"
                :alt="teacher.full_name"
                class="object-cover object-center"
            />
        </div>

        <!-- Контент -->
        <div class="flex flex-1 flex-col gap-2 py-2 md:gap-4">
            <div class="flex flex-col gap-2">
                <h3 class="text-secondary text-2xl leading-tight font-extrabold sm:text-3xl">
                    {{ teacher.full_name }}
                </h3>

                <!-- Направления -->
                <div
                    v-if="teacher.activities.length"
                    class="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
                >
                    <UBadge
                        v-for="activity in teacher.activities"
                        :key="activity.id"
                        variant="soft"
                        color="neutral"
                        size="lg"
                        class="bg-default shrink-0 font-semibold"
                    >
                        {{ activity.name }}
                    </UBadge>
                </div>
            </div>

            <blockquote
                class="border-primary/30 text-primary before:text-primary/30 after:text-primary/30 border-l-2 pl-3 text-base font-semibold italic before:text-xl before:content-['«'] after:text-xl after:content-['»'] md:text-lg"
            >
                {{ teacher.quote }}
            </blockquote>
            <p
                class="text-default/85 text-base leading-relaxed font-semibold md:line-clamp-7 md:text-lg"
            >
                {{ teacher.bio }}
            </p>
        </div>
    </article>
</template>
