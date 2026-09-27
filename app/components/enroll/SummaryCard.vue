<script lang="ts" setup>
// Липкая карточка «Итого» в правой колонке страниц записи; содержимое задаёт страница.
</script>

<template>
    <aside
        id="enroll-summary"
        aria-label="Итого"
        class="scroll-mt-(--ui-header-height) lg:col-span-2"
    >
        <div
            class="flex h-fit shrink-0 flex-col gap-5 rounded-lg bg-white p-6 lg:sticky lg:top-[calc(var(--ui-header-height)+1rem)]"
        >
            <div class="flex items-center gap-3">
                <div
                    class="bg-primary/5 text-primary flex items-center justify-center rounded-full p-2"
                >
                    <UIcon name="ph:receipt-bold" class="size-5" aria-hidden="true" />
                </div>
                <h2 class="text-primary text-xl font-bold">Итого</h2>
            </div>

            <slot />
        </div>
    </aside>
</template>
