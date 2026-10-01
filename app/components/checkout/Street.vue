<script lang="ts" setup>
// Домики «улицы» бренда – знак для экранов, где заказа нет: не ошибка, а «не наш адрес».
</script>

<template>
    <div class="relative flex h-44 items-end justify-center" aria-hidden="true">
        <div class="bg-primary/10 absolute inset-x-6 bottom-2 h-20 rounded-full blur-2xl" />
        <NuxtImg
            src="/core/ColorfulHouses.png"
            alt=""
            width="240"
            height="160"
            format="webp"
            quality="90"
            class="floating-element-slow relative w-60"
        />
    </div>
</template>
