<script lang="ts" setup>
// Главная кнопка сводки: заблокирована, пока не выбрано всё нужное, и подсказывает, чего не хватает.
withDefaults(
    defineProps<{
        ready: boolean
        label?: string
        icon?: string
        missing: string[]
    }>(),
    {
        label: "Продолжить",
        icon: "ph:arrow-right-bold"
    }
)

const emit = defineEmits<{
    continue: []
}>()
</script>

<template>
    <div class="flex flex-col gap-2">
        <UButton
            :label="label"
            :trailing-icon="icon"
            :disabled="!ready"
            :color="ready ? 'primary' : 'neutral'"
            :variant="ready ? 'solid' : 'soft'"
            size="xl"
            block
            class="text-lg font-bold"
            :ui="{ trailingIcon: 'size-5' }"
            @click="emit('continue')"
        />
        <p v-if="!ready && missing.length" class="text-muted text-center text-xs">
            Осталось выбрать: {{ missing.join(", ") }}
        </p>
    </div>
</template>
