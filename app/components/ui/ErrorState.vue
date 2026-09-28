<script lang="ts" setup>
// Состояние «не удалось загрузить» с повтором; одно на все секции, чтобы ошибки выглядели одинаково.
withDefaults(
    defineProps<{
        message: string
        retrying?: boolean
        size?: "md" | "lg"
    }>(),
    { retrying: false, size: "md" }
)

const emit = defineEmits<{
    retry: []
}>()
</script>

<template>
    <div
        class="flex flex-col items-center gap-3 text-center"
        :class="size === 'lg' ? 'py-16 md:py-20' : 'py-8'"
    >
        <UIcon
            name="ph:warning-circle-duotone"
            class="text-secondary opacity-20"
            :class="size === 'lg' ? 'size-16' : 'size-12'"
            aria-hidden="true"
        />
        <p class="text-muted" :class="size === 'lg' ? 'text-base' : 'text-sm'">
            {{ message }} Попробуйте ещё раз.
        </p>
        <UButton
            variant="soft"
            :size="size === 'lg' ? 'md' : 'sm'"
            label="Повторить"
            :loading="retrying"
            @click="emit('retry')"
        />
    </div>
</template>
