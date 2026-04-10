<template>
    <div class="flex flex-col gap-3">
        <div class="flex items-center gap-2">
            <UIcon name="ph:puzzle-piece-duotone" class="text-primary size-5 animate-pulse" />
            <span class="text-default font-semibold">
                <slot name="sub" />
            </span>
        </div>

        <ul class="grid list-none grid-cols-2 gap-2 md:grid-cols-3">
            <li
                v-for="tier in tiers"
                :key="tier.label ?? tier.lessons ?? 'unlimited'"
                :aria-label="
                    (tier.label ?? tier.lessons) +
                    ' ' +
                    (tier.lessons === null ? 'занятий' : 'занятий') +
                    ', цена ' +
                    formatPrice(tier.price)
                "
                class="group relative flex flex-col gap-0.5 rounded-sm p-2 transition-all duration-200 md:p-4"
                :class="tier.highlight ? 'bg-primary ring-primary hover:bg-primary/90' : 'bg-white'"
            >
                <span
                    v-if="tier.highlight"
                    class="mb-1 w-fit rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-white uppercase"
                >
                    Самый выгодный
                </span>
                <div class="flex flex-col">
                    <span
                        class="text-xl leading-none font-black md:text-2xl"
                        :class="tier.highlight ? 'text-white' : 'text-secondary'"
                    >
                        {{ tier.label ?? tier.lessons }}
                    </span>
                    <span
                        v-if="tier.lessons !== null"
                        class="text-sm font-semibold"
                        :class="tier.highlight ? 'text-white/75' : 'text-default/95'"
                    >
                        {{ pluralize(tier.lessons, ["занятие", "занятия", "занятий"]) }}
                    </span>
                </div>
                <strong
                    class="mt-auto text-sm font-extrabold md:text-base"
                    :class="tier.highlight ? 'text-white' : 'text-default'"
                >
                    {{ formatPrice(tier.price) }}
                </strong>
                <span
                    class="text-xs font-medium"
                    :class="tier.highlight ? 'text-white/70' : 'text-default/85'"
                >
                    {{ perLesson(tier) }}
                </span>
            </li>
        </ul>

        <p class="text-default/85 text-base leading-relaxed font-medium">
            <slot name="desc" />
        </p>
    </div>
</template>

<script lang="ts" setup>
const { subscriptions: tiers } = useAppConfig()

type Tier = (typeof tiers)[number]

function perLesson(tier: Tier): string {
    if (tier.lessons === null) return "неограниченно — один платёж"
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
