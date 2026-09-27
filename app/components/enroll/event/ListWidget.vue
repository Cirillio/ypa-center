<script lang="ts" setup>
// Виджет выбора события из афиши со скелетоном загрузки, обработкой ошибки и пустым состоянием.
import type { EventItem } from "~/types"

const SKELETON_KEYS = ["event-sk-1", "event-sk-2", "event-sk-3"] as const

const props = defineProps<{
    events: EventItem[]
    loading?: boolean
    error?: unknown
}>()

const emit = defineEmits<{
    retry: []
}>()

const selectedEventId = defineModel<number | undefined>({ required: true })
const groupRef = ref<HTMLElement | null>(null)

const { contactInfo } = useAppConfig()
const telegramHref = contactInfo.socials.find((s) => s.label === "Telegram")?.href

// Roving tabindex: Tab попадает в группу один раз – на выбранное событие или на первое с местами.
const focusableEventId = computed(
    () => selectedEventId.value ?? props.events.find((e) => e.availableSeats > 0)?.id
)

// Обновляет выбранное событие при клике на доступную карточку.
function handleSelect(eventId: number) {
    selectedEventId.value = eventId
}

// Переключает выбор между доступными событиями стрелками клавиатуры внутри radiogroup.
function handleKeydown(event: KeyboardEvent) {
    const isNext = event.key === "ArrowRight" || event.key === "ArrowDown"
    const isPrev = event.key === "ArrowLeft" || event.key === "ArrowUp"
    if (!isNext && !isPrev) return

    const availableEvents = props.events.filter((e) => e.availableSeats > 0)
    if (availableEvents.length === 0) return

    event.preventDefault()
    const currentIndex = availableEvents.findIndex((e) => e.id === selectedEventId.value)
    const nextIndex =
        currentIndex === -1
            ? 0
            : isNext
              ? (currentIndex + 1) % availableEvents.length
              : (currentIndex - 1 + availableEvents.length) % availableEvents.length

    const target = availableEvents[nextIndex]
    if (!target) return

    selectedEventId.value = target.id
    nextTick(() => {
        const btn = groupRef.value?.querySelector<HTMLButtonElement>(
            `[data-event-id="${target.id}"]`
        )
        btn?.focus()
    })
}
</script>

<template>
    <section aria-label="Выбор события" class="flex flex-col gap-5 rounded-lg bg-white p-6">
        <div class="flex items-center gap-3">
            <div
                class="bg-primary/5 text-primary flex items-center justify-center rounded-full p-2"
            >
                <UIcon name="ph:ticket-bold" class="size-5" />
            </div>
            <h2 class="text-primary text-xl font-bold">События</h2>
            <span class="text-muted ml-auto hidden text-sm sm:block">
                Вход в кабинет не нужен
            </span>
        </div>

        <!-- Скелетон загрузки -->
        <div v-if="loading" class="grid gap-3" aria-busy="true">
            <div
                v-for="skeletonKey in SKELETON_KEYS"
                :key="skeletonKey"
                class="bg-default flex flex-col gap-3 rounded-sm p-2 sm:flex-row"
            >
                <USkeleton
                    class="aspect-video w-full shrink-0 rounded-xs sm:aspect-square sm:w-36"
                />
                <div class="flex flex-1 flex-col justify-between gap-2 py-0.5 pr-1">
                    <div class="flex flex-col gap-1.5">
                        <USkeleton class="h-5 w-3/4 rounded-xs" />
                        <USkeleton class="h-4 w-full rounded-xs" />
                        <USkeleton class="h-4 w-2/3 rounded-xs" />
                    </div>
                    <div class="flex items-center justify-between gap-2">
                        <USkeleton class="h-5 w-40 rounded-xs" />
                        <USkeleton class="h-5 w-20 rounded-xs" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Ошибка загрузки -->
        <div v-else-if="error" class="flex flex-col items-center gap-3 py-8 text-center">
            <UIcon
                name="ph:warning-circle-duotone"
                class="text-secondary size-12 opacity-20"
                aria-hidden="true"
            />
            <p class="text-muted text-sm">
                Не удалось загрузить афишу событий. Попробуйте ещё раз.
            </p>
            <UButton variant="soft" size="sm" label="Повторить" @click="emit('retry')" />
        </div>

        <!-- Список событий -->
        <div
            v-else-if="events.length > 0"
            ref="groupRef"
            role="radiogroup"
            aria-label="Событие"
            class="grid gap-3"
            @keydown="handleKeydown"
        >
            <EnrollEventCard
                v-for="eventItem in events"
                :key="eventItem.id"
                :event="eventItem"
                :is-selected="selectedEventId === eventItem.id"
                :tabindex="eventItem.id === focusableEventId ? 0 : -1"
                @select="handleSelect"
            />
        </div>

        <!-- Пустая афиша -->
        <div v-else class="flex flex-col items-center gap-4 px-6 py-8 text-center">
            <UIcon
                name="ph:calendar-slash-duotone"
                class="text-primary/30 size-16"
                aria-hidden="true"
            />
            <div class="flex flex-col gap-1">
                <span class="text-default text-xl font-bold">Событий пока нет</span>
                <span class="text-muted text-base font-medium">
                    Следите за обновлениями — мы регулярно добавляем новые мероприятия
                </span>
            </div>
            <UButton
                v-if="telegramHref"
                :href="telegramHref"
                target="_blank"
                variant="soft"
                color="info"
                leading-icon="simple-icons:telegram"
                label="Подписаться на Telegram"
                size="lg"
            />
        </div>
    </section>
</template>
