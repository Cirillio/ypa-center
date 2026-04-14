<script lang="ts" setup>
import type { ClubShort } from "~/types"

defineProps<ClubShort>()
</script>

<template>
    <article
        class="focus-visible:outline-primary group relative flex flex-col overflow-hidden rounded-md bg-white"
    >
        <!-- Image -->
        <div class="relative h-3/5 min-h-0 overflow-hidden rounded-md">
            <AppPhoto :src="img" :class="'object-cover object-center'" :alt="'Кружок — ' + title" />
            <!-- Scarcity badge -->
        </div>

        <!-- Content -->
        <div
            class="text-default flex flex-1 flex-col items-start gap-1 px-3 py-2.5 md:gap-2 md:p-4"
        >
            <h3
                class="group-hover:text-primary text-secondary text-2xl font-bold transition lg:text-3xl xl:text-4xl"
            >
                {{ title }}
            </h3>
            <p class="text-default/90 text-base leading-snug font-medium md:text-xl">
                {{ shortDesc }}
            </p>
        </div>
    </article>
</template>

<style></style>
