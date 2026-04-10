<script lang="ts" setup>
import type { Club } from "~/types"

defineProps<{
    clubs: Club[]
}>()
</script>

<template>
    <div class="grid w-full gap-4">
        <ClubsCard v-for="(club, i) in clubs" :key="club.id" :club="club" :index="i" />
    </div>
</template>
