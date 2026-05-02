<script lang="ts" setup>
defineProps<{
    title: string
    desc?: string
    datetime: string
    isActive: boolean
}>()
</script>

<template>
    <div class="flex items-center gap-4" :class="{ 'opacity-75': !isActive }">
        <!-- Indicator Dot -->
        <div
            class="relative flex aspect-square size-5 min-h-0 min-w-0 shrink-0 items-center justify-center rounded-full"
            :class="
                isActive
                    ? 'bg-secondary/5 text-secondary animate-pulse'
                    : 'bg-default/10 text-default/25'
            "
        >
            <div
                class="absolute top-1/2 left-1/2 flex h-full w-full -translate-1/2 items-center justify-center text-center text-xl leading-[0.025rem]"
            >
                •
            </div>
        </div>

        <!-- Content -->
        <div class="grid flex-1">
            <span class="text-default line-clamp-1 text-lg leading-tight font-medium">
                {{ title }}
            </span>
            <span v-if="desc" class="text-default/75 line-clamp-1 text-sm leading-tight">
                {{ desc }}
            </span>
            <span class="text-default/75 line-clamp-1 text-sm leading-tight">
                {{ datetime }}
            </span>
        </div>

        <!-- Trailing Slot -->
        <div v-if="$slots.trailing" class="shrink-0">
            <slot name="trailing" />
        </div>
    </div>
</template>
