<script lang="ts" setup>
import type { Club, Subgroup } from "~/types"
import { EnrollRoutesEnum } from "~/constants/nav"

const props = defineProps<{
    club: Club
    index: number
    subgroups: Subgroup[]
    scheduledDays: string[]
}>()

const formattedNumber = computed(() => String(props.index + 1).padStart(2, "0"))

type Tab = "features" | "subgroups"
const activeTab = ref<Tab>("features")

const tabs: { id: Tab; label: string }[] = [
    { id: "features", label: "Особенности" },
    { id: "subgroups", label: "Подгруппы" }
]
</script>

<template>
    <article
        :id="club.slug"
        class="group relative flex w-full grid-cols-9 rounded-sm bg-white max-md:flex-col md:grid"
    >
        <!-- Фото с декоративным номером -->
        <div
            class="relative col-span-3 h-60 min-h-0 w-full shrink-0 overflow-hidden max-md:rounded-sm md:h-full md:rounded-l-sm xl:min-h-132"
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
        <div class="col-span-6 flex min-w-0 flex-col gap-4 px-3 py-4 md:p-6">
            <!-- Строка 1: педагог -->
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

            <!-- Табы: Особенности / Подгруппы -->
            <div class="bg-default/50 mb-auto flex flex-col gap-2 rounded-sm p-2 md:p-4">
                <!-- Tab nav -->
                <div class="flex gap-4">
                    <button
                        v-for="tab in tabs"
                        :key="tab.id"
                        type="button"
                        class="flex-1 cursor-pointer rounded-sm bg-white px-3 py-2 text-sm font-semibold transition-all duration-150 sm:text-base"
                        :class="
                            activeTab === tab.id
                                ? 'text-primary ring-primary/75 ring-2'
                                : 'text-default hover:ring-primary/25 ring-default/75 ring-2'
                        "
                        @click="activeTab = tab.id"
                    >
                        {{ tab.label }}
                    </button>
                </div>

                <!-- Tab content -->
                <div
                    v-if="activeTab === 'features'"
                    key="features"
                    class="flex flex-col gap-2 py-2"
                >
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

                <div v-else key="subgroups" class="flex flex-col gap-2 py-2">
                    <div
                        v-if="subgroups.length === 0"
                        class="text-default/40 py-2 text-base font-semibold"
                    >
                        Подгруппы не найдены
                    </div>
                    <div
                        v-for="sg in subgroups"
                        :key="sg.id"
                        class="text-default/75 group/sub grid grid-cols-[auto_1fr_auto] items-center gap-2 text-base font-semibold"
                    >
                        <UIcon
                            name="ph:users-three-duotone"
                            class="text-secondary size-5 shrink-0 md:size-6"
                        />
                        <span class="line-clamp-1" :title="sg.name">{{ sg.name }}</span>
                        <span
                            class="text-default/75 group-hover/sub:text-primary shrink-0 text-base font-bold tabular-nums transition"
                            >до {{ sg.capacity }} чел.</span
                        >
                    </div>
                </div>
            </div>

            <!-- Строка 3: расписание + CTA -->
            <div class="flex w-full flex-wrap gap-4 max-md:flex-col md:items-center">
                <div class="flex gap-2">
                    <span
                        :title="'Расписание: ' + scheduledDays.join(', ')"
                        class="bg-default text-default/90 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-lg font-semibold max-lg:text-sm"
                    >
                        <UIcon
                            name="ph:calendar-dots-duotone"
                            class="text-secondary size-4.5 shrink-0 md:size-5"
                        />
                        {{ scheduledDays.join(", ") }}
                    </span>
                </div>
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
