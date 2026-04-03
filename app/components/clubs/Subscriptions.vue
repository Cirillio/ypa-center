<template>
    <div class="flex flex-col gap-3">
        <div class="flex items-center gap-2">
            <UIcon name="ph:dot-duotone" class="text-primary size-5 animate-pulse" />
            <span class="text-default font-semibold">Абонементы</span>
        </div>

        <ul class="grid list-none grid-cols-2 gap-2 md:grid-cols-3">
            <li
                v-for="tier in tiers"
                :key="tier.label ?? tier.lessons ?? 'unlimited'"
                :data-price="tier.price"
                :aria-label="tier.label"
                :aria-price="formatPrice(tier.price)"
                class="group flex flex-col gap-0.5 rounded-sm p-3 ring-2 transition-all duration-200"
                :class="
                    tier.highlight
                        ? 'bg-primary ring-primary hover:bg-primary/90'
                        : 'hover:ring-primary bg-white ring-transparent'
                "
            >
                <span
                    class="text-xl leading-none font-black md:text-2xl"
                    :class="tier.highlight ? 'text-white' : 'text-secondary'"
                >
                    {{ tier.label ?? tier.lessons }}
                </span>
                <span
                    class="text-[11px] font-semibold"
                    :class="tier.highlight ? 'text-white/65' : 'text-default/45'"
                >
                    {{
                        tier.lessons === null
                            ? "занятий"
                            : pluralize(tier.lessons, ["занятие", "занятия", "занятий"])
                    }}
                </span>
                <span
                    class="mt-1.5 text-sm font-extrabold md:text-base"
                    :class="tier.highlight ? 'text-white' : 'text-default'"
                >
                    {{ formatPrice(tier.price) }}
                </span>
                <span
                    class="text-[11px] font-medium"
                    :class="tier.highlight ? 'text-white/55' : 'text-default/35'"
                >
                    {{ perLesson(tier) }}
                </span>
            </li>
        </ul>

        <p class="text-default/60 text-base leading-relaxed font-medium">
            Абонемент удобнее разовых оплат: не нужно каждый раз переводить деньги, а чем больше
            занятий — тем ниже цена за каждое. Выгода до&nbsp;40% против разового посещения.
        </p>
    </div>
</template>

<script lang="ts" setup>
interface SubscriptionTier {
    lessons: number | null
    price: number
    label?: string
    highlight?: boolean
}

const tiers: SubscriptionTier[] = [
    { lessons: 4, price: 4000 },
    { lessons: 8, price: 7000 },
    { lessons: 12, price: 10000 },
    { lessons: 16, price: 11000 },
    { lessons: 20, price: 12000 },
    { lessons: null, price: 15000, label: "Безлимит", highlight: true }
]

function perLesson(tier: SubscriptionTier): string {
    if (tier.lessons === null) return "∞ занятий"
    const per = Math.round(tier.price / tier.lessons)
    return (
        new Intl.NumberFormat("ru-RU", {
            style: "currency",
            currency: "RUB",
            maximumFractionDigits: 0
        }).format(per) + "/занятие"
    )
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        maximumFractionDigits: 0
    }).format(price)
}
</script>

<style></style>
