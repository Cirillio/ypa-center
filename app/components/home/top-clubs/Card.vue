<script lang="ts" setup>
import type { ActivityPopular } from "~/types"

defineProps<ActivityPopular>()
</script>

<template>
    <article
        class="focus-visible:outline-primary group relative flex flex-col overflow-hidden rounded-sm"
    >
        <!-- Image -->
        <div class="relative h-full min-h-0 overflow-hidden">
            <AppPhoto
                :src="cover_image ?? ''"
                :class="'object-cover object-center'"
                :alt="'Кружок — ' + name"
            />
            <!-- Scarcity badge -->
        </div>

        <div
            class="absolute bottom-0 z-0 h-full w-full bg-linear-to-t from-black/80 to-transparent"
        ></div>

        <!-- Content -->
        <div
            class="text-default absolute bottom-0 z-10 flex flex-col items-start gap-1 px-3 py-4 md:gap-2 md:p-4"
        >
            <h3 class="text-2xl font-bold text-white transition lg:text-3xl xl:text-4xl">
                {{ name }}
            </h3>
            <p class="text-base leading-snug font-medium text-balance text-white/90 md:text-xl">
                {{ short_description }}
            </p>
        </div>
    </article>
</template>

<style></style>
