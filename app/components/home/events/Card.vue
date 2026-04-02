<template>
    <!-- Card -->
    <article
        class="bg-default group hover:ring-primary flex cursor-pointer flex-col gap-5 rounded-md p-4 ring-2 ring-transparent transition"
    >
        <!-- Image -->
        <div class="relative aspect-4/3 overflow-hidden rounded-md">
            <AppPhoto :src="img" :alt="label" />
            <div
                class="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent"
            />
            <div
                v-if="isPinned"
                class="bg-primary/90 absolute top-4 left-4 flex rounded-full p-2 backdrop-blur-sm"
            >
                <UIcon name="ph:push-pin-duotone" class="size-6 text-white" />
            </div>
        </div>

        <!-- Title & description -->
        <div class="flex flex-col gap-2">
            <h3
                class="text-secondary group-hover:text-secondary/75 text-3xl leading-[1.1] font-extrabold transition-colors duration-200"
            >
                {{ label }}
            </h3>
            <p class="text-default/66 line-clamp-2 text-lg leading-relaxed font-medium">
                {{ description }}
            </p>
        </div>

        <div class="flex items-center justify-between text-lg uppercase">
            <!-- Meta: date & time -->
            <div class="text-default/75 flex gap-1.5 font-bold tracking-widest">
                <span class="flex items-center gap-1.5">
                    <UIcon name="ph:calendar-blank" class="text-primary/75 size-5 shrink-0" />
                    {{ formattedDate }}
                </span>

                <span class="flex items-center gap-1.5">
                    <UIcon name="ph:clock" class="text-primary/75 size-5 shrink-0" />
                    {{ time }}
                </span>
            </div>

            <!-- CTA hint -->
            <span class="text-primary flex items-center gap-1.5 font-bold">
                {{ price ?? "Бесплатно" }}
                <UIcon
                    name="ph:arrow-right"
                    class="mb-0.5 size-5 transition-transform duration-200 group-hover:translate-x-1"
                />
            </span>
        </div>
    </article>
</template>

<script lang="ts" setup>
import type { EventShort } from "~/types"

const props = defineProps<EventShort>()

const formattedDate = computed(() => {
    return new Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "long"
    }).format(new Date(props.date))
})
</script>
