<script lang="ts" setup>
// Нижняя панель на мобильных: сумма всегда на виду, кнопка ведёт к сводке или продолжает.
withDefaults(
    defineProps<{
        amount: string
        label?: string
        ready: boolean
        actionLabel?: string
    }>(),
    {
        label: "К оплате",
        actionLabel: "Продолжить"
    }
)

const emit = defineEmits<{
    continue: []
}>()

// Пока выбор не собран, кнопка прокручивает к сводке – там видно, чего не хватает.
function scrollToSummary() {
    document.getElementById("enroll-summary")?.scrollIntoView({ behavior: "smooth" })
}
</script>

<template>
    <div
        class="border-default fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t bg-white/90 px-4 py-3 backdrop-blur-sm lg:hidden"
    >
        <div class="flex flex-col">
            <span class="text-muted text-xs font-semibold">{{ label }}</span>
            <span class="text-primary text-2xl leading-none font-extrabold">{{ amount }}</span>
        </div>
        <UButton
            v-if="ready"
            :label="actionLabel"
            size="lg"
            class="font-bold"
            @click="emit('continue')"
        />
        <UButton
            v-else
            label="К итогу"
            color="neutral"
            variant="soft"
            size="lg"
            class="font-bold"
            @click="scrollToSummary"
        />
    </div>
</template>
