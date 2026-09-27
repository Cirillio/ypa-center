<script lang="ts" setup>
// Карточка выбора слота времени для пробного занятия с отображением группы и остатка мест.
import type { TrialCheckoutSlot } from "~/types"

const props = defineProps<{
    slotItem: TrialCheckoutSlot
    isSelected: boolean
}>()

const emit = defineEmits<{
    select: [slotId: number]
}>()

const isFull = computed(() => props.slotItem.available === 0)

// Инициирует выбор слота, если в группе остались свободные места.
function handleClick() {
    if (isFull.value) return
    emit("select", props.slotItem.id)
}
</script>

<template>
    <button
        type="button"
        role="radio"
        :aria-checked="isSelected"
        :disabled="isFull"
        :data-slot-id="slotItem.id"
        class="bg-default flex flex-col gap-2 rounded-sm px-4 py-3 text-start ring-2 transition-all duration-200"
        :class="
            isFull
                ? 'cursor-not-allowed opacity-50 ring-transparent'
                : isSelected
                  ? 'ring-primary cursor-pointer'
                  : 'hover:ring-primary/50 cursor-pointer ring-transparent'
        "
        @click="handleClick"
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
                v-if="!isFull"
                aria-hidden="true"
                :name="isSelected ? 'ph:check-circle-bold' : 'ph:circle-bold'"
                class="size-5 shrink-0"
                :class="isSelected ? 'text-primary' : 'text-primary/40'"
            />
        </div>

        <div class="flex items-center justify-between gap-2 text-sm">
            <span class="text-muted">{{ slotItem.groupName }}</span>
            <span
                class="flex items-center gap-1 rounded-xs bg-white px-2 py-0.5 font-bold"
                :class="getCapacityTextColor(slotItem.available)"
            >
                <UIcon name="ph:users-bold" class="size-4 shrink-0" aria-hidden="true" />
                {{ isFull ? "Мест нет" : `Мест: ${slotItem.available}/${slotItem.maxCapacity}` }}
            </span>
        </div>
    </button>
</template>
