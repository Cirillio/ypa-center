<script lang="ts" setup>
// Белая «таблетка»-контейнер для группы кнопок навигации; единый вид у вкладок записи и действий кабинета.
defineProps<{
    label: string
}>()
</script>

<template>
    <nav
        :aria-label="label"
        class="no-scrollbar flex max-w-full items-center gap-1 overflow-x-auto rounded-full bg-white p-1"
    >
        <slot />
    </nav>
</template>
