<script lang="ts" setup>
import { EnrollRoutesEnum } from "~/constants/nav"
import type { Activity } from "~/types"

const props = withDefaults(
    defineProps<{
        activities?: Activity[]
    }>(),
    {
        activities: () => []
    }
)

// Возрастной диапазон по всем группам всех кружков: минимум из age_min, максимум из age_max.
const ageLabel = computed(() => {
    const { min, max } = getAgeBounds(props.activities.flatMap((activity) => activity.groups))
    return formatAgeRange(min, max)
})
</script>

<template>
    <UiPageSection class="gradient-bg-ps flex flex-col gap-16">
        <UContainer
            class="relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16"
        >
            <div class="flex flex-col gap-8">
                <UiSectionLeading as="h1" subtitle="" icon="">
                    <template #title>
                        <span class="text-secondary">
                            Место, где <br />
                            <span class="text-primary"> таланты </span>
                            <br />
                            становятся <span class="text-primary">навыками</span>
                        </span>
                    </template>
                    <template #description>
                        Уютное пространство, где каждый найдет увлечение по душе. Внимательные
                        педагоги помогут раскрыть таланты малышам и с удовольствием провести время
                        взрослым.
                    </template>

                    <template v-if="activities.length" #extra>
                        <dl
                            class="flex flex-wrap items-center gap-6 text-base font-semibold max-sm:gap-2 md:text-lg"
                        >
                            <div class="flex items-baseline gap-2">
                                <dt class="text-muted">Всего направлений:</dt>
                                <dd class="text-default font-bold">{{ activities.length }}</dd>
                            </div>
                            <div v-if="ageLabel" class="flex items-baseline gap-2">
                                <dt class="text-muted">Возраст:</dt>
                                <dd class="text-default font-bold">{{ ageLabel }}</dd>
                            </div>
                        </dl>
                    </template>

                    <template #action>
                        <div class="flex flex-col gap-4">
                            <UButton :to="EnrollRoutesEnum.Trial" size="lg" class="group w-fit">
                                <UIcon
                                    name="ph:calendar-dot-duotone"
                                    class="size-4.5 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6 md:size-5.5"
                                />
                                <span class="text-base font-bold md:text-lg">Пробное занятие</span>
                            </UButton>
                        </div>
                    </template>
                </UiSectionLeading>
            </div>

            <picture
                class="flex h-96 w-full items-center justify-center overflow-hidden rounded-lg shadow-sm max-lg:max-w-140 max-sm:h-72 lg:h-120"
            >
                <UiPhoto
                    src="/moke/clubs-page-hero.jpeg"
                    :quality="75"
                    :preload="{ fetchPriority: 'high' }"
                    :is-preload="true"
                    :height="480"
                    :width="470"
                    class="flex size-full object-cover"
                />
            </picture>
        </UContainer>
    </UiPageSection>
</template>
