<script lang="ts" setup>
type HTMLTarget = "_blank" | "_self" | "_parent" | "_top" | (string & {})

withDefaults(
    defineProps<{
        to: string
        icon: string
        label: string
        sublabel: string
        description: string
        goText?: string
        external?: boolean
        target?: HTMLTarget
    }>(),
    {
        external: false,
        target: "_self",
        goText: "Перейти"
    }
)
</script>

<template>
    <NuxtLink
        :to="to"
        :target="target"
        :external="external"
        class="floating-element-slow group hover:ring-primary absolute top-12 right-24 z-20 hidden aspect-square h-56 w-72 rotate-2 overflow-hidden rounded-lg bg-white ring-2 ring-transparent transition-all duration-150 hover:scale-105 hover:rotate-0 lg:flex"
    >
        <div class="relative flex flex-col p-6">
            <UIcon
                :name="icon"
                class="text-primary absolute -top-8 -right-8 size-32 -rotate-15 opacity-25 transition-all group-hover:rotate-5 group-hover:opacity-75"
            />
            <div class="mt-4 flex flex-col gap-1">
                <span v-if="sublabel" class="text-primary/85 text-2xl leading-none font-black">{{
                    sublabel
                }}</span>
                <span class="text-primary mb-1 text-4xl font-black">{{ label }}</span>
            </div>
            <p class="text-default/90 text-base leading-tight font-semibold text-balance">
                {{ description }}
            </p>
            <div
                class="text-secondary/60 group-hover:text-secondary mt-2 flex items-center gap-1 text-base font-bold transition-colors"
            >
                <span>{{ goText }}</span>
                <UIcon
                    name="ph:arrow-right-bold"
                    class="size-5 transition-transform group-hover:translate-x-1"
                />
            </div>
        </div>
    </NuxtLink>
</template>
