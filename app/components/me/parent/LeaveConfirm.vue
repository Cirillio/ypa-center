<script lang="ts" setup>
// Модальное окно подтверждения выхода из личного кабинета.
const emit = defineEmits<{ confirm: [] }>()

const modalOpen = defineModel<boolean>({ default: false })

function handleStay() {
    modalOpen.value = false
}

function handleLogout() {
    modalOpen.value = false
    emit("confirm")
}
</script>

<template>
    <UModal
        v-model:open="modalOpen"
        :ui="{
            overlay: 'bg-black/25 backdrop-blur-xs',
            content: 'ring-0 shadow-none'
        }"
    >
        <template #content>
            <div class="p-6">
                <p class="text-default mb-6 text-xl font-medium">Вы уверены, что хотите выйти?</p>
                <div class="flex justify-end gap-3">
                    <UButton
                        color="error"
                        variant="ghost"
                        class="text-lg font-semibold"
                        @click="handleLogout"
                    >
                        Уйти
                    </UButton>
                    <UButton class="text-lg font-semibold" @click="handleStay"> Остаться </UButton>
                </div>
            </div>
        </template>
    </UModal>
</template>
