<script lang="ts" setup>
import type { ClubWithSlots } from "~/types"

defineProps<{ clubs: ClubWithSlots[] }>()

const selectedClubId = defineModel<string | undefined>({ required: true })
</script>

<template>
    <fieldset class="">
        <legend class="text-default text-2xl leading-tight font-bold">1. Выберите кружок</legend>
        <div class="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <RadioCard
                v-for="club in clubs"
                :id="club.id"
                :key="club.id"
                v-model:selected="selectedClubId"
                :title="club.title"
                radio-group="club"
            >
                {{ club.shortDesc }}
            </RadioCard>
        </div>
    </fieldset>
</template>
