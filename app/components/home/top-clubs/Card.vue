<template>
    <article
        class="hover:ring-primary focus-visible:outline-primary group relative flex flex-col overflow-hidden rounded-lg bg-white ring-2 ring-transparent transition-all duration-150"
    >
        <!-- Image -->
        <div class="relative h-3/5 min-h-0 overflow-hidden rounded-md">
            <AppPhoto
                :src="img"
                :class="'object-cover object-center duration-500 group-hover:scale-105'"
                :alt="'Кружок_' + title"
            />
        </div>

        <!-- Content -->
        <div class="text-default flex flex-1 flex-col items-start gap-2 p-4">
            <h4
                class="group-hover:text-primary text-secondary text-2xl font-bold transition xl:text-4xl"
            >
                {{ title }}
            </h4>
            <p class="text-default/65 text-sm leading-snug font-medium md:text-xl">
                {{ shortDesc }}
            </p>
        </div>
    </article>
</template>

<script lang="ts" setup>
import type { ClubShort } from "~/types"

defineProps<ClubShort>()
</script>

<style></style>
