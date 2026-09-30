<script lang="ts" setup>
// Списание с депозита в сводке: переключатель и честная разбивка «с депозита / деньгами».
defineProps<{
    balance: number
    applied: number
    toPay: number | null
}>()

const useDeposit = defineModel<boolean>({ required: true })
</script>

<template>
    <div class="bg-default flex flex-col gap-2.5 rounded-sm px-4 py-3">
        <UCheckbox
            v-model="useDeposit"
            label="Оплатить с депозита"
            :description="`На депозите ${formatRubles(balance)}`"
        />

        <dl v-if="useDeposit && toPay !== null" class="flex flex-col gap-1 text-sm">
            <div class="flex justify-between gap-2">
                <dt class="text-muted font-semibold">Списать с депозита</dt>
                <dd class="text-secondary font-bold whitespace-nowrap">
                    − {{ formatRubles(applied) }}
                </dd>
            </div>
            <div class="flex justify-between gap-2">
                <dt class="text-muted font-semibold">К оплате деньгами</dt>
                <dd class="text-default font-bold whitespace-nowrap">{{ formatRubles(toPay) }}</dd>
            </div>
        </dl>
    </div>
</template>
