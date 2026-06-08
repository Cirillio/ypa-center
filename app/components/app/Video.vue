<script lang="ts" setup>
defineProps<{
    src: string
    title?: string
}>()

const isLoaded = ref(false)
const hasError = ref(false)
</script>

<template>
    <div class="relative h-full w-full overflow-hidden">
        <Transition name="skeleton-fade">
            <div
                v-if="!isLoaded && !hasError"
                class="bg-primary/10 absolute inset-0 flex animate-pulse items-center justify-center"
            >
                <UIcon name="ph:circle-notch-bold" class="text-primary size-8 animate-spin" />
            </div>
        </Transition>

        <Transition name="skeleton-fade">
            <div
                v-if="hasError"
                class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-neutral-100"
            >
                <UIcon name="ph:video-camera-slash-duotone" class="size-12 text-neutral-400" />
                <span class="text-lg font-bold text-neutral-400">Видео не загрузилось..</span>
            </div>
        </Transition>

        <iframe
            v-show="!hasError"
            :src="src"
            :title="title"
            width="100%"
            height="100%"
            frameborder="0"
            allowfullscreen
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock"
            loading="lazy"
            class="h-full w-full transition-opacity duration-300"
            :class="isLoaded ? 'opacity-100' : 'opacity-0'"
            @load="isLoaded = true"
            @error="hasError = true"
        />
    </div>
</template>

<style scoped>
.skeleton-fade-leave-active {
    transition: opacity 0.1s ease-out;
    animation: none;
}
.skeleton-fade-leave-to {
    opacity: 0;
}
</style>
