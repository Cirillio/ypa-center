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

const stamp = computed(() =>
    sub.isExpired
        ? { text: "Завершён", class: "border-default/20 text-default/40 bg-default/5" }
        : { text: "Активен", class: "border-secondary/40 text-secondary bg-secondary/5" }
)

const isClubsShown = ref<boolean>(false)
const toggleClubsShown = () => {
    isClubsShown.value = !isClubsShown.value
}
</script>

<template>
    <div class="relative overflow-hidden rounded-lg">
        <!-- Статусная «печать» в углу -->
        <div
            class="absolute top-3.5 right-3.5 z-20 -rotate-6 rounded-md border px-2.5 py-0.5 text-xs font-bold tracking-wider uppercase"
            :class="stamp.class"
        >
            {{ stamp.text }}
        </div>

        <div
            :class="{ 'opacity-75': sub.isExpired }"
            class="via-default to-default from-default hover:from-secondary/80 hover:to-primary/80 bg-linear-to-tl p-px transition-colors duration-150 ease-in"
        >
            <div class="bg-default flex flex-col gap-4 rounded-lg p-3.75">
                <!-- Шапка: тип + номер -->
                <div class="flex items-center gap-4">
                    <MyCabinetActivityTypeBadge type="subscription" />
                    <div class="grid">
                        <span class="text-default/75 text-base leading-tight">Абонемент</span>
                        <span class="text-default text-lg leading-tight font-semibold">
                            #{{ sub.id }}
                        </span>
                    </div>
                </div>

                <USeparator />

                <!-- Сводка -->
                <dl class="flex flex-col gap-2">
                    <div
                        v-for="row in rows"
                        :key="row.label"
                        class="flex items-center justify-between gap-2 px-1"
                    >
                        <dt class="text-default/70 text-sm font-medium">{{ row.label }}</dt>
                        <dd
                            class="text-default text-end text-sm font-semibold"
                            :class="{ 'text-default/40': row.muted }"
                        >
                            {{ row.value }}
                        </dd>
                    </div>
                </dl>

                <!-- Кружки абонемента -->
                <UButton
                    class="w-fit"
                    :variant="isClubsShown ? 'ghost' : 'soft'"
                    @click="toggleClubsShown"
                >
                    {{ isClubsShown ? "Скрыть" : `Показать кружки (${sub.clubs.length})` }}
                </UButton>
                <div v-if="isClubsShown" class="grid gap-2 sm:grid-cols-2">
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
            </div>
        </div>
    </div>
</template>
