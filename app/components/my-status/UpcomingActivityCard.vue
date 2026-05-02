<script lang="ts" setup>
import type { UpcomingActivityItem } from "~/types/status"

defineProps<{
    item: UpcomingActivityItem
}>()

const typeConfig = {
    subscription: {
        icon: "ph:star-bold",
        color: "text-rose-500 bg-rose-500/5",
        label: "Абонемент"
    },
    trial: {
        icon: "ph:calendar-dot-bold",
        color: "text-cyan-500 bg-cyan-500/5",
        label: "Пробное"
    },
    event: {
        icon: "ph:ticket-bold",
        color: "text-fuchsia-500 bg-fuchsia-500/5",
        label: "Мероприятие"
    }
}
</script>

<template>
    <div class="relative overflow-hidden rounded-lg">
        <div
            class="via-default to-default from-default hover:from-secondary/80 hover:to-primary/80 bg-linear-to-tl p-px transition-colors duration-150 ease-in"
        >
            <div class="bg-default flex flex-col gap-2.5 rounded-lg p-3.75">
                <!-- Header -->
                <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-2">
                        <div
                            class="flex items-center justify-center rounded-full p-1.5"
                            :class="typeConfig[item.type].color"
                        >
                            <UIcon :name="typeConfig[item.type].icon" class="size-4" />
                        </div>
                        <span
                            class="text-default/90 text-sm font-semibold tracking-wider uppercase"
                        >
                            {{ typeConfig[item.type].label }}
                        </span>
                    </div>
                    <span
                        v-if="item.metaLabel"
                        class="text-default/40 text-[10px] font-bold uppercase"
                    >
                        {{ item.metaLabel }}
                    </span>
                </div>

                <!-- Body -->
                <div class="flex flex-col">
                    <h4 class="text-default line-clamp-1 text-xl leading-tight font-bold">
                        {{ item.title }}
                    </h4>
                    <span class="text-default/70 line-clamp-1 text-sm font-medium">
                        {{ item.subtitle }}
                    </span>
                </div>

                <!-- Participant -->
                <USeparator />

                <div class="flex items-center gap-2">
                    <UIcon name="ph:user-bold" class="text-secondary size-6" />
                    <span class="text-default truncate text-lg font-bold">{{
                        item.participant
                    }}</span>
                </div>

                <USeparator />

                <!-- DateTime -->
                <div class="flex items-center gap-4">
                    <div class="text-secondary flex items-center gap-1.5 text-base font-semibold">
                        <UIcon name="ph:calendar-bold" class="size-5" />
                        <span>{{ item.displayDate }}</span>
                    </div>
                    <div class="text-primary flex items-center gap-1.5 text-base font-semibold">
                        <UIcon name="ph:clock-bold" class="size-5" />
                        <span>{{ item.displayTime }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
