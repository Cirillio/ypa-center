<script lang="ts" setup>
import type { Activity } from "~/types"

const props = defineProps<{
    club: Activity
    isSelected: boolean
}>()

// Диапазон возраста по всем подгруппам кружка: помогает родителю выбрать, не открывая расписание.
const ageLabel = computed(() => {
    const { min, max } = getAgeBounds(props.club.groups)
    return formatAgeRange(min, max)
})

const emit = defineEmits<{
    select: [clubId: number]
}>()
</script>

<template>
    <button
        type="button"
        role="radio"
        :aria-checked="isSelected"
        :data-club-id="club.id"
        class="bg-default flex cursor-pointer flex-col gap-2 rounded-sm p-2 text-start ring-2 transition-all duration-200"
        :class="isSelected ? 'ring-primary' : 'hover:ring-primary/50 ring-transparent'"
        @click="emit('select', club.id)"
    >
        <div class="relative aspect-16/10 w-full overflow-hidden rounded-xs">
            <UiPhoto :src="club.cover_image ?? ''" class="object-cover object-center" />
            <span
                aria-hidden="true"
                class="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-white/90"
                :class="isSelected ? 'text-primary' : 'text-primary/40'"
            >
                <UIcon
                    :name="isSelected ? 'ph:check-circle-bold' : 'ph:circle-bold'"
                    class="size-5"
                />
            </span>
        </div>

        <div class="flex flex-col gap-0.5 px-1 pb-1">
            <span class="text-primary text-lg leading-tight font-bold">{{ club.name }}</span>
            <span v-if="ageLabel" class="text-secondary text-xs font-bold">{{ ageLabel }}</span>
            <span class="text-muted text-sm leading-tight">{{ club.short_description }}</span>
        </div>
    </button>
</template>
