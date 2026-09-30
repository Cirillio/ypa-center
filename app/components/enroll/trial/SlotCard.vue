<script lang="ts" setup>
// Карточка выбора свободного слота пробного занятия: дата, время и группа.
import type { TrialCheckoutSlot } from "~/types"

const props = defineProps<{
    slotItem: TrialCheckoutSlot
    isSelected: boolean
}>()

const emit = defineEmits<{
    select: [slotKey: string]
}>()
</script>

<template>
    <button
        type="button"
        role="radio"
        :aria-checked="isSelected"
        :data-slot-key="slotItem.key"
        class="bg-default flex cursor-pointer flex-col gap-2 rounded-sm px-4 py-3 text-start ring-2 transition-all duration-200"
        :class="isSelected ? 'ring-primary' : 'hover:ring-primary/50 ring-transparent'"
        @click="emit('select', props.slotItem.key)"
    >
        <div class="flex items-start justify-between gap-2">
            <div class="flex flex-col">
                <span class="text-primary text-xl leading-tight font-bold">
                    {{ slotItem.displayDate }}
                </span>
                <span class="text-default text-lg leading-tight font-semibold">
                    {{ slotItem.displayTime }}
                </span>
            </div>

            <UIcon
                aria-hidden="true"
                :name="isSelected ? 'ph:check-circle-bold' : 'ph:circle-bold'"
                class="size-5 shrink-0"
                :class="isSelected ? 'text-primary' : 'text-primary/40'"
            />
        </div>

        <span class="text-muted text-sm">{{ slotItem.groupName }}</span>
    </button>
</template>
