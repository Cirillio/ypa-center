<script lang="ts" setup>
import type { EventShort } from "~/types"
import { EnrollRoutesEnum } from "~/constants/nav"

const props = defineProps<EventShort>()

const formattedDate = computed(() => {
    return new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "2-digit"
    }).format(new Date(props.date))
})
</script>

<template>
    <article
        class="group/article hover:ring-primary bg-default flex flex-row gap-2 rounded-md p-2 ring-2 ring-transparent transition lg:flex-col lg:gap-4 lg:p-4"
    >
        <!-- Image -->
        <div
            class="relative aspect-square w-20 shrink-0 overflow-hidden rounded-sm min-[340px]:w-24 sm:w-32 lg:aspect-4/3 lg:w-auto"
        >
            <AppPhoto :src="img" :alt="label" class="object-cover object-center" />
            <div
                class="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent"
            />
        </div>

        <!-- Content -->
        <div class="flex min-w-0 flex-1 flex-col justify-between max-lg:pr-2 max-lg:pb-1 lg:gap-2">
            <!-- Title & description -->
            <div class="grid gap-1">
                <NuxtLink :to="{ path: EnrollRoutesEnum.Event, query: { eventId: id } }">
                    <h3
                        class="text-secondary focus-within:text-primary active:text-primary hover:text-primary line-clamp-2 text-lg leading-tight font-bold transition sm:text-2xl lg:leading-[1.1] xl:text-3xl"
                    >
                        {{ label }}
                    </h3>
                </NuxtLink>
                <p
                    class="text-default/90 line-clamp-2 text-xs leading-relaxed font-medium sm:text-base"
                >
                    {{ description }}
                </p>
            </div>

            <!-- Meta -->

            <div
                class="flex items-center justify-between text-xs uppercase max-md:gap-0.5 sm:text-base"
            >
                <div class="text-default/95 flex gap-0.5 font-bold tracking-widest md:gap-1.5">
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
