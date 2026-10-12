<script lang="ts" setup>
// Пустой список: иконка, заголовок, пояснение и необязательное действие в слоте.
defineProps<{
    icon: string
    title: string
    description?: string
}>()
</script>

<template>
    <div class="flex flex-col items-center gap-4 px-6 py-8 text-center">
        <UIcon :name="icon" class="text-primary/30 size-16" aria-hidden="true" />
        <div class="flex flex-col gap-1">
            <span class="text-default text-xl font-bold">{{ title }}</span>
            <span v-if="description" class="text-muted text-base font-medium">
                {{ description }}
            </span>
        </div>
        <slot />
    </div>
</template>
