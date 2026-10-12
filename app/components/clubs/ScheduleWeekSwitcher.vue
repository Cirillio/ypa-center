<script lang="ts" setup>
// Переключатель недели для просмотра расписания каталога кружков.
defineProps<{
    label: string
    canPrev: boolean
    canNext: boolean
}>()

const emit = defineEmits<{
    prev: []
    next: []
}>()
</script>

<template>
    <div
        role="group"
        aria-label="Переключение недели расписания"
        class="bg-default flex items-center gap-1 rounded-full p-1"
    >
        <button
            type="button"
            :disabled="!canPrev"
            aria-label="Предыдущая неделя"
            class="flex size-8 items-center justify-center rounded-full transition-colors"
            :class="
                !canPrev
                    ? 'text-muted cursor-not-allowed opacity-50'
                    : 'text-default cursor-pointer hover:bg-white'
            "
            @click="emit('prev')"
        >
            <UIcon name="ph:caret-left-bold" class="size-4 shrink-0" aria-hidden="true" />
        </button>

        <span class="text-default min-w-32 px-1 text-center text-sm font-bold">
            {{ label }}
        </span>

        <button
            type="button"
            :disabled="!canNext"
            aria-label="Следующая неделя"
            class="flex size-8 items-center justify-center rounded-full transition-colors"
            :class="
                !canNext
                    ? 'text-muted cursor-not-allowed opacity-50'
                    : 'text-default cursor-pointer hover:bg-white'
            "
            @click="emit('next')"
        >
            <UIcon name="ph:caret-right-bold" class="size-4 shrink-0" aria-hidden="true" />
        </button>
    </div>
</template>
