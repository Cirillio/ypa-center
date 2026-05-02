<script lang="ts" setup>
import type { MOCK_SUBSCIBITION_TYPE } from "~/pages/my-status.vue"

const sub = defineProps<MOCK_SUBSCIBITION_TYPE>()

const clubsSortedByLeft = computed(() => [...sub.clubs].sort((a, b) => b.left - a.left))

const isClubsShown = ref<boolean>(false)

const toggleClubsShown = () => {
    isClubsShown.value = !isClubsShown.value
}
</script>

<template>
    <div class="bg-default relative overflow-hidden rounded-lg p-4">
        <div
            v-if="sub.isExpired"
            class="bg-error/10 text-error absolute top-6 -right-12 rotate-45 px-12 py-1 text-xs font-bold tracking-wider uppercase"
        >
            Пройдено
        </div>

        <div class="flex flex-col gap-4" :class="{ 'opacity-75': sub.isExpired }">
            <div class="flex items-center gap-4">
                <div
                    class="flex items-center justify-center rounded-full bg-rose-500/5 p-2.5 text-rose-500"
                >
                    <UIcon name="ph:star-bold" class="size-6" />
                </div>
                <div class="grid">
                    <h3 class="text-default/75 text-base leading-tight">Абонемент</h3>
                    <span class="text-default text-lg leading-tight font-semibold"
                        >#{{ sub.id }}</span
                    >
                </div>
            </div>
            <div class="grid-row-2 grid grid-cols-[1fr_auto] gap-x-2">
                <span class="text-default text-lg font-medium">Кружков:</span>
                <span class="text-primary col-start-2 text-end text-lg font-medium">{{
                    sub.clubs.length
                }}</span>
                <span class="text-default col-start-1 row-start-2 text-lg font-medium"
                    >Стоимость:</span
                >
                <span class="text-primary col-start-2 text-end text-lg font-medium"
                    >{{ sub.sum }}р</span
                >
            </div>
            <USeparator />
            <div v-if="isClubsShown" class="flex flex-col gap-2">
                <div
                    v-for="(club, idx) in clubsSortedByLeft"
                    :key="idx"
                    class="flex items-center gap-4"
                    :class="{ 'opacity-75': club.left === 0 }"
                >
                    <div
                        :class="{
                            'bg-secondary/5 text-secondary animate-pulse': club.left > 0
                        }"
                        class="relative flex aspect-square size-5 min-h-0 min-w-0 shrink-0 items-center justify-center rounded-full"
                    >
                        <div
                            class="absolute top-1/2 left-1/2 flex h-full w-full -translate-1/2 items-center justify-center text-center text-xl leading-[0.025rem]"
                        >
                            •
                        </div>
                    </div>
                    <div class="grid">
                        <span class="text-default line-clamp-1 text-lg leading-tight font-medium">{{
                            club.name
                        }}</span>
                        <span class="text-default/75 line-clamp-1 text-sm leading-tight">
                            {{ club.subgroup.name }}
                        </span>
                        <span class="text-default/75 line-clamp-1 text-sm leading-tight">
                            {{ club.weeklySlot.dayOfWeek }}
                            {{ club.weeklySlot.startTime }}-{{ club.weeklySlot.endTime }}
                        </span>
                    </div>
                    <span class="text-primary ml-auto text-lg font-bold"
                        ><span :class="club.left > 0 ? 'text-secondary' : 'text-default/25'">{{
                            club.left
                        }}</span
                        >/{{ club.maxUses }}</span
                    >
                </div>
            </div>
            <UButton
                size="sm"
                class="text-lg"
                :variant="isClubsShown ? 'ghost' : 'soft'"
                block
                @click="() => toggleClubsShown()"
            >
                {{ isClubsShown ? "Скрыть" : "Показать кружки" }}
            </UButton>
            <USeparator />
            <div class="grid gap-1">
                <div class="flex items-center justify-between gap-2 px-1">
                    <span class="text-default/75 text-sm font-medium">Записан:</span>
                    <span class="text-default text-sm font-semibold">{{
                        sub.participant.name
                    }}</span>
                </div>
                <div class="flex items-center justify-between gap-2 px-1">
                    <span class="text-default/75 text-sm font-medium">Оформлен:</span>
                    <span class="text-default text-sm font-semibold">{{
                        new Date(sub.createdAt).toLocaleDateString("ru-RU", {
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
