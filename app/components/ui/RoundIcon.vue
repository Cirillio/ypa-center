<script lang="ts" setup>
export interface RoundIconProps {
    /** Имя иконки (Iconify) */
    name: string
}

defineProps<RoundIconProps>()
</script>

<template>
    <div
        class="bg-primary/10 flex aspect-square size-10 shrink-0 items-center justify-center rounded-full"
    >
        <UIcon :name="name" class="text-primary size-6" />
    </div>
</template>
