<script lang="ts" setup>
import { computed } from "vue"

interface RadioCardProps {
    id: string
    title: string
    radioGroup?: string
}

const props = defineProps<RadioCardProps>()

const selectedId = defineModel<string | undefined>("selected", { required: true })

const isSelected = computed(() => selectedId.value === props.id)
</script>

<template>
    <label
        class="relative flex cursor-pointer flex-col rounded-sm border-0 bg-white px-4 py-2.5 ring-2 transition duration-150"
        :class="[isSelected ? 'ring-primary' : 'hover:ring-primary ring-transparent']"
    >
        <input
            v-model="selectedId"
            type="radio"
            :name="radioGroup ?? id"
            :value="id"
            class="sr-only"
        />

        <div class="flex items-start justify-between gap-2">
            <span class="text-primary text-xl leading-tight font-bold">{{ title }}</span>
            <UIcon
                v-if="isSelected"
                name="ph:check-circle-bold"
                class="text-primary mt-0.5 size-5.5 shrink-0"
            />
            <UIcon v-else name="ph:circle-bold" class="text-primary/50 mt-0.5 size-5.5 shrink-0" />
        </div>

        <div v-if="$slots.default" class="text-default/85 mt-1 text-base leading-tight font-medium">
            <slot />
        </div>
    </label>
</template>
