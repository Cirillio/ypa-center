<script lang="ts" setup>
// Виджет «Тариф подбирается сам» с сеткой тарифов и подсказкой о следующем пороге выгоды.
import type { PlanTier } from "~/types"

const props = defineProps<{
    tiers: PlanTier[]
    currentTierIndex: number
    nextTier: PlanTier | null
    totalMonthlyLessons: number
    unlimitedHint: string | null
}>()

const nextTierName = computed(() => {
    const tier = props.nextTier
    if (!tier) return ""
    if (tier.label) return tier.label
    if (tier.lessons !== null) {
        return `${tier.lessons} ${pluralize(tier.lessons, ["занятие", "занятия", "занятий"])}`
    }
    return "Безлимит"
})

const nextTierPerLesson = computed<number | null>(() => {
    const tier = props.nextTier
    if (!tier || tier.lessons === null || tier.lessons <= 0) return null
    return Math.round(tier.price / tier.lessons)
})
</script>

<template>
    <section aria-label="Тариф" class="flex min-w-0 flex-col gap-5 rounded-lg bg-white p-6">
        <div class="flex items-center gap-3">
            <div
                class="bg-primary/5 text-primary flex items-center justify-center rounded-full p-2"
            >
                <UIcon name="ph:chart-line-up-bold" class="size-5" aria-hidden="true" />
            </div>
            <h2 class="text-primary text-xl font-bold">Тариф подбирается сам</h2>
        </div>

        <p class="text-muted -mt-2 text-sm">
            Каждый кружок — 4 занятия в месяц. Чем больше кружков, тем ниже цена занятия.
        </p>

        <div class="grid grid-cols-3 gap-2 sm:grid-cols-6">
            <EnrollSubscriptionTierCard
                v-for="(tier, idx) in tiers"
                :key="tier.id ?? tier.lessons ?? 'unlimited'"
                :tier="tier"
                :is-active="idx === currentTierIndex"
                :unlimited-hint="unlimitedHint"
            />
        </div>

        <p
            v-if="totalMonthlyLessons === 0"
            class="text-muted flex items-center gap-2 text-sm italic"
        >
            <UIcon name="ph:hand-pointing-bold" class="size-4.5 shrink-0" aria-hidden="true" />
            <span>Выберите кружки — тариф определится автоматически</span>
        </p>

        <p v-else-if="!nextTier" class="text-secondary flex items-center gap-2 text-sm font-bold">
            <UIcon name="ph:crown-simple-bold" class="size-4.5 shrink-0" aria-hidden="true" />
            <span>Максимальная выгода — безлимитный абонемент</span>
        </p>

        <p v-else class="text-default flex items-center gap-2 text-sm font-semibold">
            <UIcon
                name="ph:trend-up-bold"
                class="text-secondary size-4.5 shrink-0"
                aria-hidden="true"
            />
            <span>
                Ещё 1 кружок → <span class="font-bold">{{ nextTierName }}</span> за
                <span class="font-bold">{{ formatRubles(nextTier.price) }}</span>
                <template v-if="nextTierPerLesson !== null">
                    (≈ {{ formatRubles(nextTierPerLesson) }} за занятие)
                </template>
            </span>
        </p>
    </section>
</template>
