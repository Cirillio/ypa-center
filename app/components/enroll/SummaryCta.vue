<script lang="ts" setup>
// Главная кнопка сводки: блокировка до полного выбора, отправка, пауза перед повтором и ошибка заказа.
import type { CheckoutError } from "~/types"

const props = withDefaults(
    defineProps<{
        ready: boolean
        label?: string
        icon?: string
        missing: string[]
        hint?: string | null
        loading?: boolean
        cooldownSeconds?: number
        error?: CheckoutError | null
    }>(),
    {
        label: "Продолжить",
        icon: "ph:arrow-right-bold",
        hint: null,
        loading: false,
        cooldownSeconds: 0,
        error: null
    }
)

const emit = defineEmits<{
    continue: []
}>()

const isActive = computed(() => props.ready && props.cooldownSeconds === 0)
const buttonLabel = computed(() =>
    props.cooldownSeconds > 0 ? `Повторить через ${props.cooldownSeconds} с` : props.label
)
</script>

<template>
    <div class="flex flex-col gap-2">
        <UButton
            :label="buttonLabel"
            :trailing-icon="icon"
            :disabled="!isActive"
            :loading="loading"
            :color="isActive ? 'primary' : 'neutral'"
            :variant="isActive ? 'solid' : 'soft'"
            size="xl"
            block
            class="text-lg font-bold"
            :ui="{ trailingIcon: 'size-5' }"
            @click="emit('continue')"
        />

        <UAlert
            v-if="error"
            role="alert"
            color="error"
            variant="soft"
            icon="ph:warning-circle-bold"
            :title="error.title"
            :description="error.description"
        />

        <p v-else-if="hint" class="text-muted text-center text-xs">{{ hint }}</p>
        <p v-else-if="!ready && missing.length" class="text-muted text-center text-xs">
            Осталось выбрать: {{ missing.join(", ") }}
        </p>
    </div>
</template>
