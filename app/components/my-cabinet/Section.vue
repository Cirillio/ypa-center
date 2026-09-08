<script lang="ts" setup>
interface MyCabinetSectionProps {
    parentName?: string
}

const props = defineProps<MyCabinetSectionProps>()

defineEmits<{
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
    <UContainer class="flex items-center justify-between gap-4 py-6">
        <div class="flex items-center gap-3">
            <RoundIcon name="ph:book-open-text-bold" />
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

        <UButton
            color="error"
            variant="soft"
            trailing-icon="ph:sign-out-bold"
            label="Выйти"
            @click="$emit('logout')"
        />
    </UContainer>
</template>
