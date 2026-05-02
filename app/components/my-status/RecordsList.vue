<script lang="ts" setup>
import type { StatusTrial, StatusEvent } from "~/types/status"

type Record = (StatusTrial & { type: "trial" }) | (StatusEvent & { type: "event" })

defineProps<{
    records?: Record[]
    isProcessing: boolean
}>()
</script>

<template>
    <section class="flex flex-col gap-4">
        <h2 class="text-primary ml-4 text-xl font-bold">Наши записи</h2>
        <template v-if="records">
            <template v-for="record in records" :key="record.id">
                <MyStatusTrialCard v-if="record.type === 'trial'" v-bind="record" />
                <MyStatusEventCard v-else-if="record.type === 'event'" v-bind="record" />
            </template>
        </template>
        <template v-else>
            <div
                v-for="i in 3"
                :key="i"
                class="h-32 w-full rounded-lg"
                :class="isProcessing ? 'bg-secondary/10 animate-pulse' : 'bg-mauve-500/5'"
            />
        </template>
    </section>
</template>
