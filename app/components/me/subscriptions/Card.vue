<script lang="ts" setup>
// Карточка абонемента с балансом занятий, статусом и списком входящих кружков.
import type { MeSubscription } from "~/types"

const props = defineProps<{
    sub: MeSubscription
}>()

const rows = computed(() => [
    { label: "Кружков", value: String(props.sub.slots.length) },
    {
        label: "Остаток посещений",
        value: `${props.sub.totalRemaining}/${props.sub.totalMax}`,
        muted: props.sub.totalRemaining === 0
    },
    { label: "Стоимость", value: formatRubles(props.sub.sum) },
    { label: "Ребёнок", value: props.sub.studentName },
    { label: "Дата покупки", value: props.sub.formattedCreatedAt }
])

const stamp = computed(() => {
    switch (props.sub.status) {
        case "ACTIVE":
            return {
                text: "Активен",
                class: "border-secondary/40 text-secondary bg-secondary/5"
            }
        case "PENDING":
            return {
                text: "Ожидает оплаты",
                class: "border-amber-500/40 text-amber-600 bg-amber-500/5"
            }
        case "CANCELED":
            return {
                text: "Отменён",
                class: "border-error/40 text-error bg-error/5"
            }
        case "EXPIRED":
        default:
            return {
                text: "Истёк",
                class: "border-default/20 text-default/40 bg-default/5"
            }
    }
})

const isClubsShown = ref<boolean>(false)
const toggleClubsShown = () => {
    isClubsShown.value = !isClubsShown.value
}
</script>

<template>
    <div
        :class="{ 'opacity-75': sub.status === 'EXPIRED' || sub.status === 'CANCELED' }"
        class="relative overflow-hidden rounded-lg"
    >
        <div
            class="absolute top-3.5 right-3.5 z-20 -rotate-6 rounded-md border px-2.5 py-0.5 text-xs font-bold tracking-wider uppercase"
            :class="stamp.class"
        >
            {{ stamp.text }}
        </div>
        <div class="bg-default flex flex-col gap-4 rounded-lg p-3.75">
            <!-- Шапка: тип + номер -->
            <div class="flex items-center gap-4">
                <MeActivityTypeBadge type="subscription" />
                <div class="grid">
                    <span class="text-default/75 text-base leading-tight">Абонемент</span>
                    <span class="text-default text-lg leading-tight font-semibold">
                        {{ sub.displayId }}
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
                {{ isClubsShown ? "Скрыть" : `Показать кружки (${sub.slots.length})` }}
            </UButton>
            <div v-if="isClubsShown" class="grid gap-2 sm:grid-cols-2">
                <MeSubscriptionsSlotItem
                    v-for="slot in sub.slots"
                    :key="slot.scheduleId"
                    :title="slot.activityName"
                    :desc="slot.groupName"
                    :datetime="slot.schedule"
                    :is-active="slot.remaining > 0"
                >
                    <template #trailing>
                        <span class="text-primary text-lg leading-tight font-bold">
                            <span
                                :class="slot.remaining > 0 ? 'text-secondary' : 'text-default/25'"
                            >
                                {{ slot.remaining }}
                            </span>
                            /{{ slot.total }}
                        </span>
                    </template>
                </MeSubscriptionsSlotItem>
            </div>
        </div>
    </div>
</template>
