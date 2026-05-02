<script lang="ts" setup>
import type { StatusSubscription } from "~/types/status"

defineProps<{
    subscriptions?: StatusSubscription[]
    isProcessing: boolean
}>()
</script>

<template>
    <section class="flex flex-col gap-4">
        <h2 class="text-primary ml-4 text-xl font-bold">Наши абонементы</h2>
        <template v-if="subscriptions">
            <MyStatusSubscribitionCard v-for="sub in subscriptions" :key="sub.id" v-bind="sub" />
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
