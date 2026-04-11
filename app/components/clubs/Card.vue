<script lang="ts" setup>
import type { Club } from "~/types"
import { EnrollRoutesEnum } from "~/constants/nav"

const props = defineProps<{
    club: Club
    index: number
}>()

const formattedNumber = computed(() => String(props.index + 1).padStart(2, "0"))
</script>

<template>
    <article
        :id="club.slug"
        class="group hover:ring-primary focus-within:ring-primary relative flex w-full rounded-md bg-white ring-2 ring-transparent transition-all duration-200 max-md:flex-col"
    >
        <!-- Фото с декоративным номером -->
        <div
            class="relative aspect-3/4 h-40 shrink-0 overflow-hidden rounded-md min-[468px]:h-60 md:min-h-100 xl:min-h-132"
        >
            <div
                class="absolute top-0 left-0 z-10 h-full w-full bg-linear-to-t from-black/75 to-transparent"
            ></div>
            <AppPhoto :src="club.photo" :alt="club.name" class="object-cover object-center" />
            <div class="absolute bottom-4 z-20 flex flex-col gap-2 p-4">
                <h3
                    :title="club.name"
                    class="line-clamp-2 text-2xl leading-12 font-extrabold text-white transition-colors duration-200 text-shadow-xs sm:text-3xl xl:text-5xl"
                >
                    {{ club.name }}
                </h3>
                <div class="flex flex-wrap gap-2">
                    <span
                        v-for="skill in club.skills"
                        :key="skill"
                        :title="'Навык: ' + skill"
                        class="bg-default/15 rounded-md px-2 py-0.5 text-sm leading-5 font-semibold text-white backdrop-blur-sm text-shadow-xs"
                    >
                        {{ skill }}
                    </span>
                </div>
            </div>
        </div>
        <span
            class="text-primary absolute top-2 left-2 flex aspect-square rounded-full bg-white p-2 text-sm leading-6 font-bold select-none lg:text-lg"
            aria-hidden="true"
        >
            {{ formattedNumber }}
        </span>

        <!-- Основной контент -->
        <div class="flex min-w-0 flex-col gap-4 px-6 py-6">
            <!-- Строка 1: название + педагог -->
            <div class="flex shrink-0 items-center gap-2">
                <div class="flex size-8 items-center justify-center overflow-hidden rounded-full">
                    <AppPhoto
                        :quality="25"
                        :src="club.teacher.photo"
                        :alt="club.teacher.name"
                        class="object-cover object-center"
                    />
                </div>
                <span :title="club.teacher.name" class="text-default/90 text-lg font-semibold">{{
                    club.teacher.name
                }}</span>
            </div>

            <!-- Строка 2: описание -->
            <p
                class="text-default/90 line-clamp-4 text-base leading-tight font-medium md:line-clamp-7 lg:text-lg xl:text-xl"
            >
                {{ club.description }}
            </p>

            <div class="bg-default/50 mt-auto flex flex-col gap-2 rounded-sm p-4">
                <span
                    v-for="outcome in club.outcomes"
                    :key="outcome"
                    :title="outcome"
                    class="text-default/75 hover:text-primary flex items-center gap-2 text-lg font-semibold"
                >
                    <UIcon name="ph:dot-duotone" class="text-secondary size-8" />
                    {{ outcome }}
                </span>
            </div>

            <!-- Строка 3: мета-теги -->
            <div class="flex w-full flex-wrap gap-4 max-md:flex-col md:items-center">
                <div class="flex gap-2">
                    <span
                        :title="'Расписание: ' + club.schedule.days.join(', ')"
                        class="bg-default text-default/90 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-lg font-semibold max-md:text-sm"
                    >
                        <UIcon
                            name="ph:calendar-dots-duotone"
                            class="text-secondary size-4.5 shrink-0 md:size-5"
                        />
                        {{ club.schedule.days.join(", ") }}
                    </span>
                </div>
                <span
                    :title="'Свободно мест: ' + club.spots_available"
                    class="bg-default flex w-fit items-center gap-2 rounded-md px-3 py-1.5 text-lg font-bold max-md:text-base"
                    :class="getCapacityTextColor(club.spots_available)"
                >
                    <UIcon name="ph:users-duotone" class="mb-0.5 size-4.5 md:size-5" />
                    <span class="md:hidden">Доступно мест:</span>
                    <span class="max-md:hidden">Мест:</span>
                    {{ club.spots_available }}
                </span>
                <UButton
                    v-if="club.spots_available > 0"
                    variant="soft"
                    :to="{ path: EnrollRoutesEnum.Trial, query: { clubId: club.slug } }"
                    class="group/btn ml-auto w-fit gap-1 text-base font-semibold max-md:mt-2 max-md:w-full max-md:justify-center max-md:py-2 md:text-lg"
                >
                    Записаться на пробное
                    <UIcon
                        name="ph:arrow-right-bold"
                        class="size-3.5 transition-transform duration-150 group-hover/btn:translate-x-0.5 md:size-4.5"
                    />
                </UButton>
                <UButton
                    v-else
                    :to="{
                        path: EnrollRoutesEnum.Trial,
                        query: { clubId: club.slug, waitlist: '1' }
                    }"
                    variant="ghost"
                    color="neutral"
                    class="ml-auto w-fit text-base font-semibold max-md:mt-2 max-md:w-full max-md:justify-center max-md:py-2 md:text-lg"
                >
                    Встать в очередь
                </UButton>
            </div>
        </div>
    </article>
</template>
