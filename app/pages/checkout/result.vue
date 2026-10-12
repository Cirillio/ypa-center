<script lang="ts" setup>
// Экран возврата после оплаты: по ?tx= опрашивает статус, без него – подсказывает, где смотреть результат.
definePageMeta({
    middleware: "auth",
    // ПОЧЕМУ: событие оплачивает гость – его результат открыт без входа
    authSkip: (route) => parseCheckoutResultKind(route.query.kind) === "event"
})
useSeoMeta({ title: "Результат оплаты" })

const route = useRoute()
// ПОЧЕМУ проверка формы: в опрос не уходит мусор из адресной строки
const txId = computed<string | undefined>(() => {
    const raw = parseQueryParam(route.query.tx)
    return raw && /^[\w-]{1,64}$/.test(raw) ? raw : undefined
})
const kind = computed(() => parseCheckoutResultKind(route.query.kind))
</script>

<template>
    <div class="gradient-bg-ps-hero min-h-dvh pt-(--ui-header-height)">
        <!-- ПОЧЕМУ верхний отступ: маскот выглядывает из-за края карточки -->
        <section aria-label="Результат оплаты" class="px-4 pt-32 pb-16 md:pt-36 md:pb-24">
            <div class="mx-auto w-full max-w-lg">
                <CheckoutResultWidget v-if="txId" :tx-id="txId" :kind="kind" />

                <!-- ПОЧЕМУ: без ?tx= опрашивать нечего (адрес набран руками или обрезан) – статус в кабинете -->
                <CheckoutResultCard
                    v-else
                    eyebrow="С возвращением"
                    title="Вы вернулись из банка"
                    description="Если оплата прошла, запись появится в личном кабинете в течение пары минут."
                >
                    <template #icon>
                        <UiMascot mood="wait" />
                    </template>
                    <template #actions>
                        <UButton to="/me" label="В личный кабинет" size="xl" block />
                    </template>
                </CheckoutResultCard>
            </div>
        </section>
    </div>
</template>
