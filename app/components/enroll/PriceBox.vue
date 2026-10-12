<script lang="ts" setup>
// Акцентный блок суммы к оплате; справа – пояснение (за занятие, «разовое посещение» и т.п.).
defineProps<{
    label: string
    amount: string
}>()
</script>

<template>
    <div class="bg-default flex flex-wrap items-end justify-between gap-2 rounded-sm px-4 py-3">
        <div class="flex min-w-fit flex-col gap-0.5">
            <span class="text-muted text-xs font-semibold">{{ label }}</span>
            <span class="text-primary text-3xl leading-none font-extrabold">{{ amount }}</span>
        </div>
        <slot name="aside" />
    </div>
</template>
