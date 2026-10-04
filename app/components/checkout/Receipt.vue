<script lang="ts" setup>
// Чек успешного заказа и короткое «что дальше»: только проверяемые факты – кабинет, адрес, срок абонемента.
import type { DeepReadonly } from "vue"

import type { CheckoutTransaction } from "~/types"

const props = defineProps<{
    transaction: DeepReadonly<CheckoutTransaction>
}>()

const { contactInfo } = useAppConfig()

// ПОЧЕМУ разбор строкой: new Date("YYYY-MM-DD") – полночь UTC, в минусовых поясах съехал бы день
const trialDateLabel = computed<string | null>(() => {
    const raw = props.transaction.order.trialDate
    if (!raw) return null
    const [year, month, day] = raw.split("-").map(Number)
    if (!year || !month || !day) return null
    return new Date(year, month - 1, day).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        weekday: "short"
    })
})

const paymentLabel = computed(() => (props.transaction.amount > 0 ? "Через ЮKassa" : "С депозита"))

// Короткий номер для разговора с администратором: полный UUID по телефону не продиктуешь
const orderNumber = computed(() => props.transaction.id.slice(0, 8).toUpperCase())
</script>

<template>
    <div class="flex w-full flex-col gap-4 text-start">
        <dl class="bg-default flex flex-col gap-2.5 rounded-sm px-5 py-4 text-sm">
            <div class="flex items-baseline justify-between gap-3">
                <dt class="text-muted font-semibold">Покупка</dt>
                <dd class="text-default text-end font-bold">{{ transaction.order.title }}</dd>
            </div>
            <div class="flex items-baseline justify-between gap-3">
                <dt class="text-muted font-semibold">Ребёнок</dt>
                <dd class="text-default text-end font-bold">{{ transaction.order.studentName }}</dd>
            </div>
            <div v-if="trialDateLabel" class="flex items-baseline justify-between gap-3">
                <dt class="text-muted font-semibold">Дата</dt>
                <dd class="text-default text-end font-bold">{{ trialDateLabel }}</dd>
            </div>
            <div
                v-if="transaction.order.slots.length"
                class="flex items-baseline justify-between gap-3"
            >
                <dt class="text-muted font-semibold">
                    {{ transaction.order.slots.length > 1 ? "Занятия" : "Занятие" }}
                </dt>
                <dd class="flex flex-col items-end gap-1">
                    <span
                        v-for="slot in transaction.order.slots"
                        :key="slot.scheduleId"
                        class="text-default text-end font-bold"
                    >
                        {{ slot.activityName }} · {{ slot.groupName }}
                        <span class="text-muted font-semibold whitespace-nowrap">
                            {{ getDayName("short", slot.dayOfWeek) }} {{ slot.startTime }}–{{
                                slot.endTime
                            }}
                        </span>
                    </span>
                </dd>
            </div>
            <div class="flex items-baseline justify-between gap-3">
                <dt class="text-muted font-semibold">Оплата</dt>
                <dd class="text-default font-bold">{{ paymentLabel }}</dd>
            </div>
            <div class="flex items-baseline justify-between gap-3">
                <dt class="text-muted font-semibold">Номер заказа</dt>
                <dd class="text-default font-bold tracking-wide tabular-nums">
                    {{ orderNumber }}
                </dd>
            </div>
            <USeparator class="my-1" />
            <div class="flex items-baseline justify-between gap-3">
                <dt class="text-muted font-semibold">Итого</dt>
                <dd class="text-primary text-2xl font-extrabold whitespace-nowrap">
                    {{ formatRubles(transaction.amount) }}
                </dd>
            </div>
        </dl>

        <section aria-label="Что дальше" class="flex flex-col gap-3">
            <h2 class="text-default text-base font-bold">Что дальше</h2>
            <ol class="flex flex-col gap-3">
                <li class="flex items-start gap-3">
                    <UiRoundIcon name="ph:user-circle-bold" />
                    <span class="text-default text-sm font-semibold">
                        Запись уже в
                        <NuxtLink to="/me" class="text-primary underline-offset-2 hover:underline">
                            личном кабинете
                        </NuxtLink>
                        – там расписание и все покупки.
                    </span>
                </li>
                <li v-if="transaction.type === 'SUBSCRIPTION'" class="flex items-start gap-3">
                    <UiRoundIcon name="ph:calendar-check-bold" />
                    <span class="text-default text-sm font-semibold">
                        Абонемент действует месяц с первого занятия.
                    </span>
                </li>
                <li class="flex items-start gap-3">
                    <UiRoundIcon name="ph:map-pin-bold" />
                    <span class="text-default text-sm font-semibold">
                        Ждём вас:
                        <a
                            :href="contactInfo.mapLink"
                            target="_blank"
                            rel="noopener"
                            class="text-primary underline-offset-2 hover:underline"
                        >
                            {{ contactInfo.address }}
                        </a>
                    </span>
                </li>
            </ol>
        </section>
    </div>
</template>
