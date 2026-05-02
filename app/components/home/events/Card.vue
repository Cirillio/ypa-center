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

const router = useRouter()
</script>

<template>
    <article
        class="group bg-default/50 hover:bg-default active:bg-default flex cursor-pointer flex-row overflow-hidden rounded-sm transition duration-300 lg:flex-col"
        @click="router.push({ path: EnrollRoutesEnum.Event, query: { eventId: id } })"
    >
        <!-- Image -->
        <div
            class="relative aspect-square w-20 shrink-0 overflow-hidden min-[340px]:w-24 sm:w-32 lg:aspect-4/3 lg:w-auto"
        >
            <AppPhoto :src="img" :alt="label" class="object-cover object-center" />
            <div
                class="group-hover:from-default/30 absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent transition"
            />
        </div>

        <!-- Content -->
        <div class="flex min-w-0 flex-1 flex-col justify-between px-3 py-2 lg:gap-2 lg:p-4">
            <!-- Title & description -->
            <div class="grid gap-1">
                <h3
                    :title="label"
                    class="text-secondary focus-within:text-primary group-active:text-primary group-hover:text-primary line-clamp-2 text-lg leading-tight font-bold transition sm:text-2xl lg:leading-[1.1] xl:text-3xl"
                >
                    {{ label }}
                </h3>
                <p
                    :title="description"
                    class="text-default/90 line-clamp-3 text-xs leading-snug font-medium sm:text-base lg:line-clamp-5"
                >
                    {{ description }}
                </p>
            </div>

            <!-- Meta -->

            <div
                class="flex items-center justify-between text-xs uppercase max-lg:mt-2 max-md:gap-0.5 sm:text-base"
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
