<script lang="ts" setup>
// Экран результата оплаты: опрашивает статус транзакции и показывает одно из пяти состояний.
import { PAYMENT_CANCEL_FALLBACK, PAYMENT_CANCEL_REASONS } from "~/constants/payment-cancel-reasons"

const props = defineProps<{
    txId: string
}>()

const { viewState, transaction } = useTransactionStatus(props.txId)

// Конструктор, куда вернуться после отказа; тип неизвестен – в каталог
const retryPath = computed<string>(() => {
    if (transaction.value?.type === "SUBSCRIPTION") return "/enroll/subscription"
    if (transaction.value?.type === "TRIAL") return "/enroll/trial"
    return "/clubs"
})

const successDescription = computed<string>(() => {
    const amount = transaction.value?.amount ?? 0
    return amount > 0
        ? `Оплачено ${formatRubles(amount)}. Запись уже в личном кабинете.`
        : "Оплачено с депозита. Запись уже в личном кабинете."
})

const cancelReason = computed<string>(() => {
    const reason = transaction.value?.canceledReason
    return (reason && PAYMENT_CANCEL_REASONS[reason]) ?? PAYMENT_CANCEL_FALLBACK
})
</script>

<template>
    <div aria-live="polite">
        <CheckoutResultCard
            v-if="viewState === 'pending'"
            title="Подтверждаем оплату"
            description="Обычно это занимает несколько секунд. Не закрывайте страницу."
        >
            <template #icon>
                <div class="flex h-20 items-center gap-3" aria-hidden="true">
                    <span class="pending-dot" />
                    <span class="pending-dot [animation-delay:160ms]" />
                    <span class="pending-dot [animation-delay:320ms]" />
                </div>
            </template>
        </CheckoutResultCard>

        <CheckoutResultCard
            v-else-if="viewState === 'success'"
            title="Заказ оформлен!"
            :description="successDescription"
        >
            <template #icon>
                <CheckoutSuccessMark />
            </template>
            <template #actions>
                <UButton to="/me" label="В личный кабинет" size="xl" block />
                <UButton to="/clubs#schedule" label="К расписанию" variant="soft" size="xl" block />
            </template>
        </CheckoutResultCard>

        <CheckoutResultCard
            v-else-if="viewState === 'canceled'"
            :title="cancelReason"
            description="Деньги не списаны. Место не забронировано – оформите заказ заново."
        >
            <template #icon>
                <UIcon name="ph:x-circle-duotone" class="text-error size-20" aria-hidden="true" />
            </template>
            <template #actions>
                <UButton :to="retryPath" label="Попробовать снова" size="xl" block />
                <UButton to="/me" label="В личный кабинет" variant="soft" size="xl" block />
            </template>
        </CheckoutResultCard>

        <CheckoutResultCard
            v-else-if="viewState === 'timeout'"
            title="Банк отвечает дольше обычного"
            description="Не переживайте: как только подтверждение придёт, запись появится в личном кабинете."
        >
            <template #icon>
                <UIcon
                    name="ph:hourglass-medium-duotone"
                    class="text-primary size-20"
                    aria-hidden="true"
                />
            </template>
            <template #actions>
                <UButton to="/me" label="В личный кабинет" size="xl" block />
            </template>
        </CheckoutResultCard>

        <CheckoutResultCard
            v-else
            title="Заказ не найден"
            description="Ссылка устарела или заказ оформлен с другого аккаунта."
        >
            <template #icon>
                <UIcon
                    name="ph:question-duotone"
                    class="text-primary/30 size-20"
                    aria-hidden="true"
                />
            </template>
            <template #actions>
                <UButton to="/me" label="В личный кабинет" size="xl" block />
            </template>
        </CheckoutResultCard>
    </div>
</template>
