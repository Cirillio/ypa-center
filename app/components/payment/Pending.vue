<template>
    <div class="flex min-h-64 flex-col items-center justify-center gap-8 rounded-sm bg-white px-6 py-10">
        <div class="flex items-center gap-3">
            <span class="pending-dot" />
            <span class="pending-dot" style="animation-delay: 160ms" />
            <span class="pending-dot" style="animation-delay: 320ms" />
        </div>

        <div class="space-y-1 text-center">
            <p class="text-default text-xl font-bold">Ожидаем подтверждение</p>
            <p class="text-muted text-sm">Это займёт несколько секунд</p>
        </div>

        <div class="relative h-0.5 w-full overflow-hidden rounded-full bg-primary/10">
            <div class="progress-bar absolute inset-y-0 w-1/3 rounded-full bg-primary" />
        </div>
    </div>
</template>

<style scoped>
.pending-dot {
    @apply block size-3 rounded-full bg-primary;
    animation: dot-pulse 0.9s ease-in-out infinite;
}

@keyframes dot-pulse {
    0%,
    100% {
        transform: scale(1);
        opacity: 0.35;
    }
    50% {
        transform: scale(1.55);
        opacity: 1;
    }
}

.progress-bar {
    animation: progress-slide 1.6s ease-in-out infinite;
}

@keyframes progress-slide {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(350%);
    }
}
</style>
