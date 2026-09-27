<script lang="ts" setup>
// Компактная шапка страниц записи с заголовком, иконкой и слотом под навигацию по типам покупки.
withDefaults(
    defineProps<{
        title: string
        subtitle?: string
        icon: string
    }>(),
    {
        subtitle: "Запись"
    }
)
</script>

<template>
    <UContainer class="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 py-6">
        <div class="flex items-center gap-3">
            <UiRoundIcon :name="icon" />
            <div class="flex flex-col">
                <span
                    class="text-secondary text-sm leading-tight font-semibold tracking-wide uppercase"
                >
                    {{ subtitle }}
                </span>
                <h1 class="text-primary text-2xl leading-tight font-bold">
                    {{ title }}
                </h1>
            </div>
        </div>

        <slot />
    </UContainer>
</template>
