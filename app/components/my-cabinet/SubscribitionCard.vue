<script lang="ts" setup>
import type { StatusSubscription } from "~/types/status"

const sub = defineProps<StatusSubscription>()

const clubsSortedByLeft = computed(() => [...sub.clubs].sort((a, b) => b.left - a.left))

const totalLeft = computed(() => sub.clubs.reduce((acc, c) => acc + c.left, 0))
const totalMax = computed(() => sub.clubs.reduce((acc, c) => acc + c.maxUses, 0))

const formattedCreatedAt = computed(() =>
    new Date(sub.createdAt).toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric"
    })
)

const rows = computed(() => [
    { label: "Кружков", value: String(sub.clubs.length) },
    {
        label: "Остаток посещений",
        value: `${totalLeft.value}/${totalMax.value}`,
        muted: totalLeft.value === 0
    },
    { label: "Стоимость", value: `${sub.sum}р` },
    { label: "Ребёнок", value: sub.participant.name },
    { label: "Дата покупки", value: formattedCreatedAt.value }
])

const status = computed(() =>
    sub.isExpired
        ? { text: "Завершён", variant: "done" as const }
        : { text: "Активен", variant: "live" as const }
)

const isClubsShown = ref<boolean>(false)
const toggleClubsShown = () => {
    isClubsShown.value = !isClubsShown.value
}
</script>

<template>
    <MyCabinetActivityCard
        :id="sub.id"
        type-badge="Абонемент"
        color="rose"
        icon="ph:star-bold"
        :rows="rows"
        :status="status"
    >
        <template #expand>
            <UButton
                class="w-fit"
                :variant="isClubsShown ? 'ghost' : 'soft'"
                @click="toggleClubsShown"
            >
                {{ isClubsShown ? "Скрыть" : `Показать кружки (${sub.clubs.length})` }}
            </UButton>
            <div v-if="isClubsShown" class="flex flex-col gap-2">
                <MyCabinetActivityItem
                    v-for="(club, idx) in clubsSortedByLeft"
                    :key="idx"
                    :title="club.name"
                    :desc="club.subgroup.name"
                    :datetime="`${club.weeklySlot.dayOfWeek} ${club.weeklySlot.startTime}-${club.weeklySlot.endTime}`"
                    :is-active="club.left > 0"
                >
                    <template #trailing>
                        <span class="text-primary text-lg leading-tight font-bold">
                            <span :class="club.left > 0 ? 'text-secondary' : 'text-default/25'">
                                {{ club.left }}
                            </span>
                            /{{ club.maxUses }}
                        </span>
                    </template>
                </MyCabinetActivityItem>
            </div>
        </template>
    </MyCabinetActivityCard>
</template>
