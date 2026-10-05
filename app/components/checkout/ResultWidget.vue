<script lang="ts" setup>
// Экран результата оплаты: опрашивает статус транзакции и показывает одно из шести состояний с маскотом.
import { REFUND_REASONS } from "~/constants/refund-reasons"
import type { CheckoutResultKind } from "~/types"

const EVENTS_PATH = "/enroll/event"

const props = withDefaults(
    defineProps<{
        txId: string
        kind?: CheckoutResultKind
    }>(),
    { kind: "purchase" }
)

const { viewState, transaction } = useTransactionStatus(props.txId, props.kind)

// ПОЧЕМУ по kind, а не по ответу: при 404 ответа нет, а гостя всё равно нельзя слать в кабинет
const isEvent = computed(() => props.kind === "event")
const eventOrder = computed(() =>
    transaction.value?.order.kind === "event" ? transaction.value.order : null
)

// Куда вернуться после отказа: то же событие, конструктор покупки или каталог
const retryPath = computed<string>(() => {
    if (isEvent.value)
        return eventOrder.value ? `${EVENTS_PATH}?eventId=${eventOrder.value.eventId}` : EVENTS_PATH
    if (transaction.value?.type === "SUBSCRIPTION") return "/enroll/subscription"
    if (transaction.value?.type === "TRIAL") return "/enroll/trial"
    return "/clubs"
})

// Успех события называет событие, время и места – чек у гостя единственный след покупки
const successDescription = computed<string>(() => {
    const order = eventOrder.value
    if (!order) return "Вы записаны. До встречи на Улице Радости!"
    return `Вы записаны на «${order.title}», ${formatEventDateTime(order.startsAt)}, мест: ${order.attendeesCount}`
})

// Текст возврата: общий срок плюс причина, если бэк её знает
const refundDescription = computed<string>(() => {
    const reason = transaction.value?.reason
    const detail = reason ? REFUND_REASONS[reason] : undefined
    const base =
        "Деньги вернутся на карту, обычно за несколько дней. Если понадобится что-то уточнить, мы свяжемся с вами."
    return detail ? `${detail} ${base}` : base
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
            :description="successDescription"
            hero
        >
            <template #icon>
                <CheckoutConfetti />
                <UiMascot mood="joy" />
            </template>

            <CheckoutReceipt :transaction="transaction" />

            <template #actions>
                <template v-if="isEvent">
                    <UButton to="/" label="На главную" size="xl" block class="sm:flex-1" />
                    <UButton
                        :to="EVENTS_PATH"
                        label="К афише"
                        variant="soft"
                        size="xl"
                        block
                        class="sm:flex-1"
                    />
                </template>
                <template v-else>
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
            </template>
        </CheckoutResultCard>

        <CheckoutResultCard
            v-else-if="viewState === 'canceled'"
            eyebrow="Оплата не прошла"
            title="Оплата не прошла или была отменена"
            description="Если деньги всё же списались – они вернутся автоматически. Соберите заказ заново."
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
                    :to="isEvent ? EVENTS_PATH : '/me'"
                    :label="isEvent ? 'К афише' : 'В личный кабинет'"
                    variant="soft"
                    size="xl"
                    block
                    class="sm:flex-1"
                />
            </template>
        </CheckoutResultCard>

        <CheckoutResultCard
            v-else-if="viewState === 'refund'"
            eyebrow="Оплата прошла"
            title="Оформить заказ не получилось"
            :description="refundDescription"
        >
            <template #icon>
                <UiMascot mood="cloudy" />
            </template>
            <template #actions>
                <UButton
                    :to="isEvent ? EVENTS_PATH : retryPath"
                    :label="isEvent ? 'К афише' : 'Выбрать другую группу'"
                    size="xl"
                    block
                    class="sm:flex-1"
                />
                <UButton
                    :to="isEvent ? '/' : '/me'"
                    :label="isEvent ? 'На главную' : 'В личный кабинет'"
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
            description="Проверка оплаты занимает больше времени, чем обычно. Обновите эту страницу через несколько минут – оплачивать повторно не нужно."
        >
            <template #icon>
                <UiMascot mood="wait" />
            </template>
            <template #actions>
                <UButton
                    label="Обновить страницу"
                    trailing-icon="ph:arrow-clockwise-bold"
                    size="xl"
                    block
                    @click="reloadNuxtApp()"
                />
            </template>
        </CheckoutResultCard>

        <CheckoutResultCard
            v-else
            eyebrow="Заказ не найден"
            title="Такого заказа на нашей улице нет"
            :description="
                isEvent
                    ? 'Ссылка устарела или оплата не найдена. Выберите событие в афише заново.'
                    : 'Ссылка устарела или заказ оформлен с другого аккаунта. Все ваши записи – в личном кабинете.'
            "
        >
            <template #icon>
                <CheckoutStreet />
            </template>
            <template #actions>
                <UButton
                    :to="isEvent ? EVENTS_PATH : '/me'"
                    :label="isEvent ? 'К афише' : 'В личный кабинет'"
                    size="xl"
                    block
                />
            </template>
        </CheckoutResultCard>
    </div>
</template>
