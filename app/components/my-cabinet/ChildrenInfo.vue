<script lang="ts" setup>
import type { CabinetChild } from "~/types/status"

const props = defineProps<{
    children?: readonly CabinetChild[]
    isProcessing: boolean
    isSaving: boolean
}>()

const emit = defineEmits<{
    add: [payload: { name: string; birthdate: string }]
    remove: [id: string]
}>()

const isAdding = ref<boolean>(false)
const newName = ref<string>("")
const newBirthdate = ref<string>("")

const hasLinked = computed(() => props.children?.some((c) => c.isLinked) ?? false)

const initial = (name: string) => name.trim().charAt(0).toUpperCase()

const openForm = () => {
    isAdding.value = true
}

const cancelForm = () => {
    isAdding.value = false
    newName.value = ""
    newBirthdate.value = ""
}

const submitForm = () => {
    if (!newName.value.trim()) return
    emit("add", { name: newName.value.trim(), birthdate: newBirthdate.value })
    cancelForm()
}
</script>

<template>
    <section class="flex flex-col gap-4" aria-label="Мои дети">
        <div class="flex items-center gap-3">
            <div
                class="bg-primary/5 text-primary flex items-center justify-center rounded-full p-2"
            >
                <UIcon name="ph:baby-bold" class="size-5" />
            </div>
            <h2 class="text-primary text-xl font-bold">Мои дети</h2>
            <span
                v-if="children"
                class="bg-secondary/10 text-secondary flex min-w-6 items-center justify-center rounded-full px-2 py-0.5 text-sm font-bold"
            >
                {{ children.length }}
            </span>
        </div>

        <template v-if="children">
            <div v-if="children.length" class="flex flex-wrap gap-2">
                <div
                    v-for="child in children"
                    :key="child.id"
                    class="bg-secondary/5 flex items-center gap-2 rounded-full py-1 pr-2 pl-1"
                    :title="child.birthdate"
                >
                    <span
                        class="bg-secondary/15 text-secondary flex size-7 items-center justify-center rounded-full text-sm font-bold"
                    >
                        {{ initial(child.name) }}
                    </span>
                    <span class="text-default text-base leading-tight font-semibold">
                        {{ child.name }}
                    </span>
                    <UIcon
                        v-if="child.isLinked"
                        name="ph:lock-simple-fill"
                        class="text-default/30 mr-1 size-4 shrink-0"
                        title="Привязан к покупкам — удалить нельзя"
                    />
                    <button
                        v-else
                        type="button"
                        :disabled="isSaving"
                        class="text-default/40 hover:bg-error/10 hover:text-error flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full text-lg leading-none transition disabled:opacity-40"
                        title="Удалить"
                        @click="emit('remove', child.id)"
                    >
                        ×
                    </button>
                </div>
            </div>
            <p v-else class="text-default/50 text-sm italic">Пока не добавлено ни одного ребёнка</p>

            <form
                v-if="isAdding"
                class="flex flex-wrap items-center gap-2"
                @submit.prevent="submitForm"
            >
                <UInput
                    v-model="newName"
                    autofocus
                    maxlength="40"
                    placeholder="Имя ребёнка"
                    class="max-w-44"
                />
                <UInput v-model="newBirthdate" type="date" class="max-w-40" />
                <UButton
                    type="submit"
                    icon="ph:check-bold"
                    :loading="isSaving"
                    :disabled="!newName.trim()"
                    title="Сохранить"
                />
                <UButton
                    type="button"
                    color="error"
                    variant="ghost"
                    icon="ph:x-bold"
                    title="Отмена"
                    @click="cancelForm"
                />
            </form>
            <UButton
                v-else
                icon="ph:plus-bold"
                color="info"
                variant="soft"
                class="w-fit"
                @click="openForm"
            >
                Добавить ребёнка
            </UButton>

            <p v-if="hasLinked" class="text-default/50 text-xs">
                Ребёнка, привязанного к покупке, удалить нельзя.
            </p>
        </template>

        <div v-else class="flex flex-wrap gap-2">
            <div
                v-for="i in 2"
                :key="i"
                class="h-9 w-36 rounded-full"
                :class="isProcessing ? 'bg-secondary/20 animate-pulse' : 'bg-mauve-500/10'"
            />
        </div>
    </section>
</template>
