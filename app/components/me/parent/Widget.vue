<script lang="ts" setup>
// Виджет профиля родителя и списка прикреплённых детей.
import type { MeChild, MeParent } from "~/types"

defineProps<{
    parent?: MeParent
    children?: readonly MeChild[]
    isProcessing: boolean
    isSaving: boolean
    error?: unknown
}>()

const emit = defineEmits<{
    addChild: [payload: { name: string; birthdate: string }]
    retry: []
}>()
</script>

<template>
    <div class="rounded-lg bg-white p-6">
        <MeErrorState
            v-if="error && !parent"
            message="Не удалось загрузить профиль."
            @retry="emit('retry')"
        />
        <div v-else class="grid gap-6 md:grid-cols-2">
            <MeParentInfo :parent="parent" :is-processing="isProcessing" />
            <MeParentChildren
                :children="children"
                :is-processing="isProcessing"
                :is-saving="isSaving"
                class="border-default border-t pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-6"
                @add="emit('addChild', $event)"
            />
        </div>
    </div>
</template>
