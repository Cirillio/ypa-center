<script lang="ts" setup>
// Диалог добавления ребёнка (кабинет и запись): форма в модалке вместо раскрытия посреди списка.
import type { NewChild } from "~/types"

defineProps<{
    isSaving: boolean
}>()

const emit = defineEmits<{
    submit: [payload: NewChild]
}>()

const open = defineModel<boolean>("open", { default: false })

// Отдаёт ребёнка наверх и закрывает диалог; форма размонтируется и при следующем открытии пустая.
function onSubmit(child: NewChild) {
    emit("submit", child)
    open.value = false
}
</script>

<template>
    <UModal
        v-model:open="open"
        title="Новый ребёнок"
        description="Имя и дата рождения обязательны, класс – по желанию."
        :ui="{
            overlay: 'bg-black/30 backdrop-blur-xs',
            content: 'max-w-md rounded-lg bg-white ring-0 shadow-xl'
        }"
    >
        <template #content>
            <div class="flex flex-col gap-5 p-6">
                <div class="flex items-center gap-3">
                    <span
                        class="bg-primary/5 text-primary flex items-center justify-center rounded-full p-2"
                        aria-hidden="true"
                    >
                        <UIcon name="ph:baby-bold" class="size-5" />
                    </span>
                    <h2 class="text-primary text-xl font-bold">Новый ребёнок</h2>
                </div>

                <MeChildForm :is-saving="isSaving" @submit="onSubmit" @cancel="open = false" />
            </div>
        </template>
    </UModal>
</template>
