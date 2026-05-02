<script lang="ts" setup>
import type { StatusChild } from "~/types/status"

defineProps<{
    children?: readonly StatusChild[]
    isProcessing: boolean
}>()
</script>

<template>
    <section class="flex flex-col gap-2">
        <div class="flex items-center gap-4">
            <div
                class="bg-primary/5 text-primary flex items-center justify-center rounded-full p-2.5"
            >
                <UIcon name="ph:baby-bold" class="size-6" />
            </div>
            <span class="text-default text-xl leading-tight font-semibold">Дети</span>
        </div>
        <div class="grid grid-cols-2 gap-4">
            <template v-if="children">
                <div
                    v-for="(participant, i) in children"
                    :key="i"
                    class="bg-secondary/5 flex flex-col rounded-lg px-6 py-4"
                >
                    <span class="text-secondary text-lg leading-tight font-semibold">
                        {{ participant.name }}
                    </span>
                    <span class="text-default/75 text-sm">{{ participant.birthdate }}</span>
                </div>
            </template>
            <template v-else>
                <div
                    v-for="i in 2"
                    :key="i"
                    class="flex flex-col gap-2 rounded-lg px-6 py-4"
                    :class="isProcessing ? 'bg-secondary/10' : 'bg-mauve-500/5'"
                >
                    <div
                        class="h-6 w-3/4 rounded-md"
                        :class="isProcessing ? 'bg-secondary/20 animate-pulse' : 'bg-mauve-500/10'"
                    />
                    <div
                        class="h-4 w-1/2 rounded-md"
                        :class="isProcessing ? 'bg-secondary/20 animate-pulse' : 'bg-mauve-500/10'"
                    />
                </div>
            </template>
        </div>
    </section>
</template>
