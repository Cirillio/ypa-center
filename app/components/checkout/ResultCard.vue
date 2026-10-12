<script lang="ts" setup>
// Общая оболочка экрана результата: маскот, надзаголовок, заголовок, пояснение, содержимое и действия.
withDefaults(
    defineProps<{
        title: string
        description: string
        eyebrow?: string
        hero?: boolean // крупный праздничный заголовок – только для «УРА!»
    }>(),
    { eyebrow: undefined, hero: false }
)
</script>

<template>
    <div
        class="relative flex flex-col items-center gap-6 rounded-lg bg-white px-6 pt-8 pb-8 text-center md:px-10"
    >
        <div class="relative -mt-24 flex justify-center">
            <slot name="icon" />
        </div>

        <div class="flex flex-col items-center gap-2">
            <span
                v-if="eyebrow"
                class="text-primary/80 text-xs font-extrabold tracking-[0.12em] uppercase"
            >
                {{ eyebrow }}
            </span>
            <h1
                class="text-balance"
                :class="
                    hero
                        ? 'text-primary text-6xl leading-none font-black tracking-tight md:text-7xl'
                        : 'text-default text-2xl leading-tight font-extrabold md:text-3xl'
                "
            >
                {{ title }}
            </h1>
            <p class="text-muted max-w-sm text-base font-semibold text-balance">
                {{ description }}
            </p>
        </div>

        <slot />

        <div v-if="$slots.actions" class="flex w-full flex-col gap-2 sm:flex-row">
            <slot name="actions" />
        </div>
    </div>
</template>
