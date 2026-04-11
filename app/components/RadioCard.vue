<script lang="ts" setup>
import { computed } from "vue"

interface RadioCardProps {
    id: string
    title: string
    radioGroup?: string
    img?: string
    imgAlt?: string
}

const props = defineProps<RadioCardProps>()

const selectedId = defineModel<string | undefined>("selected", { required: true })

const isSelected = computed(() => selectedId.value === props.id)
</script>

<template>
    <label
        class="relative flex cursor-pointer rounded-sm border-0 bg-white ring-2 transition-all duration-200"
        :class="[
            img ? 'flex-col gap-2 p-2 sm:flex-row sm:gap-3' : 'flex-col px-4 py-2.5',
            isSelected ? 'ring-primary scale-[1.005]' : 'hover:ring-primary/50 ring-transparent'
        ]"
    >
        <input
            v-model="selectedId"
            type="radio"
            :name="radioGroup ?? id"
            :value="id"
            class="sr-only"
        />

        <!-- Image -->
        <div
            v-if="img"
            class="relative aspect-video w-full shrink-0 overflow-hidden rounded-xs sm:aspect-square sm:w-24"
        >
            <AppPhoto :src="img" :alt="imgAlt ?? title" class="object-cover object-center" />
            <slot name="img-overlay" />
        </div>

        <!-- Content -->
        <div
            :class="
                img ? 'flex min-w-0 flex-1 flex-col justify-between py-0.5 pr-1' : 'flex flex-col'
            "
        >
            <div class="flex items-start justify-between gap-2">
                <span
                    class="text-primary leading-tight font-bold"
                    :class="img ? 'line-clamp-2 text-lg' : 'text-xl'"
                >
                    {{ title }}
                </span>
                <UIcon
                    :name="isSelected ? 'ph:check-circle-bold' : 'ph:circle-bold'"
                    class="mt-0.5 size-5.5 shrink-0 transition-all duration-200"
                    :class="isSelected ? 'text-primary scale-110' : 'text-primary/40'"
                />
            </div>

            <div
                v-if="$slots.default"
                :class="img ? '' : 'text-default/85 mt-1 text-base leading-tight font-medium'"
            >
                <slot />
            </div>
        </div>
    </label>
</template>
