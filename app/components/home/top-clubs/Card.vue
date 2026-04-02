<template>
    <NuxtLink
        :to="to"
        class="hover:ring-primary focus-visible:outline-primary group relative flex flex-col overflow-hidden rounded-lg bg-white ring-2 ring-transparent transition-all duration-150"
    >
        <!-- Image -->
        <div class="relative h-3/5 min-h-0 overflow-hidden rounded-md">
            <AppPhoto
                :src="img"
                :class="'duration-500 group-hover:scale-105'"
                :alt="'Кружок_' + title"
            />
        </div>

        <!-- Content -->
        <div class="text-default flex flex-1 flex-col items-start gap-2 p-4">
            <div class="flex w-full items-start justify-between gap-2">
                <h4
                    class="group-hover:text-primary text-secondary text-2xl font-bold transition xl:text-4xl"
                >
                    {{ title }}
                </h4>
                <UIcon
                    name="ph:arrow-up-right-bold"
                    class="text-default/25 group-hover:text-primary mt-1 size-5 shrink-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
            </div>
            <p class="text-default/65 text-sm leading-snug font-medium md:text-xl">
                {{ shortDesc }}
            </p>
        </div>
    </NuxtLink>
</template>

<script lang="ts" setup>
import type { ClubShort } from "~/types"

defineProps<ClubShort>()
</script>

<style></style>
