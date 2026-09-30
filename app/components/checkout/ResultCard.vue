<script lang="ts" setup>
// Общая оболочка экрана результата: знак, заголовок, пояснение и действия – одинаково во всех состояниях.
defineProps<{
    title: string
    description: string
}>()
</script>

<template>
    <div class="flex flex-col items-center gap-6 rounded-lg bg-white px-6 py-10 text-center">
        <slot name="icon" />

        <div class="flex flex-col gap-1.5">
            <h1 class="text-default text-2xl font-extrabold">{{ title }}</h1>
            <p class="text-muted text-base">{{ description }}</p>
        </div>

        <slot />

        <div v-if="$slots.actions" class="flex w-full flex-col gap-2">
            <slot name="actions" />
        </div>
    </div>
</template>
