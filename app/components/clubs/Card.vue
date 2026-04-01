<script lang="ts" setup>
import type { BadgeProps } from "@nuxt/ui"
import type { Club } from "~/types"

const props = defineProps<{
    club: Club
    index: number
}>()

const spotsStatus: ComputedRef<{ color: BadgeProps["color"]; label: string }> = computed(() => {
    const n = props.club.spots_available
    if (n === 0) return { color: "error", label: "Мест нет" }
    if (n <= 3) return { color: "warning", label: "Мало мест" }
    return { color: "success", label: "Есть места" }
})

const formattedNumber = computed(() => String(props.index + 1).padStart(2, "0"))
</script>

<template>
    <article
        class="group hover:ring-primary relative flex h-40 w-full gap-4 rounded-lg bg-white p-5 ring-2 ring-transparent transition-all duration-200 md:h-64 md:gap-8"
    >
        <!-- Фото с декоративным номером -->
        <div class="aspect-square h-full shrink-0 overflow-hidden rounded-md">
            <AppPhoto :src="club.photo" :alt="club.name" />
        </div>
        <span
            class="text-primary absolute top-2 left-2 flex aspect-square rounded-full bg-white p-3 text-lg font-bold select-none md:text-lg"
            aria-hidden="true"
        >
            {{ formattedNumber }}
        </span>

        <!-- Основной контент -->
        <div class="flex min-w-0 flex-col gap-2">
            <!-- Строка 1: название + педагог -->
            <div class="flex items-start justify-between gap-4">
                <h3
                    class="text-secondary group-hover:text-primary text-2xl leading-tight font-extrabold transition-colors duration-200 md:text-4xl"
                >
                    {{ club.name }}
                </h3>
                <div class="flex shrink-0 items-center gap-2 max-sm:hidden">
                    <UAvatar
                        :src="club.teacher.photo"
                        :alt="club.teacher.name"
                        size="sm"
                        icon="ph:user-bold"
                    />
                    <span class="text-default/60 text-sm font-semibold">{{
                        club.teacher.name
                    }}</span>
                </div>
            </div>

            <!-- Строка 2: описание -->
            <p
                class="text-default/55 line-clamp-2 text-base leading-relaxed font-medium md:text-xl"
            >
                {{ club.description }}
            </p>

            <!-- Строка 3: мета-теги -->
            <div class="mt-auto flex flex-wrap items-center gap-2">
                <span
                    class="bg-default text-default/70 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold md:text-base"
                >
                    <UIcon name="ph:baby-duotone" class="text-secondary size-4 shrink-0" />
                    {{ club.age.min }}–{{ club.age.max }} лет
                </span>
                <span
                    class="bg-default text-default/70 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold md:text-base"
                >
                    <UIcon name="ph:calendar-dots-duotone" class="text-secondary size-4 shrink-0" />
                    {{ club.schedule.days.join(", ") }}
                </span>

                <UIcon name="ph:dot-outline-duotone" class="text-primary size-6" />

                <UBadge size="xl" :color="spotsStatus.color" variant="soft" class="font-semibold">
                    {{ spotsStatus.label }}
                </UBadge>

                <UButton
                    to="/enroll"
                    size="xl"
                    :disabled="club.spots_available === 0"
                    class="group/btn ml-auto gap-1 font-semibold"
                >
                    {{ club.spots_available === 0 ? "Запись недоступна" : "Записаться" }}
                    <UIcon
                        v-if="club.spots_available > 0"
                        name="ph:arrow-right-bold"
                        class="size-3.5 transition-transform duration-150 group-hover/btn:translate-x-0.5"
                    />
                </UButton>
            </div>
        </div>
    </article>
</template>
