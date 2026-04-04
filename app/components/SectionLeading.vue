<template>
    <div class="flex flex-col gap-6">
        <span v-if="subtitle" class="flex w-fit items-center font-semibold">
            <UIcon name="ph:dot-duotone" class="text-primary mr-1 mb-0.5 size-5 animate-pulse" />
            <span class="text-default max-md:text-sm">{{ subtitle }}</span>
        </span>

        <h2 class="text-4xl leading-[0.9] font-extrabold sm:text-4xl lg:text-5xl xl:text-6xl">
            <slot name="title" />
        </h2>

        <p class="text-default/65 max-w-md text-base leading-relaxed font-semibold md:text-lg">
            <slot name="description" />
        </p>

        <slot name="action" />
    </div>
</template>

<script lang="ts" setup>
defineProps<{
    subtitle?: string
}>()
</script>

<style></style>
