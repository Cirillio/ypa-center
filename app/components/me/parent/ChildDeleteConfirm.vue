<script lang="ts" setup>
// Подтверждение удаления ребёнка; при живых записях объясняет, почему удалить нельзя.
import type { MeChildBlocker } from "~/types"

const props = defineProps<{
    childName: string
    isDeleting: boolean
    blockers: readonly MeChildBlocker[]
    error: string | null
}>()

const emit = defineEmits<{ confirm: [] }>()

const open = defineModel<boolean>("open", { default: false })

const isBlocked = computed(() => props.blockers.length > 0)
</script>

<template>
    <UModal
        v-model:open="open"
        :dismissible="!isDeleting"
        :title="isBlocked ? 'Удалить пока нельзя' : `Удалить ${childName}?`"
        :ui="{
            overlay: 'bg-black/25',
            content: 'ring-0 shadow-none'
        }"
    >
        <template #body>
            <div v-if="isBlocked" class="flex flex-col gap-3">
                <p class="text-default text-base">
                    У ребёнка есть действующие записи. Удалить карточку можно после их окончания.
                </p>
                <ul class="flex flex-col gap-2">
                    <li
                        v-for="blocker in blockers"
                        :key="blocker.key"
                        class="bg-default flex flex-col rounded-md px-3 py-2"
                    >
                        <span class="text-default text-sm font-semibold">{{ blocker.title }}</span>
                        <span class="text-muted text-xs">{{ blocker.detail }}</span>
                    </li>
                </ul>
            </div>
            <div v-else class="flex flex-col gap-2">
                <p class="text-default text-base">
                    Ребёнок пропадёт из профиля и из выбора при записи. История покупок и посещений
                    сохранится.
                </p>
                <p v-if="error" class="text-error text-sm">{{ error }}</p>
            </div>
        </template>

        <template #footer>
            <div class="flex w-full justify-end gap-3">
                <template v-if="isBlocked">
                    <UButton class="font-semibold" label="Понятно" @click="void (open = false)" />
                </template>
                <template v-else>
                    <UButton
                        variant="ghost"
                        class="font-semibold"
                        label="Отмена"
                        :disabled="isDeleting"
                        @click="void (open = false)"
                    />
                    <UButton
                        color="error"
                        class="font-semibold"
                        label="Удалить"
                        :loading="isDeleting"
                        @click="emit('confirm')"
                    />
                </template>
            </div>
        </template>
    </UModal>
</template>
