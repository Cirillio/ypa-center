<script lang="ts" setup>
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

// Управление клавиатурой
const handleKeydown = (e: KeyboardEvent) => {
    if (!isOpen.value) return
    if (e.key === "ArrowLeft" && props.hasPrev) emit("prev")
    if (e.key === "ArrowRight" && props.hasNext) emit("next")
}

onMounted(() => window.addEventListener("keydown", handleKeydown))
onUnmounted(() => window.removeEventListener("keydown", handleKeydown))
</script>

<template>
    <UModal
        v-model:open="isOpen"
        fullscreen
        :close="false"
        :ui="{
            content:
                'bg-default/75 backdrop-blur-sm border-none shadow-none flex items-center justify-center focus:outline-none'
        }"
    >
        <!-- Слот триггера оставляем пустым, так как открываем программно -->

        <template #content>
            <div class="relative flex h-full w-full items-center justify-center p-4 sm:p-20">
                <!-- Кнопка закрытия -->
                <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-heroicons-x-mark-20-solid"
                    class="text-default/70 hover:text-default absolute top-4 right-4 z-50 hover:bg-white/90"
                    @click="isOpen = false"
                />

                <!-- Навигация: Назад -->
                <UButton
                    v-if="hasPrev"
                    color="secondary"
                    variant="soft"
                    icon="i-heroicons-chevron-left-20-solid"
                    class="absolute left-4 z-50 hidden size-12 items-center justify-center rounded-full sm:flex"
                    @click="emit('prev')"
                />

                <!-- Основное изображение -->
                <div v-if="photo" class="relative grid h-full w-full items-center justify-center">
                    <AppPhoto
                        :src="photo.url"
                        :alt="photo.alt"
                        class="h-full w-full rounded-md object-cover object-center"
                    />
                </div>

                <!-- Навигация: Вперед -->
                <UButton
                    v-if="hasNext"
                    color="secondary"
                    variant="soft"
                    icon="i-heroicons-chevron-right-20-solid"
                    class="absolute right-4 z-50 hidden size-12 items-center justify-center rounded-full sm:flex"
                    @click="emit('next')"
                />

                <!-- Подпись снизу -->
                <div
                    v-if="photo?.alt"
                    class="text-default/70 absolute bottom-4 left-0 w-full text-center text-sm font-medium sm:bottom-6 sm:text-lg"
                >
                    {{ photo.alt }}
                </div>
            </div>
        </template>
    </UModal>
</template>
