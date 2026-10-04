<template>
    <UiEmptyState
        class="bg-primary/5 rounded-md md:py-12"
        icon="ph:sparkle-duotone"
        title="Скоро откроем новые направления"
        description="Сейчас формируем группы на новый сезон. Загляните в полный каталог – там уже есть занятия, на которые можно записаться."
    >
        <UButton to="/clubs" size="xl" class="group w-fit">
            <span class="font-bold md:text-lg">Весь каталог</span>
            <UIcon
                name="ph:arrow-right-bold"
                class="size-4 transition group-hover:translate-x-1 md:size-5"
            />
        </UButton>
    </UiEmptyState>
</template>
