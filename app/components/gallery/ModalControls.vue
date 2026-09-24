<script lang="ts" setup>
// Панель управления модалки галереи: подпись и кнопки листания/закрытия, состояние держит родитель.
defineProps<{
    alt?: string
    hasPrev: boolean
    hasNext: boolean
}>()

const emit = defineEmits<{
    prev: []
    next: []
    close: []
}>()
</script>

<template>
    <div class="controls-root flex shrink-0 items-center justify-between px-4 py-3">
        <span class="truncate font-semibold">{{ alt }}</span>

        <div class="flex items-center gap-1">
            <UButton
                v-if="hasPrev"
                icon="ph:arrow-left-bold"
                color="secondary"
                class="aspect-square rounded-full"
                size="md"
                aria-label="Предыдущее фото"
                @click="emit('prev')"
            />
            <UButton
                v-if="hasNext"
                icon="ph:arrow-right-bold"
                color="secondary"
                class="aspect-square rounded-full"
                size="md"
                aria-label="Следующее фото"
                @click="emit('next')"
            />
            <UButton
                icon="ph:x-bold"
                color="error"
                variant="soft"
                size="md"
                class="aspect-square rounded-full"
                aria-label="Закрыть"
                @click="emit('close')"
            />
        </div>
    </div>
</template>

<style scoped>
.controls-root {
    padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
}
</style>
