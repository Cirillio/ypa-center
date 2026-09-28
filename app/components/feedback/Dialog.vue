<script lang="ts" setup>
// Модалка обратной связи целиком: грузится одним ленивым чанком из FeedbackModal, форма внутри – статически
const isOpen = defineModel<boolean>("open", { required: true })
</script>

<template>
    <UModal
        v-model:open="isOpen"
        title="Написать нам"
        description="Задайте вопрос или оставьте сообщение – ответим на почту."
        :ui="{
            content: 'ring-0 overflow-hidden divide-none shadow-none rounded-sm',
            overlay: 'bg-black/25'
        }"
        :close="{
            color: 'primary',
            variant: 'soft',
            class: 'aspect-square p-1.5! *:size-4'
        }"
        close-icon="ph:x-bold"
    >
        <template #body>
            <FeedbackForm @success="void (isOpen = false)" />
        </template>
    </UModal>
</template>
