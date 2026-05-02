<script lang="ts" setup>
import type { MOCK_EVENT_TYPE } from "~/pages/my-status.vue"

const record = defineProps<MOCK_EVENT_TYPE>()

const isPast = computed(() => new Date(record.dateTime.date) < new Date())
</script>

<template>
    <div class="bg-default relative overflow-hidden rounded-lg p-4">
        <div
            v-if="isPast"
            class="bg-error/10 text-error absolute top-6 -right-12 rotate-45 px-12 py-1 text-xs font-bold tracking-wider uppercase"
        >
            Пройдено
        </div>

        <div class="flex flex-col gap-4" :class="{ 'opacity-75': isPast }">
            <div class="flex items-center gap-4">
                <div
                    class="flex items-center justify-center rounded-full bg-fuchsia-500/5 p-2.5 text-fuchsia-500"
                >
                    <UIcon name="ph:ticket-bold" class="size-6" />
                </div>
                <div class="grid">
                    <h3 class="text-default/75 text-base leading-tight">Событие</h3>
                    <span class="text-default text-lg leading-tight font-semibold"
                        >#{{ record.id }}</span
                    >
                </div>
            </div>
            <div class="grid-row-2 grid grid-cols-[1fr_auto] gap-x-2">
                <span class="text-default text-lg font-medium">Стоимость:</span>
                <span class="text-primary col-start-2 text-end text-lg font-medium"
                    >{{ record.sum }}р</span
                >
            </div>
            <USeparator />
            <div class="flex flex-col gap-2">
                <div class="flex items-center gap-4">
                    <div
                        class="bg-secondary/5 text-secondary relative flex aspect-square size-5 min-h-0 min-w-0 shrink-0 items-center justify-center rounded-full"
                    >
                        <div
                            class="absolute top-1/2 left-1/2 flex h-full w-full -translate-1/2 items-center justify-center text-center text-xl leading-[0.025rem]"
                        >
                            •
                        </div>
                    </div>
                    <div class="grid">
                        <span class="text-default line-clamp-1 text-lg leading-tight font-medium">{{
                            record.event.name
                        }}</span>
                        <span class="text-default/75 line-clamp-1 text-sm leading-tight">
                            {{
                                new Date(record.dateTime.date).toLocaleDateString("ru-RU", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                })
                            }}
                            {{ record.dateTime.startTime }}-{{ record.dateTime.endTime }}
                        </span>
                    </div>
                </div>
            </div>
            <USeparator />
            <div class="grid gap-1">
                <div class="flex items-center justify-between gap-2 px-1">
                    <span class="text-default/75 text-sm font-medium">Участник:</span>
                    <span class="text-default text-sm font-semibold">{{
                        record.participant.name
                    }}</span>
                </div>
                <div class="flex items-center justify-between gap-2 px-1">
                    <span class="text-default/75 text-sm font-medium">Оформлен:</span>
                    <span class="text-default text-sm font-semibold">{{
                        new Date(record.createdAt).toLocaleDateString("ru-RU", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        })
                    }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
