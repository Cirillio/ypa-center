<script lang="ts" setup>
import type { TabsItem } from "@nuxt/ui"
import { EnrollRoutesEnum } from "~/constants/nav"
import type { Activity } from "~/types"

const props = defineProps<{
    activity: Activity
    index: number
}>()

const formattedNumber = computed(() => String(props.index + 1).padStart(2, "0"))
const features = computed(() => (props.activity.features as string[] | undefined) ?? [])
const tags = computed(() => (props.activity.tags as string[] | undefined) ?? [])
const spotsAvailable = computed(() =>
    props.activity.groups.reduce((sum, g) => sum + g.seats_free, 0)
)
const clubDays = computed(() => props.activity.days_of_week.map((day) => getDayName("short", day)))

const tabs = [
    { label: "Особенности", slot: "features" as const },
    { label: "Подгруппы", slot: "subgroups" as const }
] satisfies TabsItem[]
</script>

<template>
    <article
        :id="`${activity.slug}`"
        class="group relative flex w-full scroll-mt-[calc(var(--ui-header-height)+0.5rem)] grid-cols-9 rounded-sm bg-white shadow-xs max-md:flex-col md:grid"
    >
        <!-- Фото с декоративным номером -->
        <div
            class="relative col-span-3 h-60 min-h-0 w-full shrink-0 overflow-hidden max-md:rounded-sm md:h-full md:rounded-l-sm xl:min-h-132"
        >
            <div
                class="absolute top-0 left-0 z-10 h-full w-full bg-linear-to-t from-black/75 to-transparent"
            ></div>
            <UiPhoto
                :src="activity.cover_image ?? ''"
                :alt="activity.name"
                class="object-cover object-center"
                :quality="90"
            />
            <div class="absolute bottom-2 z-20 flex flex-col gap-2 p-2 md:bottom-4 md:p-4">
                <h3
                    :title="activity.name"
                    class="line-clamp-2 text-2xl font-extrabold text-white transition-colors duration-200 text-shadow-xs sm:text-3xl xl:text-5xl xl:leading-12"
                >
                    {{ activity.name }}
                </h3>
                <div class="flex flex-wrap gap-2">
                    <span
                        v-for="feature in features"
                        :key="feature"
                        :title="'Навык: ' + feature"
                        class="bg-default/15 rounded-md px-1.5 py-px text-center text-xs leading-5 font-semibold text-white backdrop-blur-sm text-shadow-xs sm:px-2 sm:py-0.5 sm:text-sm"
                    >
                        {{ feature }}
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
            <!-- Описание -->
            <p
                class="text-default/90 text-justify text-base font-medium lg:line-clamp-7 lg:text-lg xl:text-xl"
            >
                {{ activity.description }}
            </p>

            <!-- Табы: Особенности / Подгруппы -->
            <UTabs
                :items="tabs"
                class="bg-default mb-auto rounded-sm p-2 md:p-4"
                :ui="{
                    list: 'rounded-sm bg-white shadow-xs',
                    indicator: 'rounded-sm',
                    trigger: 'cursor-pointer rounded-sm font-semibold sm:text-base'
                }"
            >
                <template #features>
                    <div class="flex flex-col gap-2 py-2">
                        <span
                            v-for="tag in tags"
                            :key="tag"
                            class="text-default/75 hover:text-primary line-clamp-2 grid grid-cols-[auto_1fr] items-center gap-2 text-sm leading-tight font-semibold lg:text-lg"
                        >
                            <UIcon name="ph:dot-duotone" class="text-secondary size-6 md:size-8" />
                            {{ tag }}
                        </span>
                    </div>
                </template>

                <template #subgroups>
                    <div class="flex flex-col gap-2 py-2">
                        <div
                            v-if="activity.groups.length === 0"
                            class="text-default/40 py-2 text-base font-semibold"
                        >
                            Подгруппы не найдены
                        </div>
                        <div
                            v-for="g in activity.groups"
                            :key="g.id"
                            class="text-default/75 group/sub grid grid-cols-[auto_1fr_auto] items-center gap-2 text-base font-semibold"
                        >
                            <UIcon
                                name="ph:users-three-duotone"
                                class="text-secondary size-5 shrink-0 md:size-6"
                            />
                            <span class="line-clamp-1" :title="g.group_name">{{
                                g.group_name
                            }}</span>
                            <span
                                class="text-default/75 group-hover/sub:text-primary shrink-0 text-base font-bold tabular-nums transition"
                                >до {{ g.max_capacity }} чел.</span
                            >
                        </div>
                    </div>
                </template>
            </UTabs>

            <!-- Расписание + CTA -->
            <div class="flex w-full flex-wrap gap-4 max-md:flex-col md:items-center">
                <div class="flex gap-2">
                    <span
                        :title="'Расписание: ' + clubDays.join(', ')"
                        class="bg-default text-default/90 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-lg font-semibold max-lg:text-sm"
                    >
                        <UIcon
                            name="ph:calendar-dots-duotone"
                            class="text-secondary size-4.5 shrink-0 md:size-5"
                        />
                        {{ clubDays.join(", ") }}
                    </span>
                </div>
                <UButton
                    v-if="spotsAvailable > 0"
                    variant="soft"
                    :to="{ path: EnrollRoutesEnum.Trial, query: { clubId: activity.slug } }"
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
                        query: { clubId: activity.slug, waitlist: '1' }
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
