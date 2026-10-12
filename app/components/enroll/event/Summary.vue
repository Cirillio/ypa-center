<script lang="ts" setup>
// Сводка «Итого» события: выбранное событие, места и контакты (слот), сумма и кнопка.
import type { CheckoutError, EventItem } from "~/types"

const FALLBACK_COVER = "/core/clubs-main.jpg"

const props = defineProps<{
    event: EventItem | null
    seats: number
    isFree: boolean
    totalKopecks: number
    contactsValid: boolean
    loading: boolean
    cooldownSeconds: number
    error: CheckoutError | null
}>()

const emit = defineEmits<{
    continue: []
}>()

const amount = computed(() => {
    if (!props.event) return "—"
    return props.isFree ? "Бесплатно" : formatRub(props.totalKopecks)
})

const missing = computed<string[]>(() => {
    const list: string[] = []
    if (!props.event) list.push("событие")
    if (!props.contactsValid) list.push("контакты")
    return list
})
</script>

<template>
    <EnrollSummaryCard>
        <div v-if="event" class="bg-default flex items-center gap-3 rounded-sm p-2">
            <div class="size-14 shrink-0 overflow-hidden rounded-xs">
                <UiPhoto
                    :src="event.cover_image || FALLBACK_COVER"
                    :alt="event.title"
                    class="object-cover object-center"
                />
            </div>
            <div class="grid min-w-0">
                <span class="text-default truncate text-base leading-tight font-bold">
                    {{ event.title }}
                </span>
                <span class="text-muted text-sm leading-tight">
                    {{ formatEventDateTime(event.start_datetime) }}
                </span>
            </div>
        </div>
        <div
            v-else
            class="text-muted bg-default flex items-center gap-3 rounded-sm px-4 py-3 text-sm font-semibold"
        >
            <UIcon name="ph:ticket-bold" class="text-dimmed size-6" aria-hidden="true" />
            Выберите событие
        </div>

        <slot />

        <USeparator />

        <EnrollPriceBox :label="isFree ? 'Итого' : 'К оплате'" :amount="amount">
            <template v-if="event" #aside>
                <span class="text-muted pb-0.5 text-xs font-semibold">
                    {{ isFree ? `мест: ${seats}` : `${formatRub(event.price ?? 0)} × ${seats}` }}
                </span>
            </template>
        </EnrollPriceBox>

        <EnrollSummaryCta
            :ready="missing.length === 0"
            :missing="missing"
            :loading="loading"
            :cooldown-seconds="cooldownSeconds"
            :error="error"
            :label="isFree ? 'Записаться' : 'Перейти к оплате'"
            :icon="isFree ? 'ph:check-bold' : 'ph:arrow-right-bold'"
            @continue="emit('continue')"
        />

        <p class="text-muted flex items-start gap-2 text-xs">
            <template v-if="isFree">
                <UIcon name="ph:info-bold" class="mt-px size-4 shrink-0" aria-hidden="true" />
                Событие бесплатное – оплата не нужна, места закрепим сразу.
            </template>
            <template v-else>
                <UIcon
                    name="ph:lock-simple-bold"
                    class="mt-px size-4 shrink-0"
                    aria-hidden="true"
                />
                Оплата через ЮKassa. После нажатия места держим за вами 15 минут. Входить в кабинет
                не нужно.
            </template>
        </p>
    </EnrollSummaryCard>
</template>
