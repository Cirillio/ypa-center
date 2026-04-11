<script lang="ts" setup>
import type { EventShort } from "~/types"

defineProps<{
    event: EventShort | null
}>()

function formatDate(dateStr: string): string {
    return new Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "long"
    }).format(new Date(dateStr))
}
</script>

<template>
    <div class="relative flex flex-col gap-0.5 overflow-hidden rounded-sm bg-white px-6 py-4">
        <UIcon
            name="ph:calendar-star-bold"
            class="text-primary/20 absolute -right-2 -bottom-2 size-28 rotate-12"
        />
        <span class="text-default text-2xl font-bold">Ваш выбор:</span>

        <Transition name="clip-reveal" mode="out-in">
            <div v-if="event" :key="event.id" class="mt-2 flex flex-col gap-2">
                <div class="relative h-32 w-full overflow-hidden rounded-xs">
                    <AppPhoto
                        :src="event.img"
                        :alt="event.label"
                        class="object-cover object-center"
                    />
                    <div
                        class="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"
                    />
                    <div
                        class="absolute right-3 bottom-2 left-3 flex items-end justify-between gap-2"
                    >
                        <span
                            class="line-clamp-2 text-base leading-tight font-bold text-white drop-shadow"
                        >
                            {{ event.label }}
                        </span>
                        <span
                            class="bg-primary/90 shrink-0 rounded-full px-2.5 py-0.5 text-sm font-bold text-white backdrop-blur-sm"
                        >
                            {{ event.price ?? "Бесплатно" }}
                        </span>
                    </div>
                </div>
                <span class="text-default/80 flex items-center gap-1.5 text-base font-semibold">
                    <UIcon name="ph:calendar-blank" class="text-primary/70 size-4.5 shrink-0" />
                    {{ formatDate(event.date) }} · {{ event.time }}
                </span>
            </div>

            <div v-else class="mt-1 flex flex-col gap-0.5">
                <span class="text-default/60 text-xl font-bold italic">Событие не выбрано</span>
                <span class="text-default/40 text-base font-medium italic">
                    Выберите мероприятие слева
                </span>
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
