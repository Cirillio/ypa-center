<script lang="ts" setup>
defineProps<{
    name: string | null
    dateTime: string | null
}>()
</script>

<template>
    <div class="relative flex flex-col gap-0.5 overflow-hidden rounded-sm bg-white px-6 py-4">
        <UIcon
            name="ph:person-simple-run-bold"
            class="text-primary/25 absolute -right-2 -bottom-2 size-28 -rotate-24"
        />
        <span class="text-default text-2xl font-bold">Ваш выбор:</span>
        <span v-if="name" class="text-primary text-2xl font-bold">{{ name }}</span>
        <span v-else class="text-default/60 text-2xl font-bold italic">Кружок не выбран</span>
        <span v-if="dateTime" class="text-primary text-xl font-semibold">{{ dateTime }}</span>
        <span v-else class="text-default/60 text-xl font-semibold italic">Время не выбрано</span>
    </div>
</template>
