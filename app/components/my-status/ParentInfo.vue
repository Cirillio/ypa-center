<script lang="ts" setup>
import type { StatusParent } from "~/types/status"

defineProps<{
    parent?: StatusParent
    isProcessing: boolean
}>()
</script>

<template>
    <section class="flex items-center gap-4" aria-label="Информация о родителе">
        <div class="bg-primary/5 text-primary flex items-center justify-center rounded-full p-2.5">
            <UIcon name="ph:user-bold" class="size-6" />
        </div>
        <div class="grid w-full grid-cols-2 grid-rows-2 gap-y-1">
            <span class="text-default/75 text-sm leading-tight">Родитель</span>
            <template v-if="parent">
                <span class="col-start-1 row-start-2 truncate text-lg leading-tight font-semibold">
                    {{ parent.name }}
                </span>
                <span class="truncate text-lg leading-tight font-semibold">{{ parent.phone }}</span>
                <span class="truncate text-lg leading-tight font-semibold">{{ parent.email }}</span>
            </template>
            <template v-else>
                <div
                    class="col-start-1 row-start-2 h-6 w-48 rounded-md"
                    :class="isProcessing ? 'bg-secondary/20 animate-pulse' : 'bg-mauve-500/10'"
                />
                <div
                    class="h-6 w-32 rounded-md"
                    :class="isProcessing ? 'bg-secondary/20 animate-pulse' : 'bg-mauve-500/10'"
                />
                <div
                    class="h-6 w-40 rounded-md"
                    :class="isProcessing ? 'bg-secondary/20 animate-pulse' : 'bg-mauve-500/10'"
                />
            </template>
        </div>
    </section>
</template>
