<script lang="ts" setup>
// Виджет профиля родителя и списка прикреплённых детей.
import type { MeChild, MeParent } from "~/types"

defineProps<{
    parent?: MeParent
    children?: readonly MeChild[]
    isProcessing: boolean
    isSaving: boolean
}>()

const emit = defineEmits<{
    addChild: [payload: { name: string; birthdate: string }]
}>()
</script>

<template>
    <div class="grid grid-cols-1 gap-6 rounded-lg bg-white p-6 sm:grid-cols-2">
        <MeParentInfo :parent="parent" :is-processing="isProcessing" />
        <div class="border-default max-sm:border-t sm:border-l sm:pl-6">
            <MeParentChildren
                :children="children"
                :is-processing="isProcessing"
                :is-saving="isSaving"
                @add="emit('addChild', $event)"
            />
        </div>
    </div>
</template>
