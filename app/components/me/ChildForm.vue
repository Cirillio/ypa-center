<script lang="ts" setup>
// Форма нового ребёнка для MeChildDialog: имя, дата рождения, класс; ошибки – по клику «Сохранить».
import type { FormSubmitEvent } from "@nuxt/ui"
import { SCHOOL_GRADES } from "~/constants/school-grades"
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

// Единый стиль полей – как в форме обратного звонка (size xl, secondary, subtle)
const fieldUi = {
    base: "md:text-lg !text-base bg-white font-semibold text-default placeholder:text-default/75"
}

const gradeOpen = ref(false)

// Ставит класс и закрывает список, как выбор времени в форме звонка.
function selectGrade(grade: (typeof SCHOOL_GRADES)[number]) {
    state.schoolGrade = grade
    gradeOpen.value = false
}

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
                size="xl"
                color="secondary"
                variant="subtle"
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
                    size="xl"
                    color="secondary"
                    variant="subtle"
                    class="w-full"
                    :ui="fieldUi"
                />
            </UFormField>
            <UFormField name="schoolGrade">
                <!-- ПОЧЕМУ поповер, а не USelect: выбор класса выглядит как выбор времени в форме звонка -->
                <UPopover
                    v-model:open="gradeOpen"
                    :content="{ align: 'start' }"
                    :ui="{
                        content:
                            'ring-transparent shadow-sm transition duration-150 ease-out bg-default'
                    }"
                >
                    <UButton
                        :label="state.schoolGrade ?? 'Класс'"
                        aria-label="Класс"
                        size="xl"
                        color="secondary"
                        variant="soft"
                        type="button"
                        class="w-full justify-between max-md:text-base!"
                        :ui="{ base: 'truncate py-2 md:py-2' }"
                        trailing-icon="ph:caret-down-bold"
                    />
                    <template #content>
                        <div class="flex max-h-72 flex-col gap-1 overflow-y-auto p-2">
                            <UButton
                                v-for="grade in SCHOOL_GRADES"
                                :key="grade"
                                :label="grade"
                                size="xl"
                                variant="ghost"
                                type="button"
                                class="font-semibold"
                                @click="selectGrade(grade)"
                            />
                        </div>
                    </template>
                </UPopover>
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
                class="aspect-square justify-center rounded-full"
                @click="emit('cancel')"
            />
        </div>
    </UForm>
</template>
