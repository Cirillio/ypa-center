<script lang="ts" setup>
import type { MeSubscription } from "~/types"

defineProps<{
    subscriptions?: MeSubscription[]
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
            <template v-if="subscriptions.length > 0">
                <MeSubscribitionCard v-for="sub in subscriptions" :key="sub.id" :sub="sub" />
            </template>
            <p v-else class="text-default/50 py-4 text-sm italic">
                У вас пока нет оформленных абонементов
            </p>
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
