<script lang="ts" setup>
const drawn = ref(false)

onMounted(() => {
    requestAnimationFrame(() => {
        drawn.value = true
    })
})
</script>

<template>
    <div class="flex min-h-64 flex-col items-center justify-center gap-6 rounded-sm bg-white px-6 py-10">
        <svg class="size-20" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Track circle -->
            <circle cx="26" cy="26" r="24" stroke="currentColor" stroke-width="2" class="text-primary/15" />
            <!-- Animated circle -->
            <circle
                cx="26"
                cy="26"
                r="24"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                class="text-primary"
                pathLength="100"
                stroke-dasharray="100"
                :stroke-dashoffset="drawn ? 0 : 100"
                style="transition: stroke-dashoffset 0.55s ease-out; transform-origin: center; transform: rotate(-90deg)"
            />
            <!-- Checkmark (delayed) -->
            <path
                d="M14 27l8 8 16-16"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-primary"
                pathLength="100"
                stroke-dasharray="100"
                :stroke-dashoffset="drawn ? 0 : 100"
                style="transition: stroke-dashoffset 0.4s ease-out 0.45s"
            />
        </svg>

        <div class="space-y-1 text-center">
            <p class="text-default text-xl font-bold">Оплата прошла</p>
            <p class="text-muted text-sm">Подтверждение придёт в Telegram</p>
        </div>

        <slot />

        <UButton to="/" label="На главную" variant="soft" class="mt-2 w-full" />
    </div>
</template>
