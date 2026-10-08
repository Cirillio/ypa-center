<script lang="ts" setup>
// Шапка личного кабинета с приветствием родителя и кнопкой выхода.
interface Props {
    parentName?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
    logout: []
}>()

const firstName = computed(() => {
    if (!props.parentName) return ""
    const trimmed = props.parentName.trim()
    if (!trimmed) return ""
    return trimmed.split(/\s+/)[0] ?? ""
})
</script>

<template>
    <UContainer class="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 py-6">
        <div class="flex items-center gap-3">
            <UiRoundIcon name="ph:book-open-text-bold" />
            <div v-if="firstName" class="flex flex-col">
                <span
                    class="text-secondary text-sm leading-tight font-semibold tracking-wide uppercase"
                >
                    Личный кабинет
                </span>
                <h1 class="text-primary text-2xl leading-tight font-bold">
                    Здравствуйте, {{ firstName }}
                </h1>
            </div>
            <h1 v-else class="text-primary text-2xl leading-tight font-bold">Личный кабинет</h1>
        </div>

        <UiPillNav label="Действия кабинета">
            <slot name="actions" />
            <UButton
                color="error"
                variant="ghost"
                trailing-icon="ph:sign-out-bold"
                label="Выйти"
                class="shrink-0 gap-1.5 rounded-full px-4! py-2! text-base font-bold transition-colors"
                :ui="{ trailingIcon: 'size-4.5 shrink-0' }"
                @click="emit('logout')"
            />
        </UiPillNav>
    </UContainer>
</template>
