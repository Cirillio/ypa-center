<template>
    <div
        class="text-default/55 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold sm:text-sm"
    >
        <span
            v-for="(stat, i) in CENTER_STATS"
            :key="stat.label"
            class="flex items-center gap-1.5"
            :class="[i === 1 && 'hidden sm:flex', i === 2 && 'hidden md:flex']"
        >
            <UIcon :name="stat.icon" class="size-4 shrink-0" :class="stat.textColor" />
            {{ stat.value }} {{ stat.label }}
        </span>
    </div>
</template>

<script lang="ts" setup>
import { CENTER_STATS } from "~/constants/content"
</script>
