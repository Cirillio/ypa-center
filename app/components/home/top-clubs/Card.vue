<script lang="ts" setup>
import type { ClubShort } from "~/types"

const props = defineProps<ClubShort>()

const scarce = computed(() => props.spotsAvailable !== undefined && props.spotsAvailable <= 3)
</script>

<template>
    <article
        class="focus-visible:outline-primary group bg-default relative flex flex-col overflow-hidden rounded-md"
    >
        <!-- Image -->
        <div class="relative h-3/5 min-h-0 overflow-hidden rounded-md">
            <AppPhoto :src="img" :class="'object-cover object-center'" :alt="'Кружок — ' + title" />
            <!-- Scarcity badge -->
        </div>

        <!-- Content -->
        <div class="text-default flex flex-1 flex-col items-start gap-1 px-4 py-2 md:gap-2 md:p-4">
            <h3
                class="group-hover:text-primary text-secondary text-3xl font-bold transition xl:text-4xl"
            >
                {{ title }}
            </h3>
            <p class="text-default/90 text-base leading-snug font-medium md:text-xl">
                {{ shortDesc }}
            </p>

            <div v-if="scarce" class="flex items-center gap-1">
                <UIcon name="ph:dot-duotone" class="text-primary size-6 animate-pulse" />
                <span class="text-secondary/85 mt-0.5 text-sm font-bold">
                    Осталось {{ spotsAvailable }} {{ spotsAvailable === 1 ? "место" : "места" }}
                </span>
            </div>
        </div>
    </article>
</template>

<style></style>
