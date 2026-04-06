<script lang="ts" setup>
import type { Club } from "~/types"

const props = defineProps<{
    club: Club
    index: number
}>()

const formattedNumber = computed(() => String(props.index + 1).padStart(2, "0"))
</script>

<template>
    <article
        :id="club.slug"
        class="group hover:ring-primary focus-within:ring-primary relative flex w-full gap-2 rounded-md bg-white p-4 ring-2 ring-transparent transition-all duration-200 max-md:flex-col md:gap-6"
    >
        <!-- Фото с декоративным номером -->
        <div
            class="h-40 w-full shrink-0 overflow-hidden rounded-md min-[468px]:h-60 md:size-48 xl:size-68"
        >
            <AppPhoto :src="club.photo" :alt="club.name" class="object-cover object-center" />
        </div>
        <span
            class="text-primary absolute top-0 left-0 flex aspect-square rounded-full bg-white p-2 text-sm font-bold select-none max-lg:top-2 max-lg:left-2 md:p-3 lg:text-lg"
            aria-hidden="true"
        >
            {{ formattedNumber }}
        </span>

        <!-- Основной контент -->
        <div class="flex min-w-0 flex-col gap-2">
            <!-- Строка 1: название + педагог -->
            <div class="flex items-start justify-between gap-1 max-md:flex-col md:gap-4">
                <h3
                    class="text-secondary group-hover:text-primary text-2xl leading-tight font-extrabold transition-colors duration-200 sm:text-3xl xl:text-4xl"
                >
                    {{ club.name }}
                </h3>
                <div class="flex shrink-0 items-center gap-2">
                    <UAvatar
                        :src="club.teacher.photo"
                        :alt="club.teacher.name"
                        size="sm"
                        :ui="{
                            root: 'bg-default',
                            icon: 'text-primary/75'
                        }"
                        icon="ph:user-bold"
                    />
                    <span class="text-default/60 text-sm font-semibold">{{
                        club.teacher.name
                    }}</span>
                </div>
            </div>

            <!-- Строка 2: описание -->
            <p
                class="text-default/55 line-clamp-4 text-base leading-relaxed font-medium md:line-clamp-2 lg:text-lg xl:text-xl"
            >
                {{ club.description }}
            </p>

            <!-- Строка 3: мета-теги -->
            <div class="mt-auto flex w-full flex-wrap gap-2 max-md:flex-col md:items-center">
                <div class="flex gap-2">
                    <span
                        class="bg-default text-default/70 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-base font-semibold max-md:text-sm"
                    >
                        <UIcon name="ph:baby-duotone" class="text-secondary size-4 shrink-0" />
                        {{ club.age.min }}–{{ club.age.max }} лет
                    </span>
                    <span
                        class="bg-default text-default/70 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-base font-semibold max-md:text-sm"
                    >
                        <UIcon
                            name="ph:calendar-dots-duotone"
                            class="text-secondary size-4 shrink-0 md:size-4.5"
                        />
                        {{ club.schedule.days.join(", ") }}
                    </span>
                </div>
                <span
                    class="bg-default flex w-fit items-center gap-2 rounded-md px-3 py-1.5 text-lg font-bold max-md:text-base"
                    :class="GetCapacityTextColor(club.spots_available)"
                >
                    <UIcon name="ph:users-duotone" class="mb-0.5 size-4.5 md:size-5" />
                    <span class="md:hidden">Доступно мест:</span>
                    <span class="max-md:hidden">Мест:</span>
                    {{ club.spots_available }}
                </span>
                <UButton
                    v-if="club.spots_available > 0"
                    to="/enroll"
                    :disabled="club.spots_available === 0"
                    class="group/btn ml-auto w-fit gap-1 text-base font-semibold max-md:mt-2 max-md:w-full max-md:justify-center max-md:py-2 md:text-lg"
                >
                    Записаться
                    <UIcon
                        name="ph:arrow-right-bold"
                        class="size-3.5 transition-transform duration-150 group-hover/btn:translate-x-0.5 md:size-4.5"
                    />
                </UButton>
                <span
                    v-else
                    class="text-default/80 text-base font-bold underline max-md:mt-2 max-md:ml-2 md:ml-auto md:text-lg"
                >
                    Набор закрыт</span
                >
            </div>
        </div>
    </article>
</template>
