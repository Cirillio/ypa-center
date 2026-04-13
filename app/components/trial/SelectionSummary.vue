<script lang="ts" setup>
defineProps<{
    name: string | null
    dateTime: string | null
    img?: string | null
    imgAlt?: string
}>()
</script>

<template>
    <div class="relative flex flex-col gap-0.5 overflow-hidden rounded-sm bg-white px-6 py-4">
        <UIcon
            name="ph:person-simple-run-bold"
            class="text-primary/25 absolute -right-2 -bottom-2 size-28 -rotate-24"
        />
        <span class="text-default text-2xl font-bold">Ваш выбор:</span>

        <Transition name="clip-reveal" mode="out-in">
            <div :key="`${name ?? ''}|${dateTime ?? ''}`" class="mt-2 flex flex-col gap-2">
                <!-- Image hero mode -->
                <template v-if="img">
                    <div class="relative h-32 w-full overflow-hidden rounded-xs">
                        <AppPhoto :src="img" :alt="imgAlt ?? name ?? ''" class="object-cover object-center" />
                        <div
                            class="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"
                        />
                        <div
                            class="absolute right-3 bottom-2 left-3 flex items-end justify-between gap-2"
                        >
                            <span
                                class="line-clamp-2 text-base leading-tight font-bold text-white drop-shadow"
                            >
                                {{ name }}
                            </span>
                        </div>
                    </div>
                    <span
                        v-if="dateTime"
                        class="text-default/80 flex items-center gap-1.5 text-base font-semibold"
                    >
                        <UIcon name="ph:calendar-blank" class="text-primary/70 size-4.5 shrink-0" />
                        {{ dateTime }}
                    </span>
                </template>

                <!-- Text mode -->
                <template v-else>
                    <span v-if="name" class="text-primary text-2xl font-bold">{{ name }}</span>
                    <span v-else class="text-default/60 text-2xl font-bold italic"
                        >Кружок не выбран</span
                    >
                    <span v-if="dateTime" class="text-primary text-xl font-semibold">{{
                        dateTime
                    }}</span>
                    <span v-else class="text-default/60 text-xl font-semibold italic"
                        >Время не выбрано</span
                    >
                </template>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.clip-reveal-enter-active {
    transition:
        clip-path 0.45s ease-out,
        opacity 0.3s ease-out;
}
.clip-reveal-enter-from {
    clip-path: inset(0 100% 0 0 round 4px);
    opacity: 0;
}
.clip-reveal-enter-to {
    clip-path: inset(0 0% 0 0 round 4px);
    opacity: 1;
}
.clip-reveal-leave-active {
    transition: opacity 0.15s ease-in;
}
.clip-reveal-leave-from {
    opacity: 1;
}
.clip-reveal-leave-to {
    opacity: 0;
}
</style>
