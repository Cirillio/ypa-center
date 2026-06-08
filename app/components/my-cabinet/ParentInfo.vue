<script lang="ts" setup>
import type { StatusParent } from "~/types/status"

defineProps<{
    parent?: StatusParent
    isProcessing: boolean
}>()

const fields = [
    { key: "name", label: "ФИО" },
    { key: "phone", label: "Телефон" },
    { key: "email", label: "Почта" }
] as const
</script>

<template>
    <section class="flex flex-col gap-4" aria-label="Профиль родителя">
        <div class="flex items-center gap-3">
            <div
                class="bg-primary/5 text-primary flex items-center justify-center rounded-full p-2"
            >
                <UIcon name="ph:user-bold" class="size-5" />
            </div>
            <h2 class="text-primary text-xl font-bold">Профиль родителя</h2>
        </div>

        <dl class="flex flex-col gap-3">
            <div v-for="field in fields" :key="field.key" class="flex flex-col gap-0.5">
                <dt class="text-default/60 text-sm leading-tight">{{ field.label }}</dt>
                <dd v-if="parent" class="text-default truncate text-lg leading-tight font-semibold">
                    {{ parent[field.key] }}
                </dd>
                <dd
                    v-else
                    class="h-6 w-48 rounded-md"
                    :class="isProcessing ? 'bg-secondary/20 animate-pulse' : 'bg-mauve-500/10'"
                />
            </div>
        </dl>
    </section>
</template>
