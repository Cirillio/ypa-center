<script lang="ts" setup>
import type { ClubShort } from "~/types"

defineProps<ClubShort>()
</script>

<template>
    <article
        class="focus-visible:outline-primary group relative flex flex-col overflow-hidden rounded-sm"
    >
        <!-- Image -->
        <div class="relative h-full min-h-0 overflow-hidden">
            <AppPhoto :src="img" :class="'object-cover object-center'" :alt="'Кружок — ' + title" />
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
                {{ title }}
            </h3>
            <p class="text-base leading-snug font-medium text-balance text-white/90 md:text-xl">
                {{ shortDesc }}
            </p>
        </div>
    </article>
</template>

<style></style>
