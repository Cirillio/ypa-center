<template>
    <div
        class="flex min-h-64 flex-col items-center justify-center gap-8 rounded-sm bg-white px-6 py-10"
    >
        <div class="flex items-center gap-3">
            <span class="pending-dot" />
            <span class="pending-dot" style="animation-delay: 160ms" />
            <span class="pending-dot" style="animation-delay: 320ms" />
        </div>

        <div class="space-y-1 text-center">
            <p class="text-default text-xl font-bold">Ожидаем подтверждение</p>
            <p class="text-muted text-sm">Это займёт несколько секунд</p>
        </div>
    </div>
</template>
