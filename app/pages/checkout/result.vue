<script lang="ts" setup>
// Экран возврата после оплаты: по ?tx= опрашивает статус, без него – подсказывает, где смотреть результат.
definePageMeta({ middleware: "auth" })
useSeoMeta({ title: "Результат оплаты" })

const route = useRoute()
// ПОЧЕМУ проверка формы: в опрос не уходит мусор из адресной строки
const txId = computed<string | undefined>(() => {
    const raw = parseQueryParam(route.query.tx)
    return raw && /^[\w-]{1,64}$/.test(raw) ? raw : undefined
})
</script>

<template>
    <div class="gradient-bg-ps-hero min-h-dvh pt-(--ui-header-height)">
        <!-- ПОЧЕМУ верхний отступ: маскот выглядывает из-за края карточки -->
        <section aria-label="Результат оплаты" class="px-4 pt-32 pb-16 md:pt-36 md:pb-24">
            <div class="mx-auto w-full max-w-lg">
                <CheckoutResultWidget v-if="txId" :tx-id="txId" />

                <!-- ПОЧЕМУ: ЮKassa пока возвращает без ?tx= – опрашивать нечего, статус смотрим в кабинете -->
                <CheckoutResultCard
                    v-else
                    eyebrow="С возвращением"
                    title="Вы вернулись из банка"
                    description="Если оплата прошла, запись появится в личном кабинете в течение пары минут."
                >
                    <template #icon>
                        <CheckoutMascot mood="wait" />
                    </template>
                    <template #actions>
                        <UButton to="/me" label="В личный кабинет" size="xl" block />
                    </template>
                </CheckoutResultCard>
            </div>
        </section>
    </div>
</template>
