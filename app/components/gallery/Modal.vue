<script lang="ts" setup>
import { useMediaQuery } from "@vueuse/core"
import type { GalleryPhoto } from "~/types"

const props = defineProps<{
    modelValue: boolean
    photo: GalleryPhoto | null
    hasPrev: boolean
    hasNext: boolean
}>()

const emit = defineEmits<{
    "update:modelValue": [value: boolean]
    close: []
    prev: []
    next: []
}>()

const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit("update:modelValue", value)
})

const isMobile = useMediaQuery("(max-width: 1024px)")

const currentPhoto = ref(props.photo)
const currentPhotoWatcher = watch(
    () => props.photo,
    (val) => {
        if (val) currentPhoto.value = val
    }
)

const handleKeydown = (e: KeyboardEvent) => {
    if (!isOpen.value) return
    if (e.key === "ArrowLeft" && props.hasPrev) emit("prev")
    if (e.key === "ArrowRight" && props.hasNext) emit("next")
}

onMounted(() => window.addEventListener("keydown", handleKeydown))
onUnmounted(() => {
    window.removeEventListener("keydown", handleKeydown)
    currentPhotoWatcher()
})
</script>

<template>
    <UModal
        v-model:open="isOpen"
        :fullscreen="isMobile"
        :transition="!isMobile"
        :close="false"
        :ui="{
            content: isMobile
                ? 'rounded-none bg-black ring-0 shadow-none focus:outline-none'
                : 'max-w-5xl w-full rounded-md ring-0 shadow-none overflow-hidden focus:outline-none',
            overlay: 'bg-black/60 backdrop-blur-sm'
        }"
    >
        <template #content>
            <!-- Мобайл: flex-column на весь экран -->
            <div v-if="isMobile" class="flex h-dvh w-full flex-col">
                <div class="relative min-h-0 flex-1 overflow-hidden">
                    <Transition name="photo-fade">
                        <AppPhoto
                            v-if="currentPhoto"
                            :key="currentPhoto.url"
                            :src="currentPhoto.url"
                            :alt="currentPhoto.alt"
                            class="h-full w-full object-contain! object-center"
                        />
                    </Transition>
                </div>

                <GalleryModalControls
                    class="controls-bar bg-black/80 text-sm text-white/75"
                    :alt="currentPhoto?.alt"
                    :prev="hasPrev ? () => emit('prev') : undefined"
                    :next="hasNext ? () => emit('next') : undefined"
                    :close="() => (isOpen = false)"
                />
            </div>

            <!-- Десктоп: windowed -->
            <div v-else class="flex w-full flex-col">
                <div class="relative h-fit max-h-[80vh] w-full overflow-hidden">
                    <Transition name="photo-fade">
                        <AppPhoto
                            v-if="currentPhoto"
                            :key="currentPhoto.url"
                            :src="currentPhoto.url"
                            :alt="currentPhoto.alt"
                            class="h-fit! w-full object-contain! object-center"
                        />
                    </Transition>
                </div>

                <GalleryModalControls
                    class="text-default/80 text-xl"
                    :alt="currentPhoto?.alt"
                    :prev="hasPrev ? () => emit('prev') : undefined"
                    :next="hasNext ? () => emit('next') : undefined"
                    :close="() => (isOpen = false)"
                />
            </div>
        </template>
    </UModal>
</template>

<style scoped>
.photo-fade-enter-active {
    transition: opacity 0.15s ease;
}
.photo-fade-leave-active {
    position: absolute;
    inset: 0;
    transition: opacity 0.15s ease;
}
.photo-fade-enter-from,
.photo-fade-leave-to {
    opacity: 0;
}
</style>
