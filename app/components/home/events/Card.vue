<script lang="ts" setup>
import type { EventShort } from "~/types"

const props = defineProps<EventShort>()

const formattedDate = computed(() => {
    return new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "2-digit"
    }).format(new Date(props.date))
})
</script>

<template>
    <article class="bg-default flex flex-row gap-2 rounded-md p-2 lg:flex-col lg:gap-4 lg:p-4">
        <!-- Image -->
        <div
            class="relative aspect-square w-20 shrink-0 overflow-hidden rounded-sm min-[340px]:w-24 sm:w-32 lg:aspect-4/3 lg:w-auto"
        >
            <AppPhoto :src="img" :alt="label" class="object-cover object-center" />
            <div
                class="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent"
            />
            <div
                v-if="isPinned"
                class="bg-primary/90 absolute top-1.5 left-1.5 flex rounded-full p-1 backdrop-blur-sm lg:top-4 lg:left-4 lg:p-2"
            >
                <UIcon name="ph:push-pin-duotone" class="size-3.5 text-white lg:size-6" />
            </div>
        </div>

        <!-- Content -->
        <div class="flex min-w-0 flex-1 flex-col justify-between max-lg:pr-2 max-lg:pb-1 lg:gap-2">
            <!-- Title & description -->
            <div class="flex flex-col gap-0.5 lg:gap-1">
                <h3
                    class="text-secondary line-clamp-2 text-lg leading-tight font-bold sm:text-2xl lg:leading-[1.1] xl:text-3xl"
                >
                    {{ label }}
                </h3>
                <p
                    class="text-default/66 line-clamp-2 text-xs leading-relaxed font-medium sm:text-base"
                >
                    {{ description }}
                </p>
            </div>

            <!-- Meta -->
            <div
                class="flex items-center justify-between text-xs uppercase max-md:gap-0.5 sm:text-base"
            >
                <div class="text-default/75 flex gap-0.5 font-bold tracking-widest md:gap-1.5">
                    <span class="flex items-center gap-1">
                        <UIcon
                            name="ph:calendar-blank"
                            class="text-primary/75 size-3.5 shrink-0 sm:size-5"
                        />
                        {{ formattedDate }}
                    </span>
                    <span class="flex items-center gap-1">
                        <UIcon
                            name="ph:clock"
                            class="text-primary/75 size-3.5 shrink-0 sm:size-5"
                        />
                        {{ time }}
                    </span>
                </div>
                <span class="text-primary truncate font-bold">{{ price ?? "Бесплатно" }}</span>
            </div>
        </div>
    </article>
</template>
