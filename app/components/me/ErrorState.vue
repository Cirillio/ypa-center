<script lang="ts" setup>
defineProps<{
    message: string
}>()

const emit = defineEmits<{
    retry: []
}>()
</script>

<template>
    <div class="flex flex-col items-center gap-3 py-8 text-center">
        <UIcon name="ph:warning-circle-duotone" class="text-secondary size-12 opacity-20" />
        <p class="text-secondary/60 text-sm">{{ message }} Попробуйте ещё раз.</p>
        <UButton variant="soft" size="sm" label="Повторить" @click="emit('retry')" />
    </div>
</template>
