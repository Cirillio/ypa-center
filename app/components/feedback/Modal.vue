<script lang="ts" setup>
/**
 * Кнопка «Написать нам» + модалка с формой обратной связи.
 * Самодостаточный компонент — подключается одной строкой в любом месте сайта.
 */
const isOpen = ref(false)
</script>

<template>
    <UButton
        label="Написать нам"
        variant="soft"
        class="w-fit"
        leading-icon="ph:envelope-simple-bold"
        @click="void (isOpen = true)"
    />

    <UModal
        v-model:open="isOpen"
        title="Написать нам"
        description="Задайте вопрос или оставьте сообщение — ответим на почту."
        :ui="{
            content: 'ring-0 overflow-hidden divide-none shadow-none rounded-sm',
            overlay: 'bg-black/25 backdrop-blur-xs'
        }"
        :close="{
            color: 'primary',
            variant: 'soft',
            class: 'aspect-square p-1.5! *:size-4'
        }"
        close-icon="ph:x-bold"
    >
        <template #body>
            <FeedbackForm @success="isOpen = false" />
        </template>
    </UModal>
</template>
