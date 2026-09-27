<script lang="ts" setup>
// Карточка-переключатель слота расписания с цветовой темой кружка и индикатором свободных мест.
import type { WeeklySlot } from "~/types"

const props = defineProps<{
    slotItem: WeeklySlot
    isSelected: boolean
}>()

const emit = defineEmits<{
    toggle: [slot: WeeklySlot]
}>()

const isFull = computed(() => props.slotItem.available <= 0)
const theme = computed(() => getActivityTheme(props.slotItem.activity.id))
const capacityColorClass = computed(() => getCapacityTextColor(props.slotItem.available))

// Переключает выбор слота, если в группе есть свободные места.
function handleClick() {
    if (isFull.value) return
    emit("toggle", props.slotItem)
}
</script>

<template>
    <button
        type="button"
        :disabled="isFull"
        :aria-pressed="isSelected"
        :title="
            isFull
                ? 'Мест нет: ' + slotItem.activity.name
                : (isSelected ? 'Убрать из абонемента: ' : 'Добавить в абонемент: ') +
                  slotItem.activity.name
        "
        class="group flex aspect-5/3 flex-col items-start rounded-sm p-2.5 text-start transition-all duration-200 md:px-4 md:py-3"
        :class="[
            theme.bg,
            theme.ring,
            isFull
                ? 'cursor-not-allowed opacity-50'
                : isSelected
                  ? 'cursor-pointer ring-2'
                  : 'cursor-pointer ring-0 hover:contrast-95'
        ]"
        @click="handleClick"
    >
        <div class="flex flex-col">
            <span
                :title="slotItem.activity.name"
                class="line-clamp-2 text-base leading-tight font-extrabold md:text-xl"
                :class="theme.title"
            >
                {{ slotItem.activity.name }}
            </span>
            <span
                :title="'Группа: ' + slotItem.groupName"
                class="text-default line-clamp-1 text-xs font-semibold lg:text-sm"
            >
                {{ slotItem.groupName }}
            </span>
        </div>

        <div class="mt-auto flex w-full flex-col gap-0.5">
            <span
                :title="`${slotItem.startTime}–${slotItem.endTime}`"
                class="text-default font-bold lg:text-base"
            >
                {{ slotItem.startTime }}–{{ slotItem.endTime }}
            </span>

            <div class="flex items-center justify-between gap-1">
                <span
                    :title="
                        isFull
                            ? 'Мест нет'
                            : `Доступных мест: ${slotItem.available}/${slotItem.maxCapacity}`
                    "
                    class="flex items-center gap-1 rounded-xs bg-white px-1.5 py-0.5 text-xs font-bold lg:px-2 lg:py-1 lg:text-sm"
                    :class="capacityColorClass"
                >
                    <UIcon name="ph:users-bold" class="size-4 shrink-0" aria-hidden="true" />
                    <span>
                        {{ isFull ? "Мест нет" : `${slotItem.available}/${slotItem.maxCapacity}` }}
                    </span>
                </span>

                <span
                    :title="isSelected ? 'Добавлено' : 'Добавить'"
                    class="flex size-5 items-center justify-center rounded-xs bg-white ring-2 md:size-6"
                    :class="[theme.ring, theme.title]"
                >
                    <UIcon
                        v-if="isSelected"
                        name="ph:check-bold"
                        class="size-4 shrink-0"
                        aria-hidden="true"
                    />
                </span>
            </div>
        </div>
    </button>
</template>
