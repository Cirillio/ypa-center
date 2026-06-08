<script lang="ts" setup>
interface ClubsSectionCTAProps {
    clubsQuantity: number
    minAge: number
    city: string
}
defineProps<ClubsSectionCTAProps>()
</script>

<template>
    <div class="flex w-full flex-wrap items-center justify-center gap-4 md:gap-8">
        <div
            class="text-secondary flex items-center gap-2 rounded-full bg-white px-4 py-2 backdrop-blur-sm"
        >
            <UIcon name="ph:map-pin-duotone" class="text-primary size-5 md:size-6" />
            <span class="text-base font-bold md:text-lg">
                {{ city }}
            </span>
        </div>
        <div
            class="text-secondary flex items-center gap-2 rounded-full bg-white px-4 py-2 backdrop-blur-sm"
        >
            <UIcon name="ph:shapes-duotone" class="text-primary size-5 md:size-6" />
            <span class="text-base font-bold md:text-lg"> {{ clubsQuantity }} направлений </span>
        </div>
        <div
            class="text-secondary flex items-center gap-2 rounded-full bg-white px-4 py-2 backdrop-blur-sm"
        >
            <UIcon name="ph:baby-duotone" class="text-primary size-5 md:size-6" />
            <span class="text-base font-bold md:text-lg"> От {{ minAge }} лет </span>
        </div>
    </div>
</template>
