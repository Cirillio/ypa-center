<script lang="ts" setup>
// Галочка успеха, которая прорисовывается после монтирования; при reduced motion переход схлопывает base.css.
const isDrawn = ref(false)

onMounted(() => {
    requestAnimationFrame(() => {
        isDrawn.value = true
    })
})
</script>

<template>
    <svg class="text-secondary size-20" viewBox="0 0 52 52" fill="none" aria-hidden="true">
        <circle cx="26" cy="26" r="24" stroke="currentColor" stroke-width="2" opacity="0.15" />
        <circle
            cx="26"
            cy="26"
            r="24"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            pathLength="100"
            stroke-dasharray="100"
            :stroke-dashoffset="isDrawn ? 0 : 100"
            class="origin-center -rotate-90 transition-[stroke-dashoffset] duration-500 ease-out"
        />
        <path
            d="M14 27l8 8 16-16"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            pathLength="100"
            stroke-dasharray="100"
            :stroke-dashoffset="isDrawn ? 0 : 100"
            class="transition-[stroke-dashoffset] delay-450 duration-400 ease-out"
        />
    </svg>
</template>
