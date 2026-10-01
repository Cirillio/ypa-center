<script lang="ts" setup>
// Солнце-маскот бренда как эмоция экрана оплаты: ждёт, радуется, грустит за облаком, терпеливо ждёт банк.
export type MascotMood = "spin" | "joy" | "cloudy" | "wait"

defineProps<{
    mood: MascotMood
}>()
</script>

<template>
    <div class="relative flex size-44 items-center justify-center" aria-hidden="true">
        <!-- Тёплый ореол: тот же приём мягкого света, что у фона страниц -->
        <div
            class="bg-primary/15 absolute inset-4 rounded-full blur-2xl"
            :class="mood === 'cloudy' ? 'opacity-40' : 'opacity-100'"
        />

        <NuxtImg
            src="/core/ClearSun.png"
            alt=""
            width="144"
            height="144"
            format="webp"
            quality="90"
            class="relative size-36 transition-[filter] duration-700"
            :class="[
                mood === 'spin' && 'sun-spin',
                mood === 'joy' && 'sun-joy',
                mood === 'cloudy' && 'saturate-50'
            ]"
        />

        <UIcon
            v-if="mood === 'cloudy'"
            name="ph:cloud-fill"
            class="cloud-drift absolute right-0 bottom-3 size-28 text-(--ui-bg-accented) drop-shadow-sm"
        />

        <span
            v-else-if="mood === 'wait'"
            class="ring-default absolute right-2 bottom-4 flex size-12 items-center justify-center rounded-full bg-white shadow-sm ring-4"
        >
            <UIcon name="ph:hourglass-medium-fill" class="text-primary size-6" />
        </span>
    </div>
</template>
