<script lang="ts" setup>
// Главная кнопка сводки: подсказка о недостающем выборе по клику, отправка, пауза перед повтором и ошибка заказа.
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

const isCoolingDown = computed(() => props.cooldownSeconds > 0)
const isActive = computed(() => props.ready && !isCoolingDown.value)
// ПОЧЕМУ: кнопка не серая до полного выбора – клик без выбора подсвечивает, чего не хватает
const attempted = ref(false)

// Отправляет заказ, а при неполном выборе только показывает, что осталось выбрать.
function handleClick() {
    if (!props.ready) {
        attempted.value = true
        return
    }
    emit("continue")
}

watch(
    () => props.ready,
    (ready) => {
        if (ready) attempted.value = false
    }
)
const buttonLabel = computed(() =>
    props.cooldownSeconds > 0 ? `Повторить через ${props.cooldownSeconds} с` : props.label
)
</script>

<template>
    <div class="flex flex-col gap-2">
        <UButton
            :label="buttonLabel"
            :trailing-icon="icon"
            :disabled="isCoolingDown"
            :loading="loading"
            :color="isCoolingDown ? 'neutral' : 'primary'"
            :variant="isActive ? 'solid' : 'soft'"
            size="xl"
            block
            class="text-lg font-bold"
            :ui="{ trailingIcon: 'size-5' }"
            @click="handleClick"
        />

        <UAlert
            v-if="error"
            role="alert"
            color="error"
            variant="soft"
            icon="ph:warning-circle-bold"
            :title="error.title"
            :description="error.description"
        >
            <template v-if="error.requestId" #actions>
                <span class="text-muted text-xs select-all"
                    >Код обращения: {{ error.requestId.slice(0, 8) }}</span
                >
            </template>
        </UAlert>

        <p v-else-if="hint" class="text-muted text-center text-xs">{{ hint }}</p>
        <p
            v-else-if="!ready && missing.length"
            :role="attempted ? 'alert' : undefined"
            class="text-center text-xs transition-colors"
            :class="attempted ? 'text-error font-semibold' : 'text-muted'"
        >
            Осталось выбрать: {{ missing.join(", ") }}
        </p>
    </div>
</template>
