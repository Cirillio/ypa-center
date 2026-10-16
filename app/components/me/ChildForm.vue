<script lang="ts" setup>
// Инлайн-форма нового ребёнка (кабинет и запись): имя, дата рождения, класс; ошибки – по клику «Сохранить».
import type { FormSubmitEvent } from "@nuxt/ui"
import { SCHOOL_GRADE_ITEMS } from "~/constants/school-grades"
import { childSchema, type ChildFormState } from "~/schemas/child.schema"
import type { NewChild } from "~/types"

defineProps<{
    isSaving: boolean
}>()

const emit = defineEmits<{
    submit: [payload: NewChild]
    cancel: []
}>()

const state = reactive<ChildFormState>({ name: "", birthdate: "", schoolGrade: undefined })

// Единый стиль полей – как в анкете регистрации
const fieldUi = { base: "bg-white shadow-sm" }

// Отдаёт проверенного схемой ребёнка наверх; сохранение и выбор – забота родителя.
function onSubmit(event: FormSubmitEvent<NewChild>) {
    emit("submit", {
        name: event.data.name,
        birthdate: event.data.birthdate,
        ...(event.data.schoolGrade ? { schoolGrade: event.data.schoolGrade } : {})
    })
}
</script>

<template>
    <UForm
        :schema="childSchema"
        :state="state"
        :validate-on="['input', 'change']"
        class="flex flex-col gap-2"
        @submit="onSubmit"
    >
        <UFormField name="name">
            <UInput
                v-model="state.name"
                autofocus
                maxlength="40"
                placeholder="Имя ребёнка"
                aria-label="Имя ребёнка"
                class="w-full"
                :ui="fieldUi"
            />
        </UFormField>

        <div class="grid grid-cols-2 gap-2">
            <UFormField name="birthdate">
                <UInput
                    v-model="state.birthdate"
                    type="date"
                    aria-label="Дата рождения"
                    class="w-full"
                    :ui="fieldUi"
                />
            </UFormField>
            <UFormField name="schoolGrade">
                <USelect
                    v-model="state.schoolGrade"
                    :items="SCHOOL_GRADE_ITEMS"
                    value-key="value"
                    placeholder="Класс"
                    aria-label="Класс"
                    class="w-full"
                    :content="{ bodyLock: false }"
                    :ui="{ ...fieldUi, content: 'bg-white shadow-xs' }"
                />
            </UFormField>
        </div>

        <div class="flex gap-2">
            <UButton
                type="submit"
                icon="ph:check-bold"
                label="Сохранить"
                :loading="isSaving"
                class="flex-1 justify-center"
            />
            <UButton
                type="button"
                color="error"
                variant="ghost"
                icon="ph:x-bold"
                aria-label="Отмена"
                @click="emit('cancel')"
            />
        </div>
    </UForm>
</template>
