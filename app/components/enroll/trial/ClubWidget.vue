<script lang="ts" setup>
// Виджет выбора кружка (radiogroup) для записи на пробное занятие.
import type { Activity } from "~/types"

const props = defineProps<{
    clubs: Activity[]
}>()

const selectedClubId = defineModel<number | undefined>({ required: true })
const groupRef = ref<HTMLElement | null>(null)

// Roving tabindex: Tab попадает в группу один раз – на выбранный кружок или на первый.
const focusableClubId = computed(() => selectedClubId.value ?? props.clubs[0]?.id)

// Обрабатывает выбор кружка кликом по карточке.
function handleSelect(clubId: number) {
    selectedClubId.value = clubId
}

// Переключает выбор кружка стрелками клавиатуры внутри radiogroup.
function handleKeydown(event: KeyboardEvent) {
    const isNext = event.key === "ArrowRight" || event.key === "ArrowDown"
    const isPrev = event.key === "ArrowLeft" || event.key === "ArrowUp"
    if (!isNext && !isPrev) return

    const list = props.clubs
    if (list.length === 0) return

    event.preventDefault()
    const currentIndex = list.findIndex((c) => c.id === selectedClubId.value)
    const nextIndex =
        currentIndex === -1
            ? 0
            : isNext
              ? (currentIndex + 1) % list.length
              : (currentIndex - 1 + list.length) % list.length

    const target = list[nextIndex]
    if (!target) return

    selectedClubId.value = target.id
    nextTick(() => {
        const btn = groupRef.value?.querySelector<HTMLButtonElement>(
            `[data-club-id="${target.id}"]`
        )
        btn?.focus()
    })
}
</script>

<template>
    <section aria-label="Выбор кружка" class="flex flex-col gap-5 rounded-lg bg-white p-6">
        <div class="flex items-center gap-3">
            <div
                class="bg-primary/5 text-primary flex items-center justify-center rounded-full p-2"
            >
                <UIcon name="ph:shapes-bold" class="size-5" />
            </div>
            <h2 class="text-primary text-xl font-bold">Кружок</h2>
            <span class="text-muted ml-auto hidden text-sm sm:block">
                Пробное — разовое занятие в реальной группе
            </span>
        </div>

        <div
            ref="groupRef"
            role="radiogroup"
            aria-label="Кружок"
            class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
            @keydown="handleKeydown"
        >
            <EnrollTrialClubCard
                v-for="club in clubs"
                :key="club.id"
                :club="club"
                :is-selected="selectedClubId === club.id"
                :tabindex="club.id === focusableClubId ? 0 : -1"
                @select="handleSelect"
            />
        </div>
    </section>
</template>
