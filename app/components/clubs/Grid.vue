<script lang="ts" setup>
import type { Activity } from "~/types"

defineProps<{
    enrichedClubs: Array<{ activity: Activity; scheduledDays: string[] }>
}>()
</script>

<template>
    <div class="grid w-full gap-4">
        <ClubsCard
            v-for="(item, i) in enrichedClubs"
            :key="item.activity.id"
            :activity="item.activity"
            :index="i"
            :scheduled-days="item.scheduledDays"
        />
    </div>
</template>
