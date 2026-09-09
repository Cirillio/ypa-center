<script lang="ts" setup>
import type { StatusSubscription } from "~/types/status"

defineProps<{
    subscriptions?: StatusSubscription[]
    isProcessing: boolean
}>()
</script>

<template>
    <section class="flex flex-col gap-4">
        <div class="flex items-center gap-3">
            <div
                class="bg-primary/5 text-primary flex items-center justify-center rounded-full p-2"
            >
                <UIcon name="ph:star-bold" class="size-5" />
            </div>
            <h2 class="text-primary text-xl font-bold">Абонементы</h2>
        </div>
        <template v-if="subscriptions">
            <MeSubscribitionCard v-for="sub in subscriptions" :key="sub.id" v-bind="sub" />
        </template>
        <template v-else>
            <div
                v-for="i in 2"
                :key="i"
                class="h-48 w-full rounded-lg"
                :class="isProcessing ? 'bg-secondary/10 animate-pulse' : 'bg-mauve-500/5'"
            />
        </template>
    </section>
</template>
