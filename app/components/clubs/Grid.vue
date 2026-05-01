<script lang="ts" setup>
import type { Club, Subgroup } from "~/types"

defineProps<{
    enrichedClubs: Array<{ club: Club; subgroups: Subgroup[]; scheduledDays: string[] }>
}>()
</script>

<template>
    <div class="grid w-full gap-4">
        <ClubsCard
            v-for="(item, i) in enrichedClubs"
            :key="item.club.id"
            :club="item.club"
            :index="i"
            :subgroups="item.subgroups"
            :scheduled-days="item.scheduledDays"
        />
    </div>
</template>
