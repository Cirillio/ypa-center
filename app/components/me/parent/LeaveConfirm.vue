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
        title="Выйти из кабинета?"
        description="Записи и депозит сохранятся. Чтобы вернуться, понадобится новый код из письма."
        :ui="{
            overlay: 'bg-black/30 backdrop-blur-xs',
            content: 'max-w-sm rounded-3xl bg-white ring-0 shadow-xl'
        }"
    >
        <template #content>
            <div class="flex flex-col items-center gap-5 px-6 pt-8 pb-6 text-center">
                <span
                    class="bg-error/10 text-error flex size-16 items-center justify-center rounded-full"
                    aria-hidden="true"
                >
                    <UIcon name="ph:sign-out-duotone" class="size-8" />
                </span>

                <div class="flex flex-col gap-2">
                    <h2 class="text-primary text-2xl leading-tight font-bold">
                        Выйти из кабинета?
                    </h2>
                    <p class="text-muted text-base leading-snug">
                        Записи и депозит сохранятся. Чтобы вернуться, понадобится новый код из
                        письма.
                    </p>
                </div>

                <div class="flex w-full flex-col gap-2">
                    <UButton
                        size="xl"
                        block
                        class="rounded-full text-base font-bold"
                        label="Остаться"
                        @click="handleStay"
                    />
                    <UButton
                        color="error"
                        variant="ghost"
                        size="xl"
                        block
                        class="rounded-full text-base font-bold"
                        label="Выйти"
                        @click="handleLogout"
                    />
                </div>
            </div>
        </template>
    </UModal>
</template>
