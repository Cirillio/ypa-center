<script lang="ts" setup>
import type { WeeklySlot } from "~/types"

defineProps<{
    slots: WeeklySlot[]
    clubSelected: boolean
}>()

const selectedSlotId = defineModel<string | undefined>({ required: true })

const { formatSlotDate } = useFormatDate()
</script>

<template>
    <fieldset class="">
        <legend class="text-default mb-2 text-2xl leading-tight font-bold">
            2. Выберите удобное время
        </legend>

        <div v-if="!clubSelected" class="text-default px-4 py-3 text-lg italic">
            Сначала выберите кружок
        </div>

        <template v-else-if="slots.length > 0">
            <span class="text-default/80 text-lg font-semibold">Ближайшие доступные даты:</span>
            <div class="mt-2 grid gap-2">
                <RadioCard
                    v-for="slot in slots"
                    :id="String(slot.id)"
                    :key="slot.id"
                    v-model:selected="selectedSlotId"
                    :title="formatSlotDate(slot)"
                    radio-group="slot"
                >
                    <div class="flex justify-between">
                        <span>Группа: {{ slot.groupName }}</span>
                        <span :class="getCapacityTextColor(slot.available)">
                            Мест: {{ slot.available }}/{{ slot.maxCapacity }}
                        </span>
                    </div>
                </RadioCard>
            </div>
        </template>

        <div v-else class="text-default px-4 py-3 text-lg italic">
            Извините, все ближайшие даты заняты.
        </div>
    </fieldset>
</template>
