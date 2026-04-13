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
        class="group relative flex w-full grid-cols-7 rounded-sm bg-white max-md:flex-col md:grid"
    >
        <!-- Фото с декоративным номером -->
        <div
            class="relative col-span-2 h-60 min-h-0 w-full shrink-0 overflow-hidden max-md:rounded-sm md:h-full md:rounded-l-sm xl:min-h-132"
        >
            <div
                class="absolute top-0 left-0 z-10 h-full w-full bg-linear-to-t from-black/75 to-transparent"
            ></div>
            <AppPhoto :src="club.photo" :alt="club.name" class="object-cover object-center" />
            <div class="absolute bottom-2 z-20 flex flex-col gap-2 p-2 md:bottom-4 md:p-4">
                <h3
                    :title="club.name"
                    class="line-clamp-2 text-2xl font-extrabold text-white transition-colors duration-200 text-shadow-xs sm:text-3xl xl:text-5xl xl:leading-12"
                >
                    {{ club.name }}
                </h3>
                <div class="flex flex-wrap gap-2">
                    <span
                        v-for="skill in club.skills"
                        :key="skill"
                        :title="'Навык: ' + skill"
                        class="bg-default/15 rounded-md px-1.5 py-px text-center text-xs leading-5 font-semibold text-white backdrop-blur-sm text-shadow-xs sm:px-2 sm:py-0.5 sm:text-sm"
                    >
                        {{ skill }}
                    </span>
                </div>
            </div>
        </div>
        <span
            class="text-primary absolute top-2 left-2 flex aspect-square rounded-sm bg-white p-2 text-sm leading-4.5 font-bold select-none lg:text-lg lg:leading-6"
            aria-hidden="true"
        >
            {{ formattedNumber }}
        </span>

        <!-- Основной контент -->
        <div class="col-span-5 flex min-w-0 flex-col gap-4 px-3 py-4 md:p-6">
            <!-- Строка 1: название + педагог -->
            <div class="flex shrink-0 items-center gap-2">
                <div
                    class="flex size-6 items-center justify-center overflow-hidden rounded-full md:size-8"
                >
                    <AppPhoto
                        :quality="25"
                        :src="club.teacher.photo"
                        :alt="club.teacher.name"
                        class="object-cover object-center"
                    />
                </div>
                <span
                    :title="club.teacher.name"
                    class="text-default/90 text-base font-semibold md:text-lg"
                    >{{ club.teacher.name }}</span
                >
            </div>

            <!-- Строка 2: описание -->
            <p
                :title="club.description"
                class="text-default/90 text-base font-medium lg:line-clamp-7 lg:text-lg xl:text-xl"
            >
                {{ club.description }}
            </p>

            <div class="bg-default/50 mt-auto grid gap-2 rounded-sm p-2 md:p-4">
                <span
                    v-for="outcome in club.outcomes"
                    :key="outcome"
                    :title="outcome"
                    class="text-default/75 hover:text-primary line-clamp-2 grid grid-cols-[auto_1fr] items-center gap-2 text-sm leading-tight font-semibold lg:text-lg"
                >
                    <UIcon name="ph:dot-duotone" class="text-secondary size-6 md:size-8" />
                    {{ outcome }}
                </span>
            </div>

            <!-- Строка 3: мета-теги -->
            <div class="flex w-full flex-wrap gap-4 max-md:flex-col md:items-center">
                <div class="flex gap-2">
                    <span
                        :title="'Расписание: ' + club.schedule.days.join(', ')"
                        class="bg-default text-default/90 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-lg font-semibold max-lg:text-sm"
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
                    class="bg-default flex w-fit items-center gap-2 rounded-md px-3 py-1.5 text-lg font-bold max-lg:text-base"
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
                    class="group/btn w-fit gap-1 font-semibold max-md:mt-2 max-md:w-full max-md:justify-center max-sm:py-2 md:text-base lg:ml-auto"
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
                    class="ml-auto w-fit text-base font-semibold max-md:mt-2 max-md:w-full max-md:justify-center max-md:py-2 md:text-xl"
                >
                    Встать в очередь
                </UButton>
            </div>
        </div>
    </article>
</template>
