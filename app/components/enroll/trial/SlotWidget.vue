<script lang="ts" setup>
// Виджет выбора даты и времени пробного занятия: до выбора кружка, загрузка, ошибка, нет дат.
import type { TrialCheckoutSlot } from "~/types"

const SKELETON_KEYS = ["slot-sk-1", "slot-sk-2", "slot-sk-3", "slot-sk-4"] as const

const props = defineProps<{
    slots: TrialCheckoutSlot[]
    clubSelected: boolean
    loading?: boolean
    error?: unknown
}>()

const emit = defineEmits<{
    retry: []
}>()

const selectedSlotId = defineModel<number | undefined>({ required: true })
const groupRef = ref<HTMLElement | null>(null)

// Roving tabindex: Tab попадает в группу один раз – на выбранный слот или на первый свободный.
const focusableSlotId = computed(
    () => selectedSlotId.value ?? props.slots.find((s) => s.available > 0)?.id
)

// Обрабатывает выбор доступного слота по клику.
function handleSelect(slotId: number) {
    selectedSlotId.value = slotId
}

// Переключает выбор между доступными слотами стрелками клавиатуры внутри radiogroup.
function handleKeydown(event: KeyboardEvent) {
    const isNext = event.key === "ArrowRight" || event.key === "ArrowDown"
    const isPrev = event.key === "ArrowLeft" || event.key === "ArrowUp"
    if (!isNext && !isPrev) return

    const availableSlots = props.slots.filter((s) => s.available > 0)
    if (availableSlots.length === 0) return

    event.preventDefault()
    const currentIndex = availableSlots.findIndex((s) => s.id === selectedSlotId.value)
    const nextIndex =
        currentIndex === -1
            ? 0
            : isNext
              ? (currentIndex + 1) % availableSlots.length
              : (currentIndex - 1 + availableSlots.length) % availableSlots.length

    const target = availableSlots[nextIndex]
    if (!target) return

    selectedSlotId.value = target.id
    nextTick(() => {
        const btn = groupRef.value?.querySelector<HTMLButtonElement>(
            `[data-slot-id="${target.id}"]`
        )
        btn?.focus()
    })
}
</script>

<template>
    <section aria-label="Выбор даты и времени" class="flex flex-col gap-5 rounded-lg bg-white p-6">
        <div class="flex items-center gap-3">
            <div
                class="bg-primary/5 text-primary flex items-center justify-center rounded-full p-2"
            >
                <UIcon name="ph:calendar-dot-bold" class="size-5" />
            </div>
            <h2 class="text-primary text-xl font-bold">Дата и время</h2>
        </div>

        <div v-if="!clubSelected" class="flex flex-col items-center gap-2 py-8 text-center">
            <UIcon name="ph:lock-simple-bold" class="text-dimmed size-15" aria-hidden="true" />
            <p class="text-muted text-sm italic">Сначала выберите кружок</p>
        </div>

        <div v-else-if="loading" class="grid gap-3 md:grid-cols-2" aria-busy="true">
            <USkeleton
                v-for="skeletonKey in SKELETON_KEYS"
                :key="skeletonKey"
                class="h-26 rounded-sm"
            />
        </div>

        <UiErrorState
            v-else-if="error"
            message="Не удалось загрузить свободные даты."
            @retry="emit('retry')"
        />

        <div
            v-else-if="slots.length > 0"
            ref="groupRef"
            role="radiogroup"
            aria-label="Дата и время"
            class="grid gap-3 md:grid-cols-2"
            @keydown="handleKeydown"
        >
            <EnrollTrialSlotCard
                v-for="slotItem in slots"
                :key="slotItem.id"
                :slot-item="slotItem"
                :is-selected="selectedSlotId === slotItem.id"
                :tabindex="slotItem.id === focusableSlotId ? 0 : -1"
                @select="handleSelect"
            />
        </div>

        <p v-else class="text-muted py-4 text-center text-sm italic">
            Извините, все ближайшие даты заняты.
        </p>
    </section>
</template>
