<script lang="ts" setup>
import type { EventShort } from "~/types"

defineProps<{ events: EventShort[]; loading?: boolean }>()

const selectedEventId = defineModel<string | undefined>({ required: true })

const { contactInfo } = useAppConfig()
const telegramHref = contactInfo.socials.find((s) => s.label === "Telegram")?.href

function formatDate(dateStr: string): string {
    return new Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "long",
        weekday: "short"
    }).format(new Date(dateStr))
}
</script>

<template>
    <fieldset>
        <legend class="text-default text-2xl leading-tight font-bold">1. Выберите событие</legend>
        <div class="mt-2 grid grid-cols-1 gap-2">
            <!-- Loading skeleton -->
            <template v-if="loading">
                <div v-for="i in 3" :key="i" class="flex gap-3 rounded-sm bg-white p-2">
                    <USkeleton class="aspect-square w-24 shrink-0 rounded-xs" />
                    <div class="flex flex-1 flex-col justify-between py-0.5">
                        <USkeleton class="h-5 w-3/4 rounded-xs" />
                        <USkeleton class="h-4 w-full rounded-xs" />
                        <USkeleton class="h-4 w-1/2 rounded-xs" />
                    </div>
                </div>
            </template>

            <!-- Events list -->
            <template v-else-if="events.length > 0">
                <RadioCard
                    v-for="event in events"
                    :id="event.id"
                    :key="event.id"
                    v-model:selected="selectedEventId"
                    :title="event.label"
                    :img="event.img"
                    :img-alt="event.label"
                    radio-group="event"
                >
                    <div class="flex flex-col gap-1.5">
                        <p class="text-default/70 line-clamp-2 text-sm leading-relaxed font-medium">
                            {{ event.description }}
                        </p>
                        <div class="flex items-center justify-between text-sm font-bold">
                            <span class="text-default/80 flex items-center gap-1">
                                <UIcon
                                    name="ph:calendar-blank"
                                    class="text-primary/70 size-4 shrink-0"
                                />
                                {{ formatDate(event.date) }} · {{ event.time }}
                            </span>
                            <span class="text-primary">{{ event.price ?? "Бесплатно" }}</span>
                        </div>
                    </div>
                </RadioCard>
            </template>

            <!-- Empty state -->
            <div
                v-else
                class="flex flex-col items-center gap-4 rounded-sm bg-white px-6 py-12 text-center"
            >
                <UIcon name="ph:calendar-slash-duotone" class="text-primary/30 size-20" />
                <div class="flex flex-col gap-1">
                    <span class="text-default text-xl font-bold">Событий пока нет</span>
                    <span class="text-default/50 text-base font-medium">
                        Следите за обновлениями — мы регулярно добавляем новые мероприятия
                    </span>
                </div>
                <UButton
                    :href="telegramHref"
                    target="_blank"
                    variant="soft"
                    color="info"
                    leading-icon="simple-icons:telegram"
                    label="Подписаться на Telegram"
                    size="lg"
                />
            </div>
        </div>
    </fieldset>
</template>
