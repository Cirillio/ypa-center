<script lang="ts" setup>
defineProps<{
    title: string
    desc?: string
    datetime: string
    isActive: boolean
}>()
</script>

<template>
    <div class="flex gap-4" :class="{ 'opacity-75': !isActive }">
        <!-- Indicator Dot -->
        <div
            class="relative my-auto flex h-10 min-h-0 w-1 min-w-0 shrink-0"
            :class="isActive ? 'bg-secondary/50 animate-pulse' : 'bg-black/25'"
        ></div>

        <!-- Content -->
        <div class="grid flex-1">
            <span class="text-default line-clamp-1 text-lg leading-tight font-medium">
                {{ title }}
            </span>
            <span v-if="desc" class="text-default/75 line-clamp-1 text-sm leading-tight">
                {{ desc }}
            </span>
        </div>

        <span class="text-default/75 mt-auto line-clamp-1 text-base leading-tight">
            {{ datetime }}
        </span>

        <!-- Trailing Slot -->
        <div v-if="$slots.trailing" class="mt-auto leading-tight">
            <slot name="trailing" />
        </div>
    </div>
</template>
