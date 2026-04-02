<template>
    <div class="relative h-full w-full overflow-hidden">
        <Transition name="skeleton-fade">
            <div
                v-if="!isLoaded && !hasError"
                class="bg-primary/15 absolute inset-0 flex animate-pulse items-center justify-center"
            >
                <UIcon name="ph:circle-notch-bold" class="text-primary size-8 animate-spin" />
            </div>
        </Transition>

        <Transition name="skeleton-fade">
            <div
                v-if="hasError"
                class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-neutral-100"
            >
                <UIcon name="ph:smiley-sad-duotone" class="size-12 text-neutral-400" />
                <span class="text-lg font-bold text-neutral-400">Изображение не загрузилось..</span>
            </div>
        </Transition>

        <NuxtImg
            v-show="!hasError"
            :src="src"
            :alt="alt"
            :placeholder="[32, 32, 5, 4]"
            loading="lazy"
            format="webp"
            quality="85"
            class="h-full w-full object-cover object-center"
            :class="combinedClasses"
            @load="isLoaded = true"
            @error="onError"
        />
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    src: string
    alt?: string
    class?: string
}>()

const isLoaded = ref(false)
const hasError = ref(false)

const onError = () => {
    hasError.value = true
    isLoaded.value = true
}

const imageOpacityClass = computed(() => (isLoaded.value ? "opacity-100" : "opacity-0"))

const combinedClasses = computed(() => [imageOpacityClass.value, props.class])
</script>

<style scoped>
.skeleton-fade-leave-active {
    transition: opacity 0.1s ease-out;
    animation: none;
}
.skeleton-fade-leave-to {
    opacity: 0;
}
</style>
