<script lang="ts" setup>
// Баланс депозита в шапке кабинета; история движений – в поповере, грузится при первом открытии.
const { balance, entries, ensureEntries } = useMeDeposit()
const { data: balanceData, pending: isBalancePending, error: balanceError } = balance
const {
    items,
    hasMore,
    isLoadingMore,
    loadMoreError,
    loadMore,
    pending: isEntriesPending,
    error: entriesError,
    refresh: refreshEntries
} = entries

const balanceText = computed(() =>
    balanceData.value == null ? "–" : formatRubles(balanceData.value)
)

const onOpenChange = (open: boolean) => {
    if (open) void ensureEntries()
}
</script>

<template>
    <UPopover :content="{ align: 'end', collisionPadding: 16 }" @update:open="onOpenChange">
        <UButton
            trailing-icon="ph:clock-counter-clockwise-bold"
            :loading="isBalancePending"
            :aria-label="`Депозит ${balanceText}, открыть историю`"
            class="whitespace-nowrap"
        >
            <span class="font-medium">Депозит</span>
            <span class="font-bold tabular-nums">
                {{ balanceError ? "–" : balanceText }}
            </span>
        </UButton>

        <template #content>
            <section class="flex w-80 flex-col gap-3 p-4" aria-label="История депозита">
                <div>
                    <h2 class="text-primary text-base font-bold">История депозита</h2>
                    <p class="text-muted mt-1 text-xs leading-snug">
                        Сюда переходит неиспользованный остаток истёкшего абонемента. Им можно
                        оплатить новый абонемент.
                    </p>
                </div>

                <USeparator />

                <div v-if="entriesError && !items" class="flex flex-col items-center gap-2 py-4">
                    <p class="text-muted text-sm">Не удалось загрузить историю.</p>
                    <UButton size="sm" variant="soft" label="Повторить" @click="refreshEntries()" />
                </div>

                <template v-else-if="items">
                    <ul
                        v-if="items.length > 0"
                        class="divide-default max-h-80 divide-y overflow-y-auto"
                    >
                        <MeDepositEntryItem v-for="entry in items" :key="entry.id" :entry="entry" />
                    </ul>
                    <p v-else class="text-muted py-2 text-sm italic">Движений пока не было</p>

                    <p v-if="loadMoreError" class="text-error text-center text-xs">
                        Не удалось загрузить ещё.
                    </p>
                    <UButton
                        v-if="hasMore"
                        size="sm"
                        variant="soft"
                        block
                        label="Показать ещё"
                        :loading="isLoadingMore"
                        @click="loadMore"
                    />
                </template>

                <div v-else class="flex flex-col gap-2" :aria-busy="isEntriesPending">
                    <USkeleton v-for="i in 3" :key="i" class="h-9 w-full" />
                </div>
            </section>
        </template>
    </UPopover>
</template>
