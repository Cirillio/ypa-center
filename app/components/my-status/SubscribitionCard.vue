<script lang="ts" setup>
import type { StatusSubscription } from "~/types/status"

const sub = defineProps<StatusSubscription>()

const clubsSortedByLeft = computed(() => [...sub.clubs].sort((a, b) => b.left - a.left))

const isClubsShown = ref<boolean>(false)

const toggleClubsShown = () => {
    isClubsShown.value = !isClubsShown.value
}
</script>

<template>
    <MyStatusActivityCard
        :id="sub.id"
        subtitle="Абонемент"
        color="rose"
        icon="ph:star-bold"
        :participant="sub.participant.name"
        :created-at="sub.createdAt"
        :status-text="sub.isExpired ? 'Завершено' : undefined"
    >
        <template #details>
            <span class="text-default text-lg font-medium">Кружков:</span>
            <span class="text-primary col-start-2 text-end text-lg font-medium">
                {{ sub.clubs.length }}
            </span>
            <span class="text-default col-start-1 row-start-2 text-lg font-medium">
                Стоимость:
            </span>
            <span class="text-primary col-start-2 text-end text-lg font-medium">
                {{ sub.sum }}р
            </span>
        </template>

        <div v-if="isClubsShown" class="flex flex-col gap-2">
            <MyStatusActivityItem
                v-for="(club, idx) in clubsSortedByLeft"
                :key="idx"
                :title="club.name"
                :desc="club.subgroup.name"
                :datetime="`${club.weeklySlot.dayOfWeek} ${club.weeklySlot.startTime}-${club.weeklySlot.endTime}`"
                :is-active="club.left > 0"
            >
                <template #trailing>
                    <span class="text-primary text-lg font-bold">
                        <span :class="club.left > 0 ? 'text-secondary' : 'text-default/25'">
                            {{ club.left }}
                        </span>
                        /{{ club.maxUses }}
                    </span>
                </template>
            </MyStatusActivityItem>
        </div>

        <UButton
            size="sm"
            class="text-lg"
            :variant="isClubsShown ? 'ghost' : 'soft'"
            block
            @click="toggleClubsShown"
        >
            {{ isClubsShown ? "Скрыть" : "Показать кружки" }}
        </UButton>
    </MyStatusActivityCard>
</template>
