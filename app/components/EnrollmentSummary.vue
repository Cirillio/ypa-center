<script lang="ts" setup>
interface Props {
    title: string | null
    subtitle: string | null
    img?: string | null
    imgAlt?: string
    badge?: string
    icon?: string
    emptyTitle?: string
    emptySubtitle?: string
}

withDefaults(defineProps<Props>(), {
    icon: "ph:star-bold",
    emptyTitle: "Не выбрано",
    img: undefined,
    imgAlt: undefined,
    badge: undefined,
    emptySubtitle: undefined
})
</script>

<template>
    <div
        class="relative flex flex-col gap-0.5 overflow-hidden rounded-sm bg-white px-4 py-3 md:px-6 md:py-4"
    >
        <UIcon :name="icon" class="text-primary/20 absolute -right-2 -bottom-2 size-28 rotate-12" />
        <span class="text-default text-xl font-bold md:text-2xl">Ваш выбор:</span>

        <Transition name="clip-reveal" mode="out-in">
            <div
                :key="`${title ?? '__empty__'}|${subtitle ?? '__empty__'}`"
                class="mt-2 flex flex-col gap-3"
            >
                <!-- Image side-by-side mode -->
                <template v-if="img">
                    <div class="flex gap-4">
                        <div
                            class="aspect-5/3 h-20 shrink-0 overflow-hidden rounded-xs shadow-sm md:h-40"
                        >
                            <AppPhoto
                                :src="img"
                                :alt="imgAlt ?? title ?? ''"
                                :quality="50"
                                class="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>

                        <div class="flex min-w-0 flex-col gap-1.5">
                            <div class="flex flex-wrap items-center gap-2">
                                <h4
                                    class="text-primary line-clamp-2 text-lg leading-tight font-bold md:text-3xl"
                                >
                                    {{ title }}
                                </h4>
                            </div>

                            <span
                                v-if="subtitle"
                                class="text-default/80 flex items-center gap-1.5 text-sm font-semibold md:text-xl"
                            >
                                <UIcon
                                    name="ph:calendar-blank"
                                    class="text-primary/70 size-4.5 shrink-0"
                                />
                                {{ subtitle }}
                            </span>
                            <span
                                v-else-if="emptySubtitle"
                                class="text-default/40 text-sm italic md:text-base"
                            >
                                {{ emptySubtitle }}
                            </span>
                            <span
                                v-if="badge != null"
                                class="bg-primary/10 text-primary w-fit rounded-full px-3 py-1 font-bold md:text-lg"
                            >
                                {{ badge }}
                            </span>
                        </div>
                    </div>
                </template>

                <!-- Text mode -->
                <template v-else>
                    <span v-if="title" class="text-primary text-xl font-bold md:text-2xl">{{
                        title
                    }}</span>
                    <span v-else class="text-default/60 text-xl font-bold italic md:text-2xl">
                        {{ emptyTitle }}
                    </span>
                    <span v-if="subtitle" class="text-primary text-lg font-semibold md:text-xl">
                        {{ subtitle }}
                    </span>
                    <span v-else class="text-default/60 text-lg font-semibold italic md:text-xl">
                        {{ emptySubtitle ?? "—" }}
                    </span>
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
