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
    <div class="gradient-bg-ps min-h-dvh pt-(--ui-header-height)">
        <section aria-label="Результат оплаты" class="px-4 py-12 md:py-20">
            <div class="mx-auto w-full max-w-md">
                <CheckoutResultWidget v-if="txId" :tx-id="txId" />

                <!-- ПОЧЕМУ: ЮKassa пока возвращает без ?tx= – опрашивать нечего, статус смотрим в кабинете -->
                <CheckoutResultCard
                    v-else
                    title="Вы вернулись из банка"
                    description="Если оплата прошла, запись появится в личном кабинете в течение пары минут."
                >
                    <template #icon>
                        <UIcon
                            name="ph:bank-duotone"
                            class="text-primary size-20"
                            aria-hidden="true"
                        />
                    </template>
                    <template #actions>
                        <UButton to="/me" label="В личный кабинет" size="xl" block />
                    </template>
                </CheckoutResultCard>
            </div>
        </section>
    </div>
</template>
