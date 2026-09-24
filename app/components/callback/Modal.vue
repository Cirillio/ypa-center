<script lang="ts" setup>
defineProps<{
    time: string
}>()

const open = defineModel<boolean>()

const emit = defineEmits<{
    close: []
}>()
</script>

<template>
    <!-- Модальное окно подтверждения успешной отправки -->
    <UModal
        v-model:open="open"
        :ui="{
            content: 'ring-0 overflow-hidden shadow-none rounded-sm',
            overlay: 'bg-black/25 backdrop-blur-xs'
        }"
    >
        <template #content>
            <div class="relative flex flex-col items-start space-y-1 p-4">
                <UIcon
                    name="ph:sun-duotone"
                    class="text-primary absolute -right-8 -bottom-16 size-32 leading-tight opacity-50"
                />
                <span class="text-primary text-2xl leading-tight font-bold">
                    Спасибо. <br />
                    Мы скоро перезвоним!
                </span>
                <span class="text-default/95 text-lg font-semibold">
                    Выбранное время: {{ time }}
                </span>
                <UButton
                    class="mt-3 text-base"
                    size="sm"
                    variant="soft"
                    label="Закрыть"
                    @click="emit('close')"
                />
            </div>
        </template>
    </UModal>
</template>
