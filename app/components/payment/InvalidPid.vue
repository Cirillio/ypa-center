<script lang="ts" setup>
withDefaults(
    defineProps<{
        enrollPath?: string
    }>(),
    {
        enrollPath: "/enroll/trial"
    }
)
</script>

<template>
    <div
        class="flex min-h-64 flex-col items-center justify-center gap-6 rounded-sm bg-white px-6 py-10"
    >
        <UIcon name="ph:question-bold" class="text-default/25 size-16 -rotate-12" />

        <div class="space-y-1 text-center">
            <p class="text-default text-xl font-bold">Платёж не найден</p>
            <p class="text-muted text-sm">Ссылка недействительна или устарела</p>
        </div>

        <UButton :to="enrollPath" label="Начать сначала" block />
    </div>
</template>
