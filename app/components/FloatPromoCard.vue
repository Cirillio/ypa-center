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
        class="floating-element-slow group hover:ring-primary active:ring-primary focus-within:ring-primary z-20 flex overflow-hidden rounded-md bg-white ring-2 ring-transparent transition-all duration-150 hover:rotate-0 max-lg:h-fit max-lg:max-w-md md:hover:scale-105 lg:absolute lg:top-12 lg:right-24 lg:aspect-square lg:h-56 lg:w-72 lg:rotate-2"
    >
        <div class="relative flex w-full flex-col p-4 md:p-6">
            <UIcon
                :name="icon"
                class="text-primary absolute -top-8 -right-8 size-32 -rotate-15 opacity-25 transition-all group-hover:rotate-5 group-hover:opacity-75"
            />
            <div class="mt-4 flex flex-col md:gap-1">
                <span
                    v-if="sublabel"
                    class="text-primary/85 text-xl leading-none font-black md:text-2xl"
                    >{{ sublabel }}</span
                >
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
