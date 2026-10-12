<script lang="ts" setup>
// Выбор ребёнка в сводке: чипы-радио, инлайн-добавление; гостю – приглашение войти.
import type { RouteLocationRaw } from "vue-router"
import type { MeChild, NewChild } from "~/types"

const props = defineProps<{
    title: string
    isAuthed: boolean
    isPending: boolean
    error?: unknown
    children: readonly MeChild[]
    isSaving: boolean
    loginTo: RouteLocationRaw
    errorText?: string | null
}>()

const emit = defineEmits<{
    add: [payload: NewChild]
    retry: []
}>()

const selectedChildId = defineModel<string | undefined>({ required: true })

const isAdding = ref<boolean>(false)
const newName = ref<string>("")
const newBirthdate = ref<string>("")

// Roving tabindex: Tab попадает в группу один раз – на выбранного ребёнка или на первого.
const focusableChildId = computed(() => selectedChildId.value ?? props.children[0]?.id)

// Закрывает форму добавления и очищает черновик.
function closeForm() {
    isAdding.value = false
    newName.value = ""
    newBirthdate.value = ""
}

// Отдаёт нового ребёнка наверх; выбор его после сохранения делает композабл.
function submitForm() {
    const name = newName.value.trim()
    if (!name || !newBirthdate.value) return
    emit("add", { name, birthdate: newBirthdate.value })
    closeForm()
}
</script>

<template>
    <section class="flex flex-col gap-2.5" :aria-label="title">
        <h3 class="text-default text-base font-semibold">{{ title }}</h3>

        <!-- Гость: выбор ребёнка возможен только из кабинета -->
        <div v-if="!isAuthed" class="bg-default flex flex-col gap-2 rounded-sm px-4 py-3">
            <p class="text-muted text-sm">Войдите, чтобы выбрать ребёнка из профиля</p>
            <UButton
                :to="loginTo"
                label="Войти"
                leading-icon="ph:sign-in-bold"
                color="info"
                variant="soft"
                size="sm"
                class="w-fit"
            />
        </div>

        <div v-else-if="isPending" class="flex flex-wrap gap-2">
            <USkeleton class="h-9 w-28 rounded-full" />
            <USkeleton class="h-9 w-32 rounded-full" />
        </div>

        <div v-else-if="error" class="flex items-center gap-2">
            <p class="text-muted text-sm">Не удалось загрузить детей.</p>
            <UButton label="Повторить" variant="soft" size="xs" @click="emit('retry')" />
        </div>

        <template v-else>
            <div
                v-if="children.length"
                role="radiogroup"
                :aria-label="title"
                class="flex flex-wrap gap-2"
            >
                <button
                    v-for="child in children"
                    :key="child.id"
                    type="button"
                    role="radio"
                    :aria-checked="child.id === selectedChildId"
                    :tabindex="child.id === focusableChildId ? 0 : -1"
                    class="flex cursor-pointer items-center gap-2 rounded-full py-1 pr-3 pl-1 ring-2 transition-all"
                    :class="
                        child.id === selectedChildId
                            ? 'bg-secondary/10 ring-secondary'
                            : 'bg-secondary/5 hover:bg-secondary/10 ring-transparent'
                    "
                    @click="selectedChildId = child.id"
                >
                    <span
                        class="bg-secondary/15 text-secondary flex size-7 items-center justify-center rounded-full text-sm font-bold"
                    >
                        {{ child.name.trim().charAt(0).toUpperCase() }}
                    </span>
                    <span class="text-default text-base leading-tight font-semibold">
                        {{ child.name }}
                    </span>
                    <UIcon
                        v-if="child.id === selectedChildId"
                        name="ph:check-bold"
                        class="text-secondary size-3.5"
                        aria-hidden="true"
                    />
                </button>
            </div>

            <p v-if="errorText" class="text-error flex items-start gap-1.5 text-sm font-medium">
                <UIcon name="ph:warning-circle-bold" class="mt-0.5 size-4 shrink-0" />
                {{ errorText }}
            </p>

            <form v-if="isAdding" class="flex flex-col gap-2" @submit.prevent="submitForm">
                <UInput v-model="newName" autofocus maxlength="40" placeholder="Имя ребёнка" />
                <div class="flex gap-2">
                    <UInput
                        v-model="newBirthdate"
                        type="date"
                        aria-label="Дата рождения"
                        class="min-w-0 flex-1"
                    />
                    <UButton
                        type="submit"
                        icon="ph:check-bold"
                        :loading="isSaving"
                        :disabled="!newName.trim() || !newBirthdate"
                        aria-label="Сохранить ребёнка"
                    />
                    <UButton
                        type="button"
                        color="error"
                        variant="ghost"
                        icon="ph:x-bold"
                        aria-label="Отмена"
                        @click="closeForm"
                    />
                </div>
            </form>
            <UButton
                v-else
                label="Добавить ребёнка"
                leading-icon="ph:plus-bold"
                color="info"
                variant="soft"
                size="sm"
                class="w-fit"
                @click="void (isAdding = true)"
            />
        </template>
    </section>
</template>
