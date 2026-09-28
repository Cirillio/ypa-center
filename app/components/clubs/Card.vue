<script lang="ts" setup>
import { EnrollRoutesEnum } from "~/constants/nav"
import type { Activity } from "~/types"

// Карточка кружка в каталоге: особенности и подгруппы видны сразу, без табов.
const props = defineProps<{
    activity: Activity
    index: number
}>()

const formattedNumber = computed(() => String(props.index + 1).padStart(2, "0"))

// ПОЧЕМУ: в БД поля заполнены наоборот – короткие метки лежат в `features`,
// тезисы «Особенности» – в `tags`. Отображение подстроено под данные до правки сида.
const skills = computed(() => (props.activity.features as string[] | undefined) ?? [])
const highlights = computed(() => (props.activity.tags as string[] | undefined) ?? [])

const ageBuckets = computed(() => groupByAge(props.activity.groups))
const commonCapacity = computed(() => getCommonCapacity(props.activity.groups))

// Строка «подходит ли»: общий возраст, дни, вместимость – только известные части.
const metaItems = computed(() => {
    const { min, max } = getAgeBounds(props.activity.groups)
    const days = props.activity.days_of_week.map((day) => getDayName("short", day)).join(", ")
    return [
        formatAgeRange(min, max),
        days || null,
        commonCapacity.value ? `до ${commonCapacity.value} детей в группе` : null
    ].filter((item): item is string => item !== null)
})

// Поимённый список групп для поповера: по возрасту, затем по имени; префикс-название кружка срезается.
// Имена групп в БД начинаются со строчной после среза названия кружка.
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const groupDetails = computed(() => {
    const clubName = props.activity.name
    const stripClubName = (name: string) =>
        name.startsWith(clubName) ? name.slice(clubName.length).replace(/^\s*[—–-]\s*/, "") : name
    return [...props.activity.groups]
        .sort(
            (a, b) =>
                (a.age_min ?? Infinity) - (b.age_min ?? Infinity) ||
                (a.group_name ?? "").localeCompare(b.group_name ?? "")
        )
        .map((g) => ({
            id: g.id,
            name: capitalize(stripClubName(g.group_name ?? "")) || "Группа",
            age: formatAgeRange(g.age_min ?? null, g.age_max ?? null),
            capacity: g.max_capacity ?? null
        }))
})

const hasPanel = computed(() => highlights.value.length > 0 || ageBuckets.value.length > 0)
const headingId = computed(() => `club-${props.activity.id}`)
</script>

<template>
    <article
        :id="activity.slug"
        class="flex w-full scroll-mt-[calc(var(--ui-header-height)+0.5rem)] flex-col gap-5 rounded-sm bg-white p-4 md:grid md:grid-cols-9 lg:gap-6 lg:p-6"
    >
        <!-- Фото -->
        <div
            class="relative aspect-video w-full overflow-hidden rounded-xs md:col-span-3 md:aspect-auto md:h-full md:min-h-112"
        >
            <UiPhoto
                :src="activity.cover_image ?? ''"
                :alt="activity.name"
                class="absolute inset-0 size-full object-cover object-center"
                :quality="90"
            />
            <span
                class="text-primary absolute top-3 left-3 rounded-xs bg-white/90 px-2.5 py-1 text-sm font-extrabold tabular-nums backdrop-blur-sm select-none md:text-base"
                aria-hidden="true"
            >
                {{ formattedNumber }}
            </span>
        </div>

        <div class="flex min-w-0 flex-col gap-4 md:col-span-6">
            <!-- Заголовок и метаданные -->
            <header class="flex flex-col gap-2">
                <h3 class="text-primary text-2xl font-extrabold md:text-3xl lg:text-4xl">
                    {{ activity.name }}
                </h3>
                <p
                    v-if="metaItems.length"
                    class="text-muted flex flex-wrap items-center gap-x-2 text-sm font-semibold md:text-base"
                >
                    <template v-for="(item, i) in metaItems" :key="item">
                        <span v-if="i > 0" aria-hidden="true">·</span>
                        <span>{{ item }}</span>
                    </template>
                </p>
                <ul v-if="skills.length" class="flex flex-wrap gap-2 pt-1" aria-label="Навыки">
                    <li
                        v-for="skill in skills"
                        :key="skill"
                        class="bg-secondary/5 text-secondary rounded-md px-2 py-0.5 text-xs leading-5 font-semibold sm:text-sm"
                    >
                        {{ skill }}
                    </li>
                </ul>
            </header>

            <!-- Описание -->
            <p class="text-default line-clamp-4 text-base leading-relaxed font-medium text-pretty">
                {{ activity.description }}
            </p>

            <!-- Особенности | Подгруппы -->
            <div
                v-if="hasPanel"
                class="bg-default grid gap-4 rounded-xs p-4 lg:gap-6"
                :class="highlights.length && ageBuckets.length ? 'lg:grid-cols-[1.4fr_1fr]' : ''"
            >
                <section
                    v-if="highlights.length"
                    :aria-labelledby="`${headingId}-features`"
                    class="flex flex-col gap-2"
                >
                    <h4
                        :id="`${headingId}-features`"
                        class="text-muted text-xs font-bold tracking-wide uppercase"
                    >
                        Особенности
                    </h4>
                    <ul class="flex flex-col gap-1.5">
                        <li
                            v-for="item in highlights"
                            :key="item"
                            class="text-default flex items-start gap-2 text-sm font-semibold md:text-base"
                        >
                            <UIcon
                                name="ph:check-bold"
                                class="text-secondary mt-1 size-4 shrink-0"
                            />
                            {{ item }}
                        </li>
                    </ul>
                </section>

                <section
                    v-if="ageBuckets.length"
                    :aria-labelledby="`${headingId}-groups`"
                    class="flex flex-col gap-2"
                >
                    <div class="flex items-center gap-1">
                        <h4
                            :id="`${headingId}-groups`"
                            class="text-muted text-xs font-bold tracking-wide uppercase"
                        >
                            Подгруппы
                        </h4>
                        <UPopover :content="{ align: 'end', collisionPadding: 16 }">
                            <UButton
                                variant="ghost"
                                color="neutral"
                                size="xs"
                                icon="ph:info-bold"
                                :aria-label="`Все группы кружка «${activity.name}»`"
                                class="text-muted hover:text-primary -my-1 rounded-full p-1"
                            />
                            <template #content>
                                <section
                                    class="flex w-72 flex-col gap-2 p-4"
                                    :aria-label="`Группы кружка «${activity.name}»`"
                                >
                                    <h5 class="text-primary text-sm font-bold">Все группы</h5>
                                    <ul class="divide-default divide-y">
                                        <li
                                            v-for="g in groupDetails"
                                            :key="g.id"
                                            class="flex items-baseline justify-between gap-3 py-1.5 text-sm"
                                        >
                                            <span class="text-default font-semibold">{{
                                                g.name
                                            }}</span>
                                            <span class="text-muted shrink-0 tabular-nums">
                                                {{ g.age
                                                }}<template v-if="g.capacity"
                                                    >, до {{ g.capacity }} чел.</template
                                                >
                                            </span>
                                        </li>
                                    </ul>
                                </section>
                            </template>
                        </UPopover>
                    </div>
                    <ul class="flex flex-wrap gap-2 md:flex-col md:gap-1.5">
                        <li
                            v-for="bucket in ageBuckets"
                            :key="bucket.key"
                            class="flex items-center gap-2 rounded-md bg-white px-3 py-1 text-sm font-semibold max-md:w-fit md:justify-between md:rounded-none md:bg-transparent md:p-0 md:text-base"
                        >
                            <span class="text-default">{{ bucket.label }}</span>
                            <span class="text-muted tabular-nums">
                                {{ bucket.groupCount }}
                                {{ pluralize(bucket.groupCount, ["группа", "группы", "групп"])
                                }}<template v-if="!commonCapacity && bucket.maxCapacity"
                                    >, до {{ bucket.maxCapacity }}</template
                                >
                            </span>
                        </li>
                    </ul>
                </section>
            </div>

            <!-- CTA -->
            <div class="mt-auto flex">
                <UButton
                    variant="soft"
                    :to="{ path: EnrollRoutesEnum.Trial, query: { clubId: activity.id } }"
                    class="group/btn gap-1 font-semibold max-md:w-full max-md:justify-center md:ml-auto md:text-base"
                >
                    Записаться на пробное
                    <UIcon
                        name="ph:arrow-right-bold"
                        class="size-4 transition-transform duration-150 group-hover/btn:translate-x-0.5"
                    />
                </UButton>
            </div>
        </div>
    </article>
</template>
