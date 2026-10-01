<script lang="ts" setup>
// Чек успешного заказа и короткое «что дальше»: только проверяемые факты – кабинет, адрес, срок абонемента.
import type { CheckoutTransaction } from "~/types"

const props = defineProps<{
    transaction: CheckoutTransaction
}>()

const { contactInfo } = useAppConfig()

const purchaseLabel = computed(() =>
    props.transaction.type === "SUBSCRIPTION" ? "Абонемент на месяц" : "Пробное занятие"
)

const paymentLabel = computed(() => (props.transaction.amount > 0 ? "Через ЮKassa" : "С депозита"))

// Короткий номер для разговора с администратором: полный UUID по телефону не продиктуешь
const orderNumber = computed(() => props.transaction.id.slice(0, 8).toUpperCase())
</script>

<template>
    <div class="flex w-full flex-col gap-4 text-start">
        <dl class="bg-default flex flex-col gap-2.5 rounded-sm px-5 py-4 text-sm">
            <div class="flex items-baseline justify-between gap-3">
                <dt class="text-muted font-semibold">Покупка</dt>
                <dd class="text-default font-bold">{{ purchaseLabel }}</dd>
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
