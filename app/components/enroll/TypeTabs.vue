<script lang="ts" setup>
// Навигация-переключатель между тремя типами записи: пробное занятие, абонемент и событие.
import { EnrollRoutesEnum } from "~/constants/nav"
import type { EnrollPurchaseType } from "~/types"

defineProps<{
    active: EnrollPurchaseType
}>()

interface EnrollTabItem {
    id: EnrollPurchaseType
    label: string
    icon: string
    to: string
}

const ITEMS: EnrollTabItem[] = [
    {
        id: "trial",
        label: "Пробное",
        icon: "ph:person-simple-run-bold",
        to: EnrollRoutesEnum.Trial
    },
    {
        id: "subscription",
        label: "Абонемент",
        icon: "ph:puzzle-piece-bold",
        to: EnrollRoutesEnum.Subscription
    },
    {
        id: "event",
        label: "Событие",
        icon: "ph:ticket-bold",
        to: EnrollRoutesEnum.Event
    }
]
</script>

<template>
    <nav
        aria-label="Тип покупки"
        class="no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-full bg-white p-1"
    >
        <UButton
            v-for="item in ITEMS"
            :key="item.id"
            :to="item.to"
            :label="item.label"
            :leading-icon="item.icon"
            :color="item.id === active ? 'primary' : 'neutral'"
            :variant="item.id === active ? 'solid' : 'ghost'"
            :aria-current="item.id === active ? 'page' : undefined"
            class="shrink-0 gap-1.5 rounded-full px-4! py-2! text-base font-bold transition-colors"
            :class="
                item.id === active
                    ? 'text-white'
                    : 'text-default hover:bg-primary/10 hover:text-primary'
            "
            :ui="{ leadingIcon: 'size-4.5 shrink-0' }"
        />
    </nav>
</template>
