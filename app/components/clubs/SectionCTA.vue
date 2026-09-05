<script lang="ts" setup>
interface ClubsSectionCTAProps {
    clubsQuantity: number
    minAge: number | null
    city: string
}
defineProps<ClubsSectionCTAProps>()
</script>

<template>
    <div class="flex w-full flex-wrap items-center justify-center gap-4 md:gap-8">
        <div
            class="text-secondary flex flex-col items-center gap-2 rounded-sm bg-white px-6 py-6 shadow-xs backdrop-blur-sm"
        >
            <UIcon name="ph:map-pin-duotone" class="text-primary size-5 md:size-8" />
            <span class="text-base font-bold md:text-lg">
                {{ city }}
            </span>
        </div>
        <div
            class="text-secondary flex flex-col items-center gap-2 rounded-sm bg-white px-6 py-6 shadow-xs backdrop-blur-sm"
        >
            <UIcon name="ph:shapes-duotone" class="text-primary size-5 md:size-8" />
            <span class="text-base font-bold md:text-lg">
                {{ clubsQuantity }}
                {{ pluralize(clubsQuantity, ["направление", "направления", "направлений"]) }}
            </span>
        </div>
        <div
            v-if="minAge !== null"
            class="text-secondary flex flex-col items-center gap-2 rounded-sm bg-white px-6 py-6 shadow-xs backdrop-blur-sm"
        >
            <UIcon name="ph:baby-duotone" class="text-primary size-5 md:size-8" />
            <span class="text-base font-bold md:text-lg"> От {{ minAge }} лет </span>
        </div>
    </div>
</template>
