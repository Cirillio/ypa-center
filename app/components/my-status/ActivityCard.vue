<script lang="ts" setup>
const props = withDefaults(
    defineProps<{
        subtitle: string
        id: string
        participant: string
        participantLabel?: string
        createdAt: string
        icon: string
        color: "rose" | "cyan" | "fuchsia"
        statusText?: string
    }>(),
    {
        participantLabel: "Записан(-а):",
        statusText: ""
    }
)

const colorMap = {
    rose: "bg-rose-500/5 text-rose-500",
    cyan: "bg-cyan-500/5 text-cyan-500",
    fuchsia: "bg-fuchsia-500/5 text-fuchsia-500"
}

const formattedCreatedAt = computed(() => {
    return new Date(props.createdAt).toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric"
    })
})
</script>

<template>
    <div class="relative overflow-hidden rounded-lg">
        <!-- Status Ribbon -->
        <div
            v-if="statusText"
            class="bg-error/10 text-error absolute top-7 -right-12 z-20 rotate-45 px-12 py-1 text-xs font-bold tracking-wider uppercase"
        >
            {{ statusText }}
        </div>

        <div
            :class="{ 'opacity-75': statusText }"
            class="via-default to-default from-default hover:from-secondary/80 hover:to-primary/80 bg-linear-to-tl p-px transition-colors duration-150 ease-in"
        >
            <div class="bg-default flex flex-col gap-4 rounded-lg p-3.75">
                <!-- Header -->
                <div class="flex items-center gap-4">
                    <div
                        class="flex items-center justify-center rounded-full p-2.5"
                        :class="colorMap[color]"
                    >
                        <UIcon :name="icon" class="size-6" />
                    </div>
                    <div class="grid">
                        <h3 class="text-default/75 text-base leading-tight">{{ subtitle }}</h3>
                        <span class="text-default text-lg leading-tight font-semibold"
                            >#{{ id }}</span
                        >
                    </div>
                </div>

                <!-- Details Slot (Cost, etc.) -->
                <div v-if="$slots.details" class="grid-row-2 grid grid-cols-[1fr_auto] gap-x-2">
                    <slot name="details" />
                </div>

                <USeparator />

                <!-- Main Content Slot -->
                <div class="flex flex-col gap-2">
                    <slot />
                </div>

                <USeparator />

                <!-- Footer -->
                <div class="grid gap-1">
                    <div class="flex items-center justify-between gap-2 px-1">
                        <span class="text-default/75 text-sm font-medium">{{
                            participantLabel
                        }}</span>
                        <span class="text-default text-sm font-semibold">{{ participant }}</span>
                    </div>
                    <div class="flex items-center justify-between gap-2 px-1">
                        <span class="text-default/75 text-sm font-medium">Оформлен:</span>
                        <span class="text-default text-sm font-semibold">{{
                            formattedCreatedAt
                        }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
