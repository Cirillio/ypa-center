<script lang="ts" setup>
// Подтверждение брони бесплатного события: места закреплены сразу, платное уходит на оплату.
import type { DeepReadonly } from "vue"

import type { EventRegistrationResult } from "~/types"

defineProps<{
    result: DeepReadonly<EventRegistrationResult>
}>()
</script>

<template>
    <CheckoutResultCard
        eyebrow="Заявка принята"
        title="УРА!"
        description="Места закреплены. До встречи на Улице Радости!"
        hero
    >
        <template #icon>
            <CheckoutConfetti />
            <UiMascot mood="joy" />
        </template>

        <dl class="bg-default flex w-full flex-col gap-2.5 rounded-sm px-5 py-4 text-start text-sm">
            <div class="flex items-baseline justify-between gap-3">
                <dt class="text-muted font-semibold">Событие</dt>
                <dd class="text-default text-end font-bold">{{ result.eventTitle }}</dd>
            </div>
            <div class="flex items-baseline justify-between gap-3">
                <dt class="text-muted font-semibold">Когда</dt>
                <dd class="text-default text-end font-bold">
                    {{ formatEventDateTime(result.startDatetime) }}
                </dd>
            </div>
            <div class="flex items-baseline justify-between gap-3">
                <dt class="text-muted font-semibold">Мест</dt>
                <dd class="text-default font-bold tabular-nums">{{ result.seats }}</dd>
            </div>
        </dl>

        <template #actions>
            <UButton to="/" label="На главную" size="xl" block class="sm:flex-1" />
            <UButton
                to="/clubs"
                label="Посмотреть кружки"
                variant="soft"
                size="xl"
                block
                class="sm:flex-1"
            />
        </template>
    </CheckoutResultCard>
</template>
