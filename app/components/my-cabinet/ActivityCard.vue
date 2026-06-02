<script lang="ts" setup>
type StampVariant = "live" | "done" | "cancel"

type KvRow = {
    label: string
    value: string
    muted?: boolean
}

defineProps<{
    id: string
    icon: string
    color: "rose" | "cyan" | "fuchsia"
    rows: KvRow[]
    typeBadge?: string
    status?: { text: string; variant: StampVariant }
}>()

const colorMap = {
    rose: "bg-rose-500/5 text-rose-500",
    cyan: "bg-cyan-500/5 text-cyan-500",
    fuchsia: "bg-fuchsia-500/5 text-fuchsia-500"
}

const stampMap: Record<StampVariant, string> = {
    live: "border-secondary/40 text-secondary bg-secondary/5",
    done: "border-default/20 text-default/40 bg-default/5",
    cancel: "border-error/40 text-error bg-error/5"
}
</script>

<template>
    <div class="relative overflow-hidden rounded-lg">
        <!-- Stamp: статусная «печать» в углу -->
        <div
            v-if="status"
            class="absolute top-3.5 right-3.5 z-20 -rotate-6 rounded-md border px-2.5 py-0.5 text-xs font-bold tracking-wider uppercase"
            :class="stampMap[status.variant]"
        >
            {{ status.text }}
        </div>

        <div
            :class="{ 'opacity-75': status && status.variant !== 'live' }"
            class="via-default to-default from-default hover:from-secondary/80 hover:to-primary/80 bg-linear-to-tl p-px transition-colors duration-150 ease-in"
        >
            <div class="bg-default flex flex-col gap-4 rounded-lg p-3.75">
                <!-- Card top: иконка + id + тип -->
                <div class="flex items-center gap-4">
                    <div
                        class="flex items-center justify-center rounded-full p-2.5"
                        :class="colorMap[color]"
                    >
                        <UIcon :name="icon" class="size-6" />
                    </div>
                    <div class="grid">
                        <span v-if="typeBadge" class="text-default/75 text-base leading-tight">
                            {{ typeBadge }}
                        </span>
                        <span class="text-default text-lg leading-tight font-semibold">
                            #{{ id }}
                        </span>
                    </div>
                </div>

                <USeparator />

                <!-- Card body: kv-строки -->
                <dl class="flex flex-col gap-2">
                    <div
                        v-for="row in rows"
                        :key="row.label"
                        class="flex items-center justify-between gap-2 px-1"
                    >
                        <dt class="text-default/70 text-sm font-medium">{{ row.label }}</dt>
                        <dd
                            class="text-default text-end text-sm font-semibold"
                            :class="{ 'text-default/40': row.muted }"
                        >
                            {{ row.value }}
                        </dd>
                    </div>
                </dl>

                <!-- Раскрытие (кружки абонемента) -->
                <slot name="expand" />
            </div>
        </div>
    </div>
</template>
