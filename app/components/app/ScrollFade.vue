<script lang="ts" setup>
import { useScroll } from "@vueuse/core"

const props = withDefaults(
    defineProps<{
        direction?: "x" | "y"
        fadeColor?: string
        fadeSize?: string
    }>(),
    {
        direction: "x",
        fadeColor: "white",
        fadeSize: "10"
    }
)

const containerRef = ref<HTMLElement | null>(null)
const { arrivedState } = useScroll(containerRef)

const isX = computed(() => props.direction === "x")

const containerClass = computed(() =>
    isX.value
        ? "flex overflow-x-auto scrollbar-none"
        : "flex flex-col overflow-y-auto scrollbar-none"
)

const fadeStartClass = computed(() =>
    isX.value
        ? `absolute top-0 left-0 z-10 h-full w-${props.fadeSize} pointer-events-none`
        : `absolute top-0 left-0 z-10 w-full h-${props.fadeSize} pointer-events-none`
)

const fadeEndClass = computed(() =>
    isX.value
        ? `absolute top-0 right-0 z-10 h-full w-${props.fadeSize} pointer-events-none`
        : `absolute bottom-0 left-0 z-10 w-full h-${props.fadeSize} pointer-events-none`
)

const fadeStartStyle = computed(() => ({
    background: isX.value
        ? `linear-gradient(to right, ${props.fadeColor}, transparent)`
        : `linear-gradient(to bottom, ${props.fadeColor}, transparent)`
}))

const fadeEndStyle = computed(() => ({
    background: isX.value
        ? `linear-gradient(to left, ${props.fadeColor}, transparent)`
        : `linear-gradient(to top, ${props.fadeColor}, transparent)`
}))

const showStart = computed(
    () => (!arrivedState.left && isX.value) || (!arrivedState.top && !isX.value)
)
const showEnd = computed(
    () => (!arrivedState.right && isX.value) || (!arrivedState.bottom && !isX.value)
)
</script>

<template>
    <div class="relative">
        <Transition name="fade">
            <div v-if="showStart" :class="fadeStartClass" :style="fadeStartStyle" />
        </Transition>

        <div ref="containerRef" :class="containerClass">
            <slot />
        </div>

        <Transition name="fade">
            <div v-if="showEnd" :class="fadeEndClass" :style="fadeEndStyle" />
        </Transition>
    </div>
</template>

<style scoped>
.scrollbar-none {
    scrollbar-width: none;
}
.scrollbar-none::-webkit-scrollbar {
    display: none;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
