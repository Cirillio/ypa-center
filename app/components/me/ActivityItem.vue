<script lang="ts" setup>
defineProps<{
    title: string
    desc?: string
    datetime: string
    isActive: boolean
}>()
</script>

<template>
    <div class="flex gap-3" :class="{ 'opacity-75': !isActive }">
        <!-- Индикатор активности -->
        <div
            class="w-1 shrink-0 self-stretch rounded-full"
            :class="isActive ? 'bg-secondary/50 animate-pulse' : 'bg-black/25'"
        ></div>

        <div class="flex min-w-0 flex-1 flex-col gap-1">
            <span class="text-default line-clamp-1 text-base leading-tight font-semibold">
                {{ title }}
            </span>
            <span v-if="desc" class="text-default/75 line-clamp-1 text-sm leading-tight">
                {{ desc }}
            </span>

            <div class="mt-0.5 flex items-center justify-between gap-2">
                <span class="text-default/75 line-clamp-1 text-sm leading-tight">
                    {{ datetime }}
                </span>
                <div v-if="$slots.trailing" class="shrink-0 leading-tight">
                    <slot name="trailing" />
                </div>
            </div>
        </div>
    </div>
</template>
