<script lang="ts" setup>
defineProps<{
    alt?: string
    prev?: () => void
    next?: () => void
    close: () => void
}>()
</script>

<template>
    <div class="controls-root flex shrink-0 items-center justify-between px-4 py-3">
        <span class="truncate font-semibold">{{ alt }}</span>

        <div class="flex items-center gap-1">
            <UButton
                v-if="prev"
                icon="ph:arrow-left-bold"
                color="secondary"
                class="aspect-square rounded-full"
                size="md"
                @click="prev()"
            />
            <UButton
                v-if="next"
                icon="ph:arrow-right-bold"
                color="secondary"
                class="aspect-square rounded-full"
                size="md"
                @click="next()"
            />
            <UButton
                icon="ph:x-bold"
                color="error"
                variant="soft"
                size="md"
                class="aspect-square rounded-full"
                @click="close()"
            />
        </div>
    </div>
</template>

<style scoped>
.controls-root {
    padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
}
</style>
