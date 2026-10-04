<script lang="ts" setup>
// Экран результата оплаты: опрашивает статус транзакции и показывает одно из пяти состояний с маскотом.
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

const cancelReason = computed<string>(() => {
    const reason = transaction.value?.canceledReason
    return (reason && PAYMENT_CANCEL_REASONS[reason]) ?? PAYMENT_CANCEL_FALLBACK
})
</script>

<template>
    <div aria-live="polite">
        <CheckoutResultCard
            v-if="viewState === 'pending'"
            eyebrow="Секундочку"
            title="Подтверждаем оплату"
            description="Банк проверяет платёж – обычно это пара секунд. Не закрывайте страницу."
        >
            <template #icon>
                <UiMascot mood="spin" />
            </template>
        </CheckoutResultCard>

        <CheckoutResultCard
            v-else-if="viewState === 'success' && transaction"
            eyebrow="Оплата прошла"
            title="УРА!"
            description="Вы записаны. До встречи на Улице Радости!"
            hero
        >
            <template #icon>
                <CheckoutConfetti />
                <UiMascot mood="joy" />
            </template>

            <CheckoutReceipt :transaction="transaction" />

            <template #actions>
                <UButton to="/me" label="В личный кабинет" size="xl" block class="sm:flex-1" />
                <UButton
                    to="/clubs#schedule"
                    label="К расписанию"
                    variant="soft"
                    size="xl"
                    block
                    class="sm:flex-1"
                />
            </template>
        </CheckoutResultCard>

        <CheckoutResultCard
            v-else-if="viewState === 'canceled'"
            eyebrow="Оплата не прошла"
            :title="cancelReason"
            description="Деньги не списаны, место не забронировано. Ничего страшного – соберите заказ заново."
        >
            <template #icon>
                <UiMascot mood="cloudy" />
            </template>
            <template #actions>
                <UButton
                    :to="retryPath"
                    label="Попробовать снова"
                    trailing-icon="ph:arrow-clockwise-bold"
                    size="xl"
                    block
                    class="sm:flex-1"
                />
                <UButton
                    to="/me"
                    label="В личный кабинет"
                    variant="soft"
                    size="xl"
                    block
                    class="sm:flex-1"
                />
            </template>
        </CheckoutResultCard>

        <CheckoutResultCard
            v-else-if="viewState === 'timeout'"
            eyebrow="Почти готово"
            title="Банк думает чуть дольше"
            description="Как только подтверждение придёт, запись сама появится в личном кабинете. Оплачивать повторно не нужно."
        >
            <template #icon>
                <UiMascot mood="wait" />
            </template>
            <template #actions>
                <UButton to="/me" label="В личный кабинет" size="xl" block />
            </template>
        </CheckoutResultCard>

        <CheckoutResultCard
            v-else
            eyebrow="Заказ не найден"
            title="Такого заказа на нашей улице нет"
            description="Ссылка устарела или заказ оформлен с другого аккаунта. Все ваши записи – в личном кабинете."
        >
            <template #icon>
                <CheckoutStreet />
            </template>
            <template #actions>
                <UButton to="/me" label="В личный кабинет" size="xl" block />
            </template>
        </CheckoutResultCard>
    </div>
</template>
