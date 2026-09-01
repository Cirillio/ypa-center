<script lang="ts" setup>
import { EnrollRoutesEnum } from "~/constants/nav"

const props = withDefaults(
    defineProps<{
        id: number
        title: string
        description?: string
        coverImage?: string
        startDatetime: string
        price?: number | null
        isFree: boolean
        isUpcoming: boolean
    }>(),
    {
        description: "",
        coverImage: "",
        price: null
    }
)

// Обложка опциональна на бэке — пустой src в AppPhoto даёт состояние ошибки
const FALLBACK_COVER = "/core/clubs-main.jpg"

// Фиксация таймзоны исключает SSR hydration mismatch между сервером (UTC) и клиентом
const formattedDate = computed(() => {
    return new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        timeZone: "Asia/Novosibirsk"
    }).format(new Date(props.startDatetime))
})

const formattedTime = computed(() => {
    return new Intl.DateTimeFormat("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Novosibirsk"
    }).format(new Date(props.startDatetime))
})

const formattedPrice = computed(() =>
    !props.isUpcoming
        ? "Завершено"
        : props.isFree
          ? "Бесплатно"
          : props.price != null
            ? formatRub(props.price)
            : ""
)
</script>

<template>
    <component
        :is="props.isUpcoming ? resolveComponent('NuxtLink') : 'div'"
        :to="
            isUpcoming
                ? { path: EnrollRoutesEnum.Event, query: { eventId: String(id) } }
                : undefined
        "
        itemscope
        itemtype="https://schema.org/Event"
        class="group bg-default/50 relative flex flex-row overflow-hidden rounded-sm transition duration-300 lg:flex-col"
        :class="
            isUpcoming
                ? 'hover:bg-default active:bg-default focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline-offset-2'
                : 'cursor-default opacity-75'
        "
    >
        <!-- SEO: Микроразметка Schema.org -->
        <meta itemprop="eventStatus" content="https://schema.org/EventScheduled" />
        <meta
            itemprop="eventAttendanceMode"
            content="https://schema.org/OfflineEventAttendanceMode"
        />

        <!-- Image -->
        <div
            class="relative aspect-square w-20 shrink-0 overflow-hidden min-[340px]:w-24 sm:w-32 lg:aspect-4/3 lg:w-auto"
        >
            <AppPhoto
                itemprop="image"
                :src="coverImage || FALLBACK_COVER"
                :alt="title"
                class="object-cover object-center transition duration-300 group-hover:scale-105"
            />
            <div
                class="group-hover:from-default/30 absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent transition"
            />
        </div>

        <!-- Content -->
        <div class="flex min-w-0 flex-1 flex-col justify-between px-3 py-2 lg:gap-2 lg:p-4">
            <!-- Title & description -->
            <div class="grid gap-1">
                <h3
                    itemprop="name"
                    class="text-secondary focus-within:text-primary group-active:text-primary group-hover:text-primary line-clamp-2 text-lg leading-tight font-bold transition sm:text-2xl lg:leading-[1.1] xl:text-3xl"
                >
                    {{ title }}
                </h3>
                <p
                    itemprop="description"
                    class="text-default/90 line-clamp-3 text-xs leading-snug font-medium sm:text-base lg:line-clamp-5"
                >
                    {{ description }}
                </p>
            </div>

            <!-- Meta -->
            <div
                class="flex items-center justify-between text-xs uppercase max-lg:mt-2 max-md:gap-0.5 sm:text-base"
            >
                <time
                    :datetime="startDatetime"
                    itemprop="startDate"
                    class="text-default/95 flex gap-0.5 font-bold tracking-widest md:gap-1.5"
                >
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
                        {{ formattedTime }}
                    </span>
                </time>

                <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
                    <meta
                        itemprop="price"
                        :content="String(isFree ? 0 : price ? price / 100 : 0)"
                    />
                    <meta itemprop="priceCurrency" content="RUB" />
                    <meta
                        itemprop="availability"
                        :content="
                            isUpcoming
                                ? 'https://schema.org/InStock'
                                : 'https://schema.org/Discontinued'
                        "
                    />
                    <span
                        :class="isUpcoming ? 'text-primary' : 'text-neutral-500'"
                        class="truncate font-bold"
                    >
                        {{ formattedPrice }}
                    </span>
                </div>
            </div>
        </div>
    </component>
</template>
